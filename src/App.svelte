<script>
  import { onMount } from 'svelte'
  import { createToiletMachine } from './machine/toiletMachine.js'
  import { sounds } from './lib/sounds/synth.js'
  import WallScene from './lib/components/WallScene.svelte'
  import DoorOverlay from './lib/components/DoorOverlay.svelte'

  const machine = createToiletMachine()

  let status = $state('frei')
  let progress = $state(0)
  let phase = $state(null)
  let muted = $state(false)
  try {
    muted = localStorage.getItem('toilet-muted') === 'true'
  } catch {
    /* storage unavailable */
  }

  // Sound cues fire on state and phase transitions, straight from the machine.
  machine.subscribe((s) => {
    if (s.status !== status) {
      if (s.status === 'opening') {
        sounds.playClick()
        sounds.playDoor()
      } else if (status === 'opening' && s.status === 'occupied') {
        sounds.playThunk()
      } else if (s.status === 'cleaning') {
        sounds.cleaningPhase(s.phase)
      } else if (status === 'cleaning' && s.status === 'frei') {
        sounds.stopCleaning()
        sounds.playChime()
      }
      status = s.status
    } else if (s.status === 'cleaning' && s.phase !== phase) {
      // drying begins: spray swaps to the vacuum motor
      sounds.cleaningPhase(s.phase)
    }
    progress = s.progress
    phase = s.phase
  })

  onMount(() => {
    if (import.meta.env.DEV) window.__machine = machine
    sounds.setMuted(muted)
    let raf
    let last = performance.now()
    const loop = (t) => {
      try {
        machine.advance(t - last)
      } catch (e) {
        console.error('machine advance failed', e)
      }
      last = t
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })

  function press() {
    machine.press()
  }
  function toggleMute() {
    muted = !muted
    sounds.setMuted(muted)
    try {
      localStorage.setItem('toilet-muted', String(muted))
    } catch {
      /* storage unavailable */
    }
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen?.()
    }
  }
</script>

<WallScene {status} {progress} {phase} onpress={press} />
<DoorOverlay active={status === 'opening'} />

<div class="fixed bottom-3 right-3 z-50 flex gap-2">
  <button class="ctl" onclick={toggleMute} aria-label="Ton an/aus">{muted ? '🔇' : '🔊'}</button>
  <button class="ctl" onclick={toggleFullscreen} aria-label="Vollbild">⛶</button>
</div>

<style>
  .ctl {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: rgba(20, 20, 22, 0.55);
    color: #ddd;
    font-size: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    cursor: pointer;
    backdrop-filter: blur(4px);
  }
</style>
