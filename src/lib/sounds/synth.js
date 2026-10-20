// Web Audio synth for all booth sounds — no binary assets needed.
// Click, pneumatic door hiss, latch thunk, water-spray loop during
// Becken/Desinfektion, dryer rumble during Trocknung, and a
// two-tone "done" chime.

let ctx = null
let muted = false
let spray = null
let dryer = null

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noise(seconds) {
  const a = ac()
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * seconds), a.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

function env(g, t0, peak, attack, decay) {
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(peak, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay)
}

function stopNodeSet(nodes, fadeMs) {
  if (!nodes) return
  const a = ac()
  const t = a.currentTime
  const n = nodes
  n.master.gain.cancelScheduledValues(t)
  n.master.gain.setValueAtTime(n.master.gain.value, t)
  n.master.gain.linearRampToValueAtTime(0, t + fadeMs / 1000)
  setTimeout(() => {
    for (const key of ['sources', 'oscs'].flatMap((k) => n[k] ?? [])) {
      try {
        key.stop()
      } catch {
        /* already stopped */
      }
    }
  }, fadeMs + 100)
}

export const sounds = {
  setMuted(m) {
    muted = m
    if (m) this.stopCleaning()
  },

  playClick() {
    if (muted) return
    const a = ac()
    const t = a.currentTime
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = 'square'
    o.frequency.value = 1900
    env(g, t, 0.1, 0.002, 0.05)
    o.connect(g).connect(a.destination)
    o.start(t)
    o.stop(t + 0.08)
  },

  playDoor() {
    if (muted) return
    const a = ac()
    const t = a.currentTime
    const src = a.createBufferSource()
    src.buffer = noise(1.4)
    const f = a.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.setValueAtTime(500, t)
    f.frequency.exponentialRampToValueAtTime(1400, t + 0.5)
    f.Q.value = 0.8
    const g = a.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.22, t + 0.12)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3)
    src.connect(f).connect(g).connect(a.destination)
    src.start(t)
    src.stop(t + 1.4)
  },

  playThunk() {
    if (muted) return
    const a = ac()
    const t = a.currentTime
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(110, t)
    o.frequency.exponentialRampToValueAtTime(55, t + 0.12)
    env(g, t, 0.4, 0.005, 0.25)
    o.connect(g).connect(a.destination)
    o.start(t)
    o.stop(t + 0.3)
  },

  // water spray — Becken / Desinfektion
  startSpray() {
    if (muted || spray) return
    const a = ac()
    const t = a.currentTime
    const src = a.createBufferSource()
    src.buffer = noise(2)
    src.loop = true
    const f = a.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 900
    const g = a.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.05, t + 0.5)
    // slow spray surges
    const lfo = a.createOscillator()
    const lg = a.createGain()
    lfo.frequency.value = 0.35
    lg.gain.value = 0.025
    lfo.connect(lg).connect(g.gain)
    const master = a.createGain()
    master.gain.value = 1
    src.connect(f).connect(g).connect(master).connect(a.destination)
    src.start(t)
    lfo.start(t)
    spray = { master, sources: [src], oscs: [lfo] }
  },

  stopSpray() {
    if (!spray) return
    stopNodeSet(spray, 400)
    spray = null
  },

  // dryer — Trocknung: hot-air blower. Deep air-rush (dominant) with a
  // fast rotor flutter, plus a modest motor hum underneath.
  startDryer() {
    if (muted || dryer) return
    const a = ac()
    const t = a.currentTime
    const master = a.createGain()
    master.gain.setValueAtTime(0, t)
    master.gain.linearRampToValueAtTime(1, t + 0.6)
    master.connect(a.destination)

    // deep air rush — the body of the sound
    const air = a.createBufferSource()
    air.buffer = noise(2)
    air.loop = true
    const lp = a.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 320
    lp.Q.value = 0.9
    const airGain = a.createGain()
    airGain.gain.value = 0.11

    // rotor flutter: fast amplitude pulsing on the air
    const flutter = a.createOscillator()
    const fg = a.createGain()
    flutter.type = 'triangle'
    flutter.frequency.value = 9
    fg.gain.value = 0.028
    flutter.connect(fg).connect(airGain.gain)

    // motor hum, filtered so it purrs rather than buzzes
    const motor = a.createOscillator()
    motor.type = 'sawtooth'
    motor.frequency.value = 115
    const mlp = a.createBiquadFilter()
    mlp.type = 'lowpass'
    mlp.frequency.value = 480
    const mg = a.createGain()
    mg.gain.value = 0.032
    // slow pitch drift like a real motor under load
    const drift = a.createOscillator()
    const dg = a.createGain()
    drift.frequency.value = 0.7
    dg.gain.value = 4
    drift.connect(dg).connect(motor.frequency)

    // second harmonic
    const hum = a.createOscillator()
    hum.type = 'triangle'
    hum.frequency.value = 230
    const hg = a.createGain()
    hg.gain.value = 0.009

    // faint high hiss for realism
    const hiss = a.createBufferSource()
    hiss.buffer = noise(2)
    hiss.loop = true
    const bp = a.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2400
    bp.Q.value = 0.4
    const bg = a.createGain()
    bg.gain.value = 0.006

    air.connect(lp).connect(airGain).connect(master)
    motor.connect(mlp).connect(mg).connect(master)
    hum.connect(hg).connect(master)
    hiss.connect(bp).connect(bg).connect(master)
    air.start(t)
    flutter.start(t)
    motor.start(t)
    drift.start(t)
    hum.start(t)
    hiss.start(t)
    dryer = { master, sources: [air, hiss], oscs: [flutter, motor, drift, hum] }
  },

  stopDryer() {
    if (!dryer) return
    stopNodeSet(dryer, 500)
    dryer = null
  },

  // phase-aware entry point: swap spray ↔ dryer as cleaning advances
  cleaningPhase(phase) {
    if (phase === 'trocknung') {
      this.stopSpray()
      this.startDryer()
    } else {
      this.stopDryer()
      this.startSpray()
    }
  },

  startCleaning() {
    this.startSpray()
  },

  stopCleaning() {
    this.stopSpray()
    this.stopVacuum()
  },

  playChime() {
    if (muted) return
    const a = ac()
    const t = a.currentTime
    for (const [i, fq] of [660, 880].entries()) {
      const o = a.createOscillator()
      const g = a.createGain()
      o.type = 'sine'
      o.frequency.value = fq
      env(g, t + i * 0.18, 0.18, 0.01, 0.5)
      o.connect(g).connect(a.destination)
      o.start(t + i * 0.18)
      o.stop(t + i * 0.18 + 0.6)
    }
  },
}
