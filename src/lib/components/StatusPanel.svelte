<script>
  // The LCD status display. Same panel, three faces:
  //   frei/occupied → backlit green/red sign (photos 1+2)
  //   cleaning      → white/teal progress screen with ghosted BESETZT behind
  let { status, progress = 0, phase = null } = $props()

  const PHASES = [
    { key: 'becken', de: 'Becken', en: 'Bowl' },
    { key: 'desinfektion', de: 'Desinfektion', en: 'Disinfection' },
    { key: 'trocknung', de: 'Trocknung', en: 'Drying' },
  ]

  let cleaning = $derived(status === 'cleaning')
  let activeIdx = $derived(PHASES.findIndex((p) => p.key === phase))
  // bar climbs in visible 20 % steps: 0 → 20 → … → 100
  let pct = $derived(Math.min(100, Math.floor(progress / 20) * 20))
</script>

<div class="lcd" class:red={status === 'occupied'} class:green={status === 'frei' || status === 'opening'}>
  {#if cleaning}
    <div class="ghost">BESETZT&#8194;OCCUPIED&#8194;0800 092 55 24</div>

    <div class="clean-top">
      <div class="c1">Toilette wird gereinigt</div>
      <div class="c2">Cleaning in progress</div>
    </div>

    <div class="clean-bottom">
      <div class="phases">
        {#each PHASES as p, i (p.key)}
          <div class="ph" class:active={i === activeIdx} class:past={activeIdx > i}>
            <div class="de">{p.de}</div>
            <div class="en">{p.en}</div>
          </div>
        {/each}
      </div>

      <div class="bar" style:--p="{pct}">
        <div class="fill">
          {#if pct > 0}
            <span class="pct">{pct}%</span>
          {/if}
        </div>
      </div>

      <div class="wait1">Bitte warten Sie, bis der Vorgang abgeschlossen ist</div>
      <div class="wait2">Please wait until the cleaning process is completed</div>
    </div>
  {:else}
    <div class="stack">
      <div class="big">{status === 'occupied' ? 'BESETZT' : 'FREI'}</div>
      <div class="rule"></div>
      <div class="sub">{status === 'occupied' ? 'OCCUPIED' : 'FREE'}</div>
      <div class="hl-label">Information &amp; Service Hotline</div>
      <div class="hl-num">0800 092 55 24</div>
    </div>
  {/if}

  <div class="scan"></div>
  <div class="glass"></div>
</div>

<style>
  .lcd {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    overflow: hidden;
    color: #fff;
  }
  .red {
    background: radial-gradient(ellipse at 50% 35%, #ff5335 0%, #ec3a21 55%, #d02c14 100%);
    box-shadow: 0 0 34px rgba(236, 58, 33, 0.55);
  }
  .green {
    background: radial-gradient(ellipse at 50% 35%, #47b54a 0%, #2f9c39 55%, #25872f 100%);
    box-shadow: 0 0 34px rgba(46, 180, 70, 0.45);
  }

  /* FREI / BESETZT face */
  .stack {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.55);
  }
  .big {
    font-size: 46px;
    font-weight: 700;
    letter-spacing: 1px;
    line-height: 1;
  }
  .rule {
    width: 86%;
    border-bottom: 3px solid #fff;
    margin: 7px 0 6px;
  }
  .sub {
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 2px;
  }
  .hl-label {
    margin-top: 16px;
    font-size: 10.5px;
    letter-spacing: 0.4px;
    opacity: 0.95;
  }
  .hl-num {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  /* cleaning face */
  .ghost {
    position: absolute;
    inset: 34% 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.13);
    overflow: hidden;
  }
  .clean-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 34%;
    background: #f4f3f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .c1 {
    font-size: 21px;
    font-weight: 600;
    color: #16323f;
  }
  .c2 {
    margin-top: 2px;
    font-size: 14px;
    color: #3c4a52;
  }
  .clean-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 66%;
    background: linear-gradient(180deg, #124453 0%, #0b3240 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 18px;
  }
  .phases {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .ph {
    text-align: center;
  }
  .de {
    font-size: 11.5px;
    font-weight: 700;
  }
  .en {
    font-size: 9px;
    color: #b9cdd4;
  }
  .ph.active .de {
    text-shadow: 0 0 8px rgba(120, 220, 255, 0.9);
    transform: scale(1.06);
  }
  .ph.past {
    opacity: 0.55;
  }
  .bar {
    position: relative;
    height: 30px;
    border: 2px solid #fff;
    border-radius: 2px;
  }
  .fill {
    position: relative;
    height: 100%;
    width: calc(var(--p) * 1%);
    background: linear-gradient(180deg, #63cf4f 0%, #4cb53a 100%);
    box-shadow: 0 0 10px rgba(85, 193, 66, 0.7);
  }
  .pct {
    position: absolute;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    font-weight: 700;
    color: #fff;
  }
  .wait1 {
    margin-top: 9px;
    text-align: center;
    font-size: 10.5px;
    font-weight: 700;
  }
  .wait2 {
    margin-top: 1px;
    text-align: center;
    font-size: 9.5px;
  }

  /* LCD texture overlays */
  .scan {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.06) 0px,
      rgba(0, 0, 0, 0.06) 1px,
      transparent 1px,
      transparent 3px
    );
  }
  .glass {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(115deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 16%, transparent 30%);
  }
</style>
