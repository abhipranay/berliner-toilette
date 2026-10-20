import { describe, it, expect } from 'vitest'
import { createToiletMachine, TIMINGS } from './toiletMachine.js'

describe('toilet state machine', () => {
  it('starts FREI with no cleaning progress', () => {
    const m = createToiletMachine()
    expect(m.status).toBe('frei')
    expect(m.progress).toBe(0)
    expect(m.phase).toBe(null)
  })

  it('pressing the button in FREI opens the door (opening state)', () => {
    const m = createToiletMachine()
    expect(m.press()).toBe(true)
    expect(m.status).toBe('opening')
  })

  it('presses while opening, occupied or cleaning are ignored', () => {
    const m = createToiletMachine()
    m.press()
    expect(m.press()).toBe(false)
    expect(m.status).toBe('opening')

    m.advance(TIMINGS.openingMs)
    expect(m.status).toBe('occupied')
    expect(m.press()).toBe(false)

    m.advance(TIMINGS.occupiedMs)
    expect(m.status).toBe('cleaning')
    expect(m.press()).toBe(false)
  })

  it('door opening completes after openingMs → BESETZT (occupied)', () => {
    const m = createToiletMachine()
    m.press()
    m.advance(TIMINGS.openingMs - 1)
    expect(m.status).toBe('opening')
    m.advance(1)
    expect(m.status).toBe('occupied')
  })

  it('BESETZT holds occupiedMs, then cleaning starts at 0%', () => {
    const m = createToiletMachine()
    m.press()
    m.advance(TIMINGS.openingMs)
    m.advance(TIMINGS.occupiedMs - 1)
    expect(m.status).toBe('occupied')
    expect(m.progress).toBe(0)
    m.advance(1)
    expect(m.status).toBe('cleaning')
    expect(m.progress).toBe(0)
  })

  it('cleaning progress maps to the three real phases', () => {
    const m = createToiletMachine()
    m.press()
    m.advance(TIMINGS.openingMs + TIMINGS.occupiedMs)

    // cleaning total = 3 phases; boundary thirds: ~33.33% / ~66.67%
    m.advance(TIMINGS.cleaningMs * 0.1)
    expect(m.progress).toBeCloseTo(10, 0)
    expect(m.phase).toBe('becken')

    m.advance(TIMINGS.cleaningMs * 0.4) // → 50%
    expect(m.progress).toBeCloseTo(50, 0)
    expect(m.phase).toBe('desinfektion')

    m.advance(TIMINGS.cleaningMs * 0.4) // → 90%
    expect(m.progress).toBeCloseTo(90, 0)
    expect(m.phase).toBe('trocknung')
  })

  it('cleaning reaches exactly 100% and holds before FREI returns', () => {
    const m = createToiletMachine()
    m.press()
    m.advance(TIMINGS.openingMs + TIMINGS.occupiedMs)
    m.advance(TIMINGS.cleaningMs - 1)
    expect(m.progress).toBeLessThan(100)
    m.advance(1)
    expect(m.status).toBe('cleaning')
    expect(m.progress).toBe(100)
    expect(m.phase).toBe('trocknung')
    m.advance(TIMINGS.completeHoldMs - 1)
    expect(m.status).toBe('cleaning')
    expect(m.progress).toBe(100)
    m.advance(1)
    expect(m.status).toBe('frei')
    expect(m.progress).toBe(0)
    expect(m.phase).toBe(null)
    expect(m.press()).toBe(true)
  })

  it('notifies subscribers on every state change', () => {
    const m = createToiletMachine()
    const seen = []
    const unsubscribe = m.subscribe((s) => seen.push(s.status))
    m.press()
    m.advance(TIMINGS.openingMs)
    m.advance(TIMINGS.occupiedMs)
    m.advance(TIMINGS.cleaningMs + TIMINGS.completeHoldMs)
    unsubscribe()
    expect(seen).toEqual(['opening', 'occupied', 'cleaning', 'frei'])
  })
})
