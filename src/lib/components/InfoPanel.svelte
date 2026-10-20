<script>
  // Brushed-metal info panel below the icon row: LCD, braille, entry
  // sticker, engraved German/English text and the bottom hardware row.
  import StatusPanel from './StatusPanel.svelte'
  import PushButton from './PushButton.svelte'

  let { status, progress, phase, onpress } = $props()

  const GERMAN = `BERLINER TOILETTE
BENUTZUNG MIT MÜNZEN, EUROSCHLÜSSEL, KARTE, IN APP BEZAHLUNG
AUTOMATISCHE REINIGUNG DES TOILETTENBECKENS UND SITZES NACH DER BENUTZUNG
TÄGLICHE DESINFEKTION
AUTOMATISCHE NOTRUF-FUNKTION IM INNENRAUM
KINDER NUR IN BEGLEITUNG EINES ERWACHSENEN
NACH 20 MIN ÖFFNET DIE TÜR, VERLÄNGERUNG AUF 40 MIN MÖGLICH`

  const ENGLISH = `BERLIN TOILET
USEABLE WITH CASH, EURO KEY, CARD, IN APP PAYMENT
AUTOMATIC CLEANING OF TOILET BOWL AND SEAT AFTER EACH USE
DISINFECTION EVERY DAY
AUTOMATIC EMERGENCY CALL FUNCTION INSIDE
CHILDREN ONLY ACCOMPANIED BY AN ADULT
AFTER 20 MIN THE DOOR WILL OPEN. TIME IS EXTENDABLE TO 40 MIN`

  // Braille rendering of the German instructions (grade-1, umlauts spelled out)
  const BRAILLE_MAP = {
    a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓',
    i: '⠊', j: '⠚', k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏',
    q: '⠟', r: '⠗', s: '⠎', t: '⠹', u: '⠥', v: '⠧', w: '⠺', x: '⠭',
    y: '⠽', z: '⠵',
  }
  function braille(text) {
    let out = ''
    for (const ch of text.toLowerCase()) {
      if (ch >= '1' && ch <= '9') out += '⠼' + BRAILLE_MAP['abcdefghij'[Number(ch) - 1]]
      else if (ch === '0') out += '⠼⠚'
      else if (BRAILLE_MAP[ch]) out += BRAILLE_MAP[ch]
      else if (ch === ' ') out += '⠀'
    }
    return out
  }
  const BRAILLE_TEXT = braille(
    'Berliner Toilette. Benutzung mit Muenzen, Euroschluessel, Karte, in App Bezahlung. ' +
      'Automatische Reinigung nach der Benutzung. Taegliche Desinfektion. ' +
      'Kinder nur in Begleitung eines Erwachsenen. Nach 20 min oeffnet die Tuer.'
  )
</script>

<div class="metal">
  <!-- LCD -->
  <div class="lcd-slot">
    <StatusPanel {status} {progress} {phase} />
  </div>

  <!-- braille -->
  <div class="braille">{BRAILLE_TEXT}</div>

  <!-- entry sticker -->
  <div class="sticker">
    <div class="st-de">Freier Eintritt – Knopf drücken</div>
    <svg viewBox="0 0 80 78" class="hand">
      <!-- finger pressing the button -->
      <path d="M30 8 Q46 0 54 10 Q60 16 58 26 L58 38" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" />
      <rect x="30" y="8" width="14" height="34" rx="7" fill="#fff" stroke="#1a1a1a" stroke-width="3" />
      <path d="M18 50 a19 19 0 0 0 38 0" fill="none" stroke="#1a1a1a" stroke-width="2.4" stroke-linecap="round" />
      <circle cx="37" cy="50" r="8" fill="#fff" stroke="#d32f22" stroke-width="4" />
    </svg>
    <div class="st-en">Free Entry – Push Button</div>
  </div>

  <!-- engraved instructions -->
  <div class="engraved de-text">{GERMAN}</div>
  <div class="engraved en-text">{ENGLISH}</div>

  <!-- bottom hardware row -->
  <div class="btn-slot"><PushButton onpress={onpress} pulse={status === 'frei'} /></div>

  <div class="slot-plate">
    <div class="slot"></div>
  </div>
  <div class="slot-label">EURO<br />KEY</div>

  <div class="wc-access">
    <svg viewBox="0 0 64 64" class="isa">
      <circle cx="37" cy="9" r="6" />
      <path d="M33 18 q9 0 10 9 l2 9 h11 v6 h-16 l-2 -8 h-9 z" />
      <path d="M31 21 c-9 3 -14 12 -10 21 c3 8 13 11 21 7" fill="none" stroke="#3a3b3d" stroke-width="6" stroke-linecap="round" />
      <circle cx="25" cy="46" r="12" fill="none" stroke="#3a3b3d" stroke-width="5" />
    </svg>
  </div>

  <div class="berlin">
    <div class="berlin-word">Berlin</div>
    <svg viewBox="0 0 40 34" class="berlin-arrow">
      <path d="M20 4 L34 20 H26 V30 H14 V20 H6 Z" fill="none" stroke="#3a3b3d" stroke-width="3" stroke-linejoin="round" />
    </svg>
  </div>

  <div class="wall-logo">
    <svg viewBox="0 0 20 20" class="wall-mark"><path d="M10 2 L18 10 L10 18 L2 10 Z" fill="none" stroke="#4d4c49" stroke-width="2.5" /><circle cx="10" cy="10" r="2.4" fill="#4d4c49" /></svg>
    <span>Wall</span>
  </div>
</div>

<style>
  .metal {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: var(--noise), repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0 1px, rgba(0, 0, 0, 0.035) 1px 2px, transparent 2px 6px),
      linear-gradient(180deg, #c1c0bc 0%, #b5b4b0 10%, #b8b7b3 50%, #a8a7a3 90%, #9c9b97 100%);
    background-blend-mode: overlay, normal, normal;
    box-shadow:
      inset 0 0 60px rgba(0, 0, 0, 0.18),
      inset 0 0 6px rgba(0, 0, 0, 0.2);
  }

  .lcd-slot {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 330px;
    height: 230px;
    background: #101112;
    padding: 9px;
    border-radius: 6px;
    box-shadow:
      inset 0 2px 6px rgba(0, 0, 0, 0.9),
      0 1px 0 rgba(255, 255, 255, 0.35);
  }

  .braille {
    position: absolute;
    left: 20px;
    top: 262px;
    width: 340px;
    height: 118px;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.55;
    letter-spacing: 3px;
    word-spacing: 8px;
    color: #a3a29e;
    text-shadow:
      0 1px 0 #e3e2df,
      0 -1px 0 #8c8b87;
  }

  .sticker {
    position: absolute;
    left: 20px;
    top: 392px;
    width: 330px;
    height: 112px;
    background: linear-gradient(180deg, #ffffff, #f2f1ee);
    border-radius: 2px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 8px 6px;
  }
  .st-de {
    font-size: 14.5px;
    font-weight: 700;
    color: #1a1a1a;
  }
  .st-en {
    font-size: 12.5px;
    color: #1a1a1a;
  }
  .hand {
    width: 86px;
    height: 54px;
  }

  .engraved {
    position: absolute;
    top: 26px;
    color: #83827e;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.75);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.72;
    white-space: pre-line;
  }
  .de-text {
    left: 372px;
    width: 158px;
  }
  .en-text {
    left: 545px;
    width: 140px;
  }

  .btn-slot {
    position: absolute;
    left: 62px;
    top: 520px;
  }
  .slot-plate {
    position: absolute;
    left: 208px;
    top: 518px;
    width: 58px;
    height: 98px;
    border-radius: 6px;
    background: linear-gradient(180deg, #a6a5a1, #8f8e8a);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.35),
      0 1px 0 rgba(255, 255, 255, 0.5);
  }
  .slot {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 9px;
    height: 46px;
    border-radius: 5px;
    background: #17181a;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.9);
  }
  .slot-label {
    position: absolute;
    left: 274px;
    top: 548px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #6d6c68;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }
  .wc-access {
    position: absolute;
    left: 396px;
    top: 516px;
  }
  .isa {
    width: 64px;
    height: 64px;
  }
  .isa circle:first-child,
  .isa path:first-of-type {
    fill: #3a3b3d;
  }
  .berlin {
    position: absolute;
    left: 500px;
    top: 508px;
    width: 74px;
    height: 106px;
    background: linear-gradient(180deg, #fbfaf8, #e9e8e4);
    border-radius: 3px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 8px;
  }
  .berlin-word {
    font-size: 17px;
    font-weight: 700;
    color: #2a2b2d;
  }
  .berlin-arrow {
    width: 40px;
    margin-top: 6px;
  }
  .wall-logo {
    position: absolute;
    right: 18px;
    bottom: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #4d4c49;
    font-weight: 700;
    font-size: 15px;
  }
  .wall-mark {
    width: 18px;
    height: 18px;
  }
</style>
