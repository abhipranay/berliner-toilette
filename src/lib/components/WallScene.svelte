<script>
  // The booth panel (map + icons + info panel) fills the viewport:
  // designed at a fixed pixel size and uniformly scaled to fit, so
  // proportions stay photo-exact at any window size.
  import MapScreen from './MapScreen.svelte'
  import IconRow from './IconRow.svelte'
  import InfoPanel from './InfoPanel.svelte'

  let { status, progress, phase, onpress } = $props()

  const W = 764
  const H = 1128

  let scale = $state(1)
  function fit() {
    scale = Math.min(window.innerWidth / W, window.innerHeight / H) * 0.985
  }
  $effect(() => {
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  })
</script>

<div class="backdrop">
  <div
    class="stage"
    style:width="{W}px"
    style:height="{H}px"
    style:transform="translate(-50%, -50%) scale({scale})"
  >
    <div class="bezel">
      <div class="map-wrap"><MapScreen /></div>
      <div class="icons"><IconRow /></div>
      <div class="metal-wrap"><InfoPanel {status} {progress} {phase} {onpress} /></div>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: radial-gradient(ellipse at 50% 40%, #3a3c3f 0%, #232426 100%);
  }
  /* faint photographic vignette */
  .backdrop::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
  }

  .stage {
    position: absolute;
    left: 50%;
    top: 50%;
  }
  .bezel {
    width: 732px;
    background: linear-gradient(180deg, #26272a, #1b1c1e);
    border-radius: 6px;
    padding: 16px;
    box-shadow:
      0 18px 50px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  .map-wrap {
    height: 380px;
    border-radius: 3px;
    overflow: hidden;
    border: 2px solid #0a0b0c;
  }
  .icons {
    height: 96px;
    background: #131416;
    display: flex;
    align-items: center;
  }
  .metal-wrap {
    height: 620px;
    border-radius: 3px;
    overflow: hidden;
  }
</style>
