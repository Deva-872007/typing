/**
 * Interactive Keyboard Visualizer
 * Renders an ANSI QWERTY keyboard with color-coded finger zones,
 * real-time keypress animation, tactile markers on F & J, and active finger guidance.
 */

const FINGER_MAP = {
  // Left Pinky
  '`': 'left-pinky', '~': 'left-pinky', '1': 'left-pinky', '!': 'left-pinky',
  'q': 'left-pinky', 'Q': 'left-pinky', 'a': 'left-pinky', 'A': 'left-pinky',
  'z': 'left-pinky', 'Z': 'left-pinky', 'Tab': 'left-pinky', 'CapsLock': 'left-pinky', 'ShiftLeft': 'left-pinky',

  // Left Ring
  '2': 'left-ring', '@': 'left-ring',
  'w': 'left-ring', 'W': 'left-ring', 's': 'left-ring', 'S': 'left-ring',
  'x': 'left-ring', 'X': 'left-ring',

  // Left Middle
  '3': 'left-middle', '#': 'left-middle',
  'e': 'left-middle', 'E': 'left-middle', 'd': 'left-middle', 'D': 'left-middle',
  'c': 'left-middle', 'C': 'left-middle',

  // Left Index
  '4': 'left-index', '$': 'left-index', '5': 'left-index', '%': 'left-index',
  'r': 'left-index', 'R': 'left-index', 't': 'left-index', 'T': 'left-index',
  'f': 'left-index', 'F': 'left-index', 'g': 'left-index', 'G': 'left-index',
  'v': 'left-index', 'V': 'left-index', 'b': 'left-index', 'B': 'left-index',

  // Thumbs
  ' ': 'thumb', 'Space': 'thumb',

  // Right Index
  '6': 'right-index', '^': 'right-index', '7': 'right-index', '&': 'right-index',
  'y': 'right-index', 'Y': 'right-index', 'u': 'right-index', 'U': 'right-index',
  'h': 'right-index', 'H': 'right-index', 'j': 'right-index', 'J': 'right-index',
  'n': 'right-index', 'N': 'right-index', 'm': 'right-index', 'M': 'right-index',

  // Right Middle
  '8': 'right-middle', '*': 'right-middle',
  'i': 'right-middle', 'I': 'right-middle', 'k': 'right-middle', 'K': 'right-middle',
  ',': 'right-middle', '<': 'right-middle',

  // Right Ring
  '9': 'right-ring', '(': 'right-ring',
  'o': 'right-ring', 'O': 'right-ring', 'l': 'right-ring', 'L': 'right-ring',
  '.': 'right-ring', '>': 'right-ring',

  // Right Pinky
  '0': 'right-pinky', ')': 'right-pinky', '-': 'right-pinky', '_': 'right-pinky',
  '=': 'right-pinky', '+': 'right-pinky', 'Backspace': 'right-pinky',
  'p': 'right-pinky', 'P': 'right-pinky', '[': 'right-pinky', '{': 'right-pinky',
  ']': 'right-pinky', '}': 'right-pinky', '\\': 'right-pinky', '|': 'right-pinky',
  ';': 'right-pinky', ':': 'right-pinky', "'": 'right-pinky', '"': 'right-pinky',
  'Enter': 'right-pinky', '/': 'right-pinky', '?': 'right-pinky', 'ShiftRight': 'right-pinky'
};

const FINGER_NAMES = {
  'left-pinky': 'Left Pinky',
  'left-ring': 'Left Ring',
  'left-middle': 'Left Middle',
  'left-index': 'Left Index',
  'thumb': 'Thumb (Either)',
  'right-index': 'Right Index',
  'right-middle': 'Right Middle',
  'right-ring': 'Right Ring',
  'right-pinky': 'Right Pinky'
};

const KEYBOARD_ROWS = [
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', finger: 'left-pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', finger: 'left-pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', finger: 'left-ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', finger: 'left-middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', finger: 'left-index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', finger: 'left-index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', finger: 'right-index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', finger: 'right-index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', finger: 'right-middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', finger: 'right-ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', finger: 'right-pinky' },
    { code: 'Minus', label: '-', shiftLabel: '_', finger: 'right-pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', finger: 'right-pinky' },
    { code: 'Backspace', label: 'Backspace', width: 'key-backspace', finger: 'right-pinky' }
  ],
  [
    { code: 'Tab', label: 'Tab', width: 'key-tab', finger: 'left-pinky' },
    { code: 'KeyQ', label: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', label: 'W', finger: 'left-ring' },
    { code: 'KeyE', label: 'E', finger: 'left-middle' },
    { code: 'KeyR', label: 'R', finger: 'left-index' },
    { code: 'KeyT', label: 'T', finger: 'left-index' },
    { code: 'KeyY', label: 'Y', finger: 'right-index' },
    { code: 'KeyU', label: 'U', finger: 'right-index' },
    { code: 'KeyI', label: 'I', finger: 'right-middle' },
    { code: 'KeyO', label: 'O', finger: 'right-ring' },
    { code: 'KeyP', label: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', finger: 'right-pinky' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', finger: 'right-pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', width: 'key-backslash', finger: 'right-pinky' }
  ],
  [
    { code: 'CapsLock', label: 'Caps', width: 'key-caps', finger: 'left-pinky' },
    { code: 'KeyA', label: 'A', finger: 'left-pinky' },
    { code: 'KeyS', label: 'S', finger: 'left-ring' },
    { code: 'KeyD', label: 'D', finger: 'left-middle' },
    { code: 'KeyF', label: 'F', finger: 'left-index', isHoming: true },
    { code: 'KeyG', label: 'G', finger: 'left-index' },
    { code: 'KeyH', label: 'H', finger: 'right-index' },
    { code: 'KeyJ', label: 'J', finger: 'right-index', isHoming: true },
    { code: 'KeyK', label: 'K', finger: 'right-middle' },
    { code: 'KeyL', label: 'L', finger: 'right-ring' },
    { code: 'Semicolon', label: ';', shiftLabel: ':', finger: 'right-pinky' },
    { code: 'Quote', label: "'", shiftLabel: '"', finger: 'right-pinky' },
    { code: 'Enter', label: 'Enter', width: 'key-enter', finger: 'right-pinky' }
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', width: 'key-lshift', finger: 'left-pinky' },
    { code: 'KeyZ', label: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', label: 'X', finger: 'left-ring' },
    { code: 'KeyC', label: 'C', finger: 'left-middle' },
    { code: 'KeyV', label: 'V', finger: 'left-index' },
    { code: 'KeyB', label: 'B', finger: 'left-index' },
    { code: 'KeyN', label: 'N', finger: 'right-index' },
    { code: 'KeyM', label: 'M', finger: 'right-index' },
    { code: 'Comma', label: ',', shiftLabel: '<', finger: 'right-middle' },
    { code: 'Period', label: '.', shiftLabel: '>', finger: 'right-ring' },
    { code: 'Slash', label: '/', shiftLabel: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', label: 'Shift', width: 'key-rshift', finger: 'right-pinky' }
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 'key-mod', finger: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', width: 'key-mod', finger: 'thumb' },
    { code: 'Space', label: 'Space', width: 'key-space', finger: 'thumb' },
    { code: 'AltRight', label: 'Alt', width: 'key-mod', finger: 'thumb' },
    { code: 'ControlRight', label: 'Ctrl', width: 'key-mod', finger: 'right-pinky' }
  ]
];

class KeyboardVisualizer {
  constructor(containerId = 'virtual-keyboard') {
    this.container = document.getElementById(containerId);
    this.keyElements = new Map(); // code -> element
    this.charToCode = new Map();  // char/shift -> code
    this.activeKey = null;
    this.activeFinger = null;
    this.render();
    this.initPhysicalKeyListeners();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.keyElements.clear();

    const kbWrapper = document.createElement('div');
    kbWrapper.className = 'kb-board';

    KEYBOARD_ROWS.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';

      row.forEach(key => {
        const keyEl = document.createElement('div');
        keyEl.className = `kb-key ${key.width || ''} finger-${key.finger}`;
        keyEl.dataset.code = key.code;
        keyEl.dataset.finger = key.finger;

        if (key.isHoming) {
          keyEl.classList.add('homing-key');
        }

        if (key.shiftLabel) {
          const shiftSpan = document.createElement('span');
          shiftSpan.className = 'key-sub';
          shiftSpan.textContent = key.shiftLabel;
          keyEl.appendChild(shiftSpan);
          this.charToCode.set(key.shiftLabel, { code: key.code, needsShift: true });
        }

        const mainSpan = document.createElement('span');
        mainSpan.className = 'key-main';
        mainSpan.textContent = key.label;
        keyEl.appendChild(mainSpan);

        if (key.label.length === 1) {
          this.charToCode.set(key.label.toLowerCase(), { code: key.code, needsShift: false });
          this.charToCode.set(key.label.toUpperCase(), { code: key.code, needsShift: true });
        } else if (key.code === 'Space') {
          this.charToCode.set(' ', { code: 'Space', needsShift: false });
        }

        this.keyElements.set(key.code, keyEl);
        rowEl.appendChild(keyEl);
      });

      kbWrapper.appendChild(rowEl);
    });

    this.container.appendChild(kbWrapper);

    // Finger zone legend
    this.renderLegend();
  }

  renderLegend() {
    let legend = document.getElementById('kb-legend');
    if (!legend) {
      legend = document.createElement('div');
      legend.id = 'kb-legend';
      legend.className = 'kb-legend';
      this.container.appendChild(legend);
    }
    legend.innerHTML = `
      <div class="legend-item"><span class="legend-dot finger-left-pinky"></span> Pinky (L/R)</div>
      <div class="legend-item"><span class="legend-dot finger-left-ring"></span> Ring</div>
      <div class="legend-item"><span class="legend-dot finger-left-middle"></span> Middle</div>
      <div class="legend-item"><span class="legend-dot finger-left-index"></span> Index</div>
      <div class="legend-item"><span class="legend-dot finger-thumb"></span> Thumb (Space)</div>
    `;
  }

  initPhysicalKeyListeners() {
    window.addEventListener('keydown', (e) => {
      const el = this.keyElements.get(e.code);
      if (el) {
        el.classList.add('key-pressed');
      }
    });

    window.addEventListener('keyup', (e) => {
      const el = this.keyElements.get(e.code);
      if (el) {
        el.classList.remove('key-pressed');
      }
    });
  }

  highlightTarget(char) {
    // Clear previous highlight
    this.clearHighlights();

    if (!char) return;

    let targetInfo = this.charToCode.get(char);

    // Special fallback mappings
    if (!targetInfo) {
      if (char === '\n') targetInfo = { code: 'Enter', needsShift: false };
      else if (char === '\t') targetInfo = { code: 'Tab', needsShift: false };
    }

    if (targetInfo) {
      const keyEl = this.keyElements.get(targetInfo.code);
      if (keyEl) {
        keyEl.classList.add('key-target');
        const finger = keyEl.dataset.finger;
        this.activeFinger = finger;
        this.updateFingerPrompt(finger, char);
      }

      if (targetInfo.needsShift) {
        // Highlight shift key (use opposite hand shift)
        const shiftCode = (targetInfo.code.startsWith('Key') && ['Y','U','I','O','P','H','J','K','L','N','M'].includes(char.toUpperCase()))
          ? 'ShiftLeft' : 'ShiftRight';
        const shiftEl = this.keyElements.get(shiftCode);
        if (shiftEl) shiftEl.classList.add('key-target-shift');
      }
    } else {
      this.updateFingerPrompt(null, char);
    }
  }

  updateFingerPrompt(finger, char) {
    const promptEl = document.getElementById('finger-guidance-badge');
    const handPromptEl = document.getElementById('hands-guide-visual');
    if (!promptEl) return;

    if (!finger) {
      promptEl.innerHTML = `<span class="finger-name">Next: <strong>${char === ' ' ? 'Space' : char}</strong></span>`;
      return;
    }

    const fingerName = FINGER_NAMES[finger] || finger;
    const charDisplay = char === ' ' ? 'Space' : (char === '\n' ? 'Enter' : char);

    promptEl.innerHTML = `
      <span class="finger-tag ${finger}">
        <span class="finger-dot"></span>
        Finger: <strong>${fingerName}</strong>
      </span>
      <span class="char-tag">Press: <strong>${charDisplay}</strong></span>
    `;

    // Highlight finger in hands visualizer if present
    if (handPromptEl) {
      const allFingers = handPromptEl.querySelectorAll('.hand-finger');
      allFingers.forEach(f => f.classList.remove('active-finger'));
      const activeEl = handPromptEl.querySelector(`[data-finger="${finger}"]`);
      if (activeEl) activeEl.classList.add('active-finger');
    }
  }

  clearHighlights() {
    this.keyElements.forEach(el => {
      el.classList.remove('key-target', 'key-target-shift');
    });
  }
}

window.KeyboardVisualizer = KeyboardVisualizer;
