<script>
  // The round red door button: metal mount ring + lit red dome.
  // Pulses softly while the toilet is FREI to invite a press.
  let { onpress, pulse = false } = $props()
</script>

<div class="mount" class:pulse>
  <button class="dome" onclick={onpress} aria-label="Tür öffnen"></button>
</div>

<style>
  .mount {
    position: relative;
    width: 78px;
    height: 78px;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 42%, #dcdad6 0%, #a9a8a4 55%, #7c7b77 100%);
    padding: 7px;
    box-shadow:
      inset 0 2px 3px rgba(255, 255, 255, 0.5),
      inset 0 -3px 5px rgba(0, 0, 0, 0.45),
      0 3px 6px rgba(0, 0, 0, 0.35);
  }
  .dome {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background: radial-gradient(circle at 34% 28%, #ff7a5e 0%, #ef452a 45%, #bd2407 85%);
    box-shadow:
      inset 0 -7px 10px rgba(0, 0, 0, 0.45),
      inset 0 5px 7px rgba(255, 255, 255, 0.4),
      0 0 16px rgba(236, 58, 33, 0.55);
    transition:
      transform 90ms ease,
      box-shadow 90ms ease;
  }
  .dome:active {
    transform: scale(0.88) translateY(2px);
    box-shadow:
      inset 0 -4px 7px rgba(0, 0, 0, 0.5),
      inset 0 3px 5px rgba(255, 255, 255, 0.3),
      0 0 10px rgba(236, 58, 33, 0.4);
  }
  .pulse::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 3px solid rgba(236, 58, 33, 0.55);
    animation: pulse 2s ease-out infinite;
    pointer-events: none;
  }
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    70% {
      transform: scale(1.35);
      opacity: 0;
    }
    100% {
      transform: scale(1.35);
      opacity: 0;
    }
  }
</style>

