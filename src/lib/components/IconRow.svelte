<script>
  // Payment terminal window, WC pin logo, flags and no-smoking sign
  // exactly as they sit under the map screen on the real facade.
</script>

<div class="row">
  <!-- card terminal in recessed window -->
  <div class="terminal">
    <div class="device">
      <span class="dev-brand">iUC150 B</span>
      <span class="dev-make">ingenico</span>
      <svg viewBox="0 0 40 40" class="waves">
        <path d="M12 26 a10 10 0 0 1 0 -12" fill="none" stroke="#3a3a3a" stroke-width="2.4" stroke-linecap="round" />
        <path d="M17 29 a15 15 0 0 1 0 -18" fill="none" stroke="#3a3a3a" stroke-width="2.4" stroke-linecap="round" />
        <path d="M22 32 a20 20 0 0 1 0 -24" fill="none" stroke="#3a3a3a" stroke-width="2.4" stroke-linecap="round" />
        <path d="M27 21 l7 -3 M27 26 l7 3" stroke="#3a3a3a" stroke-width="2.2" stroke-linecap="round" />
      </svg>
    </div>
  </div>

  <!-- WC pin badge -->
  <div class="pin">
    <svg viewBox="0 0 80 80">
      <path
        d="M40 12 C28 12 20 21 20 32 C20 46 40 66 40 66 C40 66 60 46 60 32 C60 21 52 12 40 12 Z"
        fill="#fff"
      />
      <circle cx="40" cy="31" r="13" fill="#2a5fb0" />
      <text x="40" y="36" text-anchor="middle" class="pin-wc">WC</text>
      <path d="M26 70 q14 8 28 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" />
    </svg>
  </div>

  <!-- German flag -->
  <div class="flag">
    <div class="stripe black"></div>
    <div class="stripe red"></div>
    <div class="stripe gold"></div>
    <div class="gloss"></div>
  </div>

  <!-- no smoking -->
  <div class="nosmoke">
    <svg viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="33" fill="#fff" stroke="#d32f22" stroke-width="7" />
      <g transform="rotate(-16 36 40)">
        <rect x="14" y="36" width="42" height="9" rx="2" fill="#e9e7e2" stroke="#b9b7b2" stroke-width="1" />
        <rect x="14" y="36" width="12" height="9" rx="2" fill="#c8a25e" />
        <rect x="48" y="36" width="8" height="9" fill="#d32f22" />
        <path d="M30 28 q3 -5 0 -9 M38 28 q3 -5 0 -9" fill="none" stroke="#9aa0a4" stroke-width="2.4" stroke-linecap="round" />
      </g>
    </svg>
  </div>

  <!-- UK flag -->
  <div class="flag uk">
    <svg viewBox="0 0 60 40" preserveAspectRatio="none">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" stroke-width="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#c8102e" stroke-width="3.5" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" stroke-width="12" />
      <path d="M30 0 V40 M0 20 H60" stroke="#c8102e" stroke-width="7" />
    </svg>
    <div class="gloss"></div>
  </div>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 14px;
  }
  .terminal {
    width: 112px;
    height: 86px;
    border-radius: 10px;
    background: linear-gradient(180deg, #16171a, #1f2124);
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.8),
      0 1px 0 rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .device {
    position: relative;
    width: 88px;
    height: 64px;
    border-radius: 7px;
    background: linear-gradient(160deg, #ffffff, #d9d8d4);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  }
  .dev-brand {
    position: absolute;
    top: 4px;
    left: 6px;
    font-size: 7px;
    font-weight: 700;
    color: #444;
  }
  .dev-make {
    position: absolute;
    top: 4px;
    right: 6px;
    font-size: 7px;
    color: #888;
  }
  .waves {
    position: absolute;
    bottom: 4px;
    left: 8px;
    width: 34px;
    height: 34px;
  }
  .pin {
    width: 84px;
    height: 84px;
    border-radius: 16px;
    background: linear-gradient(180deg, #2a5fb0, #16386f);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    padding: 5px;
  }
  .pin svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .pin-wc {
    font-family: var(--font-facade);
    font-size: 13px;
    font-weight: 700;
    fill: #fff;
  }
  .flag {
    position: relative;
    width: 86px;
    height: 58px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  }
  .stripe {
    height: 33.4%;
  }
  .black {
    background: #1a1a1a;
  }
  .red {
    background: #dd0000;
  }
  .gold {
    background: #ffce00;
  }
  .uk svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .gloss {
    position: absolute;
    inset: 0;
    background: linear-gradient(155deg, rgba(255, 255, 255, 0.16) 0%, transparent 40%);
    pointer-events: none;
  }
  .nosmoke {
    width: 76px;
    height: 76px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  .nosmoke svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
