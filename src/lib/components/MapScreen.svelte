<script>
  // Stylized replica of the Biesdorf map shown on the booth's screen.
  const stations = [
    { x: 235, y: 92, kind: 'S', label: 'S Biesdorf' },
    { x: 480, y: 120, kind: 'U', label: 'U Wuhletal' },
    { x: 408, y: 218, kind: 'U', label: 'U Elsterwerdaer Platz' },
  ]
</script>

<div class="screen">
  <svg viewBox="0 0 660 400" preserveAspectRatio="xMidYMid slice">
    <rect width="660" height="400" fill="#eef0ea" />

    <g class="drift">
      <!-- parks -->
      <path d="M420 8 C500 -10 600 20 640 60 C660 90 640 150 580 165 C510 182 470 150 450 110 C432 76 400 22 420 8 Z" fill="#cfe3bf" />
      <path d="M282 150 C330 138 372 158 378 192 C384 228 350 258 306 254 C268 250 252 214 258 186 C262 166 268 154 282 150 Z" fill="#c6dcb4" />
      <path d="M120 240 C160 228 210 240 224 268 C236 294 214 320 176 320 C140 320 108 296 108 270 C108 254 110 244 120 240 Z" fill="#cfe3bf" />

      <!-- water -->
      <ellipse cx="152" cy="330" rx="34" ry="18" fill="#aecadf" />
      <ellipse cx="222" cy="352" rx="20" ry="11" fill="#aecadf" />

      <!-- railway -->
      <path d="M60 180 L200 260 L360 340 L560 420" stroke="#8a8d90" stroke-width="7" fill="none" />
      <path d="M60 180 L200 260 L360 340 L560 420" stroke="#f4f2ee" stroke-width="2" stroke-dasharray="10 14" fill="none" />

      <!-- main roads -->
      <path d="M-10 120 L200 150 L420 200 L670 260" stroke="#e8c96a" stroke-width="9" fill="none" stroke-linecap="round" />
      <path d="M340 -10 L360 130 L410 300 L430 420" stroke="#e8c96a" stroke-width="8" fill="none" stroke-linecap="round" />

      <!-- streets -->
      <g stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round">
        <path d="M20 60 L240 90 L520 130" />
        <path d="M90 250 L260 280 L420 330 L600 350" />
        <path d="M140 40 L170 180 L200 320" />
        <path d="M470 40 L450 160 L470 260" />
        <path d="M520 250 L610 280 L660 288" />
        <path d="M40 330 L200 350" />
      </g>
      <g stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M280 60 L300 200" />
        <path d="M560 60 L540 180" />
        <path d="M120 120 L340 140" />
        <path d="M380 60 L470 90" />
        <path d="M240 320 L340 355" />
        <path d="M480 170 L560 210 L640 220" />
        <path d="M180 190 L260 220 L330 240" />
        <path d="M420 260 L500 300 L540 350" />
        <path d="M60 220 L110 260 L130 310" />
        <path d="M340 220 L390 260 L400 320" />
      </g>

      <!-- labels -->
      <text x="318" y="120" class="lbl big">BIESDORF</text>
      <text x="520" y="98" class="lbl">Biesdorfer Höhe</text>
      <text x="120" y="368" class="lbl small">Biesdorfer Baggersee</text>
      <text x="292" y="176" class="lbl small">Schlosspark</text>
      <text x="180" y="236" class="lbl small">Kavalierstraße</text>
      <text x="70" y="130" class="lbl small">Alt-Biesdorf</text>

      <!-- station badges -->
      {#each stations as s}
        <g transform="translate({s.x} {s.y})">
          <rect x="-13" y="-11" width="26" height="20" rx="9" fill={s.kind === 'U' ? '#1d5fa8' : '#2e7d32'} />
          <text x="0" y="4" text-anchor="middle" class="badge">{s.kind}</text>
          <text x="17" y="4" class="lbl small">{s.label}</text>
        </g>
      {/each}

      <!-- position marker -->
      <g class="ping" transform="translate(376 252)">
        <circle r="13" fill="#d33a26" opacity="0.35">
          <animate attributeName="r" values="10;20;10" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle r="8" fill="#d33a26" stroke="#fff" stroke-width="2.5" />
      </g>
    </g>

    <text x="600" y="372" class="route-badge">R 75</text>
  </svg>

  <div class="glass"></div>
  <div class="scan"></div>
</div>

<style>
  .screen {
    position: relative;
    width: 100%;
    height: 100%;
    background: #0c0d0e;
    overflow: hidden;
  }
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .drift {
    animation: mapdrift 60s ease-in-out infinite alternate;
    transform-origin: center;
  }
  @keyframes mapdrift {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(-12px, -7px);
    }
  }
  .lbl {
    font-family: var(--font-facade);
    font-size: 12px;
    fill: #6b7075;
    letter-spacing: 0.5px;
  }
  .lbl.big {
    font-size: 17px;
    letter-spacing: 3px;
    fill: #5d6266;
    font-weight: 600;
  }
  .lbl.small {
    font-size: 10px;
    fill: #7a7f83;
  }
  .badge {
    font-family: var(--font-facade);
    font-size: 13px;
    font-weight: 700;
    fill: #fff;
  }
  .route-badge {
    font-family: var(--font-facade);
    font-size: 11px;
    font-weight: 700;
    fill: #fff;
    paint-order: stroke;
    stroke: #2e7d32;
    stroke-width: 12;
    stroke-linejoin: round;
  }
  /* glass reflections over the LCD */
  .glass {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
        115deg,
        rgba(255, 255, 255, 0.16) 0%,
        rgba(255, 255, 255, 0.05) 18%,
        transparent 32%
      ),
      linear-gradient(295deg, rgba(255, 255, 255, 0.09) 0%, transparent 22%);
  }
  .scan {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.05) 0px,
      rgba(0, 0, 0, 0.05) 1px,
      transparent 1px,
      transparent 3px
    );
  }
</style>
