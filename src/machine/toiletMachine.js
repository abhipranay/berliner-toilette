// Toilet state machine — frei → opening → occupied → cleaning → frei
// Driven by advance(dtMs) from a single frame loop; no internal timers,
// so tests simulate time deterministically.

export const TIMINGS = {
  openingMs: 1500,    // pneumatic door swing
  occupiedMs: 30000,  // real booth: 20 min, sped up for play
  cleaningMs: 45000,  // 3 × 15 s: Becken → Desinfektion → Trocknung
  completeHoldMs: 2500, // bar sits at 100 % before the sign returns to FREI
}

const PHASE_COUNT = 3

export function createToiletMachine() {
  let status = 'frei'
  let progress = 0 // 0..100, only meaningful while cleaning
  let elapsedInStatus = 0
  const listeners = new Set()
  let snapshot = null

  function derivedPhase() {
    if (status !== 'cleaning') return null
    if (progress < 100 / PHASE_COUNT) return 'becken'
    if (progress < 200 / PHASE_COUNT) return 'desinfektion'
    return 'trocknung'
  }

  function emit() {
    snapshot = { status, progress, phase: derivedPhase() }
    for (const listener of listeners) listener(snapshot)
  }

  emit()

  return {
    get status() {
      return snapshot.status
    },
    get progress() {
      return snapshot.progress
    },
    get phase() {
      return snapshot.phase
    },
    press() {
      if (status !== 'frei') return false
      status = 'opening'
      elapsedInStatus = 0
      emit()
      return true
    },
    advance(dtMs) {
      if (dtMs <= 0 || status === 'frei') return
      let remaining = dtMs
      // Cascade: one big step (e.g. background-tab catch-up) may cross
      // several state boundaries — process all of the remaining time.
      while (remaining > 0 && status !== 'frei') {
        elapsedInStatus += remaining
        if (status === 'opening') {
          if (elapsedInStatus >= TIMINGS.openingMs) {
            remaining = elapsedInStatus - TIMINGS.openingMs
            status = 'occupied'
            elapsedInStatus = 0
            emit()
          } else {
            remaining = 0
          }
        } else if (status === 'occupied') {
          if (elapsedInStatus >= TIMINGS.occupiedMs) {
            remaining = elapsedInStatus - TIMINGS.occupiedMs
            status = 'cleaning'
            progress = 0
            elapsedInStatus = 0
            emit()
          } else {
            remaining = 0
          }
        } else if (status === 'cleaning') {
          progress = Math.min(100, (elapsedInStatus / TIMINGS.cleaningMs) * 100)
          if (progress >= 100) {
            // hold the completed bar visible before flipping back to FREI
            progress = 100
            if (elapsedInStatus >= TIMINGS.cleaningMs + TIMINGS.completeHoldMs) {
              status = 'frei'
              progress = 0
              elapsedInStatus = 0
            }
          }
          emit()
          remaining = 0
        }
      }
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
