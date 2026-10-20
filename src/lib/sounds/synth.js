// Web Audio synth for all booth sounds — no binary assets needed.
// Click, pneumatic door hiss, latch thunk, water-spray loop during
// Becken/Desinfektion, hand-dryer blast during Trocknung, and a
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

  // dryer — Trocknung: hand dryer. Dominant air blast with jet
  // turbulence, plus the motor whine spinning up on entry.
  startDryer() {
    if (muted || dryer) return
    const a = ac()
    const t = a.currentTime
    const master = a.createGain()
    master.gain.setValueAtTime(0, t)
    master.gain.linearRampToValueAtTime(1, t + 0.5)
    master.connect(a.destination)

    // the blast: warm body of forced air
    const blast = a.createBufferSource()
    blast.buffer = noise(4)
    blast.loop = true
    const blastLp = a.createBiquadFilter()
    blastLp.type = 'lowpass'
    blastLp.frequency.value = 520
    blastLp.Q.value = 0.7
    const blastGain = a.createGain()
    blastGain.gain.value = 0.14

    // jet turbulence: fast roughness on the air (feels like a jet, not a tone)
    const turb = a.createOscillator()
    const turbGain = a.createGain()
    turb.type = 'sine'
    turb.frequency.value = 22
    turbGain.gain.value = 0.035
    turb.connect(turbGain).connect(blastGain.gain)

    // bright air hiss
    const hiss = a.createBufferSource()
    hiss.buffer = noise(4)
    hiss.loop = true
    const hissBp = a.createBiquadFilter()
    hissBp.type = 'bandpass'
    hissBp.frequency.value = 3200
    hissBp.Q.value = 0.4
    const hissGain = a.createGain()
    hissGain.gain.value = 0.028

    // motor whine spinning up, like a hand dryer switching on
    const whine = a.createOscillator()
    const whineGain = a.createGain()
    whine.type = 'triangle'
    whine.frequency.setValueAtTime(200, t)
    whine.frequency.exponentialRampToValueAtTime(520, t + 1.0)
    whineGain.gain.value = 0.022
    const vib = a.createOscillator()
    const vibGain = a.createGain()
    vib.frequency.value = 6
    vibGain.gain.value = 8
    vib.connect(vibGain).connect(whine.frequency)

    blast.connect(blastLp).connect(blastGain).connect(master)
    hiss.connect(hissBp).connect(hissGain).connect(master)
    whine.connect(whineGain).connect(master)
    blast.start(t)
    hiss.start(t)
    turb.start(t)
    whine.start(t)
    vib.start(t)
    dryer = { master, sources: [blast, hiss], oscs: [turb, whine, vib] }
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
    this.stopDryer()
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
