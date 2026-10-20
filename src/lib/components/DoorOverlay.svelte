<script>
  // Shown while the machine is in the 'opening' state: the stainless
  // booth door slides aside (pneumatic style), then the facade shows
  // BESETZT underneath.
  import { tweened } from 'svelte/motion'
  import { cubicInOut } from 'svelte/easing'

  let { active = false } = $props()

  const slide = tweened(0, { duration: 1350, easing: cubicInOut })
  $effect(() => {
    slide.set(active ? 1 : 0)
  })
</script>

{#if active}
  <div class="overlay" style:transform="translateX({$slide * 110}vw)">
    <div class="door">
      <div class="plate">BERLINER TOILETTE</div>
      <div class="handle"></div>
      <div class="kick"></div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
    will-change: transform;
  }
  .door {
    position: absolute;
    inset: 0;
    background-image: var(--noise),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 4px),
      linear-gradient(90deg, #54575b 0%, #6b6e72 18%, #595c60 50%, #67696d 78%, #4c4f53 100%);
    background-blend-mode: overlay, normal, normal;
    box-shadow: 24px 0 60px rgba(0, 0, 0, 0.6);
  }
  .plate {
    position: absolute;
    top: 12%;
    left: 50%;
    transform: translateX(-50%);
    background: #d8d7d3;
    color: #333;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    padding: 8px 22px;
    border-radius: 3px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }
  .handle {
    position: absolute;
    right: 8%;
    top: 48%;
    width: 74px;
    height: 74px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f2f1ee, #a9a8a4 55%, #6e6d69 100%);
    box-shadow:
      inset 0 -4px 8px rgba(0, 0, 0, 0.4),
      0 3px 8px rgba(0, 0, 0, 0.5);
  }
  .kick {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 22%;
    background: linear-gradient(180deg, #4a4d50, #3a3d40);
    border-top: 2px solid rgba(255, 255, 255, 0.08);
  }
</style>
