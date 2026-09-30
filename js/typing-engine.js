/**
 * High-Precision Typing Engine
 * Supports Timed, Words, Quotes, and Code modes with smooth caret animation,
 * accurate real-time metrics (WPM, Raw WPM, Acc, CPM, Consistency), and error breakdown.
 */

const SAMPLE_TEXT_POOLS = {
  commonWords: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
    "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
    "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
    "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
    "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
    "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
    "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
    "new", "want", "because", "any", "these", "give", "day", "most", "us", "great", "between", "need",
    "large", "system", "program", "world", "write", "point", "clean", "focus", "speed", "power", "light"
  ],

  quotes: [
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Practice does not make perfect. Only perfect practice makes perfect.", author: "Vince Lombardi" },
    { text: "Knowledge is power. Information is liberating. Education is the premise of progress.", author: "Kofi Annan" },
    { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" }
  ],

  code: [
    "function calculateWpm(chars, minutes) {\n  const words = chars / 5;\n  return Math.round(words / minutes);\n}",
    "const speed = (distance / time) * 60;\nif (speed > targetSpeed) {\n  console.log('Record broken!');\n}",
    "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
    "const activeUser = users.find(u => u.id === id);\nif (!activeUser) {\n  throw new Error('User not found');\n}"
  ]
};

class TypingEngine {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('words-display');
    this.caret = options.caret || document.getElementById('typing-caret');
    this.inputElement = options.inputElement || document.getElementById('typing-input');
    
    // Config
    this.mode = 'time'; // 'time', 'words', 'quote', 'code', 'custom'
    this.timeLimit = 30; // 15, 30, 60, 120
    this.wordLimit = 25; // 10, 25, 50, 100
    this.customText = '';

    // State
    this.state = 'idle'; // 'idle', 'running', 'finished'
    this.rawText = '';
    this.charElements = [];
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.remainingSeconds = 30;

    // Metrics tracking
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.incorrectKeystrokes = 0;
    this.mistakesMap = {}; // key -> count of mistakes
    this.wpmHistory = [];  // Array of { time, wpm, rawWpm, acc } recorded every second

    // Callbacks
    this.onProgress = options.onProgress || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onNextChar = options.onNextChar || (() => {});

    this.bindEvents();
  }

  bindEvents() {
    if (!this.inputElement) return;

    // Clicking anywhere in words display focuses input
    if (this.container) {
      this.container.addEventListener('click', () => {
        this.inputElement.focus();
      });
    }

    this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.inputElement.addEventListener('input', (e) => {
      // Clear value so the input never accumulates text (prevents IME bugs)
      this.inputElement.value = '';
    });

    window.addEventListener('resize', () => {
      this.updateCaretPosition();
    });
  }

  initSession() {
    this.reset();
    this.generateContent();
    this.renderText();
    this.updateCaretPosition();
    if (this.onNextChar && this.rawText.length > 0) {
      this.onNextChar(this.rawText[0]);
    }
  }

  reset() {
    this.state = 'idle';
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.elapsedSeconds = 0;
    this.remainingSeconds = this.timeLimit;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.incorrectKeystrokes = 0;
    this.mistakesMap = {};
    this.wpmHistory = [];

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.inputElement) {
      this.inputElement.value = '';
      this.inputElement.focus();
    }
  }

  generateContent() {
    if (this.mode === 'time') {
      // Generate plenty of words (approx 150)
      this.rawText = this.getRandomWords(140).join(' ');
    } else if (this.mode === 'words') {
      this.rawText = this.getRandomWords(this.wordLimit).join(' ');
    } else if (this.mode === 'quote') {
      const q = SAMPLE_TEXT_POOLS.quotes[Math.floor(Math.random() * SAMPLE_TEXT_POOLS.quotes.length)];
      this.rawText = q.text;
      this.currentQuoteAuthor = q.author;
    } else if (this.mode === 'code') {
      const c = SAMPLE_TEXT_POOLS.code[Math.floor(Math.random() * SAMPLE_TEXT_POOLS.code.length)];
      this.rawText = c;
    } else if (this.mode === 'custom') {
      this.rawText = this.customText.trim() || "The quick brown fox jumps over the lazy dog.";
    }
  }

  getRandomWords(count) {
    const list = [];
    const pool = SAMPLE_TEXT_POOLS.commonWords;
    let prev = '';
    for (let i = 0; i < count; i++) {
      let word;
      do {
        word = pool[Math.floor(Math.random() * pool.length)];
      } while (word === prev && pool.length > 1);
      list.push(word);
      prev = word;
    }
    return list;
  }

  renderText() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.charElements = [];

    // Split text into words to wrap words naturally
    const words = this.rawText.split(/(\s+)/);
    let charIndex = 0;

    words.forEach(chunk => {
      const wordSpan = document.createElement('span');
      wordSpan.className = chunk.match(/\s+/) ? 'text-space-chunk' : 'text-word';

      for (let i = 0; i < chunk.length; i++) {
        const char = chunk[i];
        const charSpan = document.createElement('span');
        charSpan.className = 'text-char';
        charSpan.dataset.index = charIndex;
        charSpan.dataset.char = char;

        if (char === ' ') {
          charSpan.innerHTML = '&nbsp;';
          charSpan.classList.add('char-space');
        } else if (char === '\n') {
          charSpan.innerHTML = '↵<br/>';
          charSpan.classList.add('char-newline');
        } else {
          charSpan.textContent = char;
        }

        wordSpan.appendChild(charSpan);
        this.charElements.push(charSpan);
        charIndex++;
      }

      this.container.appendChild(wordSpan);
    });

    if (this.charElements[0]) {
      this.charElements[0].classList.add('current');
    }
  }

  startTest() {
    this.state = 'running';
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.remainingSeconds = this.timeLimit;

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  tick() {
    if (this.state !== 'running') return;

    this.elapsedSeconds++;

    if (this.mode === 'time') {
      this.remainingSeconds = Math.max(0, this.timeLimit - this.elapsedSeconds);
      if (this.remainingSeconds <= 0) {
        this.finishTest();
        return;
      }
    }

    const currentStats = this.calculateMetrics();
    this.wpmHistory.push({
      second: this.elapsedSeconds,
      wpm: currentStats.wpm,
      rawWpm: currentStats.rawWpm,
      acc: currentStats.accuracy
    });

    this.onProgress({
      mode: this.mode,
      timeLeft: this.remainingSeconds,
      elapsed: this.elapsedSeconds,
      ...currentStats
    });
  }

  handleKeyDown(e) {
    if (this.state === 'finished') return;

    // Ignore non-printable keys (except Backspace and Enter)
    if (e.key === 'Tab') {
      // Tab + Enter restarts test quickly
      e.preventDefault();
      this.initSession();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.initSession();
      return;
    }

    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    // Start on first keypress
    if (this.state === 'idle') {
      this.startTest();
    }

    const expectedChar = this.rawText[this.currentIndex];

    // Handle Backspace
    if (e.key === 'Backspace') {
      this.handleBackspace();
      return;
    }

    // Handle character input
    let typedChar = e.key;
    if (typedChar === 'Enter') {
      typedChar = '\n';
    }

    this.totalKeystrokes++;
    const isCorrect = (typedChar === expectedChar);

    // Sound feedback
    if (window.soundEngine) {
      if (isCorrect) {
        window.soundEngine.playKeySound(typedChar === ' ');
      } else {
        window.soundEngine.playErrorSound();
      }
    }

    const currentCharEl = this.charElements[this.currentIndex];
    if (currentCharEl) {
      currentCharEl.classList.remove('current');

      if (isCorrect) {
        this.correctKeystrokes++;
        currentCharEl.classList.add('correct');
        currentCharEl.classList.remove('incorrect');
      } else {
        this.incorrectKeystrokes++;
        currentCharEl.classList.add('incorrect');
        // Track mistake
        const mistakeKey = expectedChar === ' ' ? 'Space' : expectedChar;
        this.mistakesMap[mistakeKey] = (this.mistakesMap[mistakeKey] || 0) + 1;
      }
    }

    this.currentIndex++;

    // Check if test reached end of text
    if (this.currentIndex >= this.rawText.length) {
      this.finishTest();
      return;
    }

    // Set next char as current
    const nextCharEl = this.charElements[this.currentIndex];
    if (nextCharEl) {
      nextCharEl.classList.add('current');
    }

    // Call onNextChar for visual keyboard and finger guidance
    const nextChar = this.rawText[this.currentIndex];
    if (this.onNextChar) {
      this.onNextChar(nextChar);
    }

    this.updateCaretPosition();

    // Word count mode completion check
    if (this.mode === 'words') {
      const typedWordsCount = this.rawText.slice(0, this.currentIndex).trim().split(/\s+/).length;
      if (typedWordsCount >= this.wordLimit && this.currentIndex >= this.rawText.length) {
        this.finishTest();
        return;
      }
    }

    // Real-time metrics tick update
    this.onProgress({
      mode: this.mode,
      timeLeft: this.remainingSeconds,
      elapsed: this.elapsedSeconds,
      ...this.calculateMetrics()
    });
  }

  handleBackspace() {
    if (this.currentIndex <= 0) return;

    // Deselect current
    if (this.charElements[this.currentIndex]) {
      this.charElements[this.currentIndex].classList.remove('current');
    }

    this.currentIndex--;

    // Revert previous character status
    const prevCharEl = this.charElements[this.currentIndex];
    if (prevCharEl) {
      prevCharEl.classList.remove('correct', 'incorrect');
      prevCharEl.classList.add('current');
    }

    if (window.soundEngine) {
      window.soundEngine.playKeySound(false);
    }

    const nextChar = this.rawText[this.currentIndex];
    if (this.onNextChar) {
      this.onNextChar(nextChar);
    }

    this.updateCaretPosition();
  }

  updateCaretPosition() {
    if (!this.caret || !this.container) return;

    const currentCharEl = this.charElements[this.currentIndex];
    if (!currentCharEl) {
      // Caret at end
      const lastEl = this.charElements[this.charElements.length - 1];
      if (lastEl) {
        const lastRect = lastEl.getBoundingClientRect();
        const contRect = this.container.getBoundingClientRect();
        this.caret.style.transform = `translate(${lastRect.right - contRect.left}px, ${lastRect.top - contRect.top}px)`;
        this.caret.style.height = `${lastRect.height}px`;
      }
      return;
    }

    const charRect = currentCharEl.getBoundingClientRect();
    const contRect = this.container.getBoundingClientRect();

    this.caret.style.transform = `translate(${charRect.left - contRect.left}px, ${charRect.top - contRect.top}px)`;
    this.caret.style.height = `${charRect.height}px`;

    // Auto-scroll container if needed
    const offsetTop = currentCharEl.offsetTop;
    if (offsetTop > 80) {
      this.container.scrollTop = offsetTop - 40;
    } else {
      this.container.scrollTop = 0;
    }
  }

  calculateMetrics() {
    const elapsedMinutes = Math.max(0.01, (Date.now() - (this.startTime || Date.now())) / 60000);
    
    // Standard WPM: 1 word = 5 characters
    const netWords = this.correctKeystrokes / 5;
    const rawWords = this.totalKeystrokes / 5;

    const wpm = Math.round(netWords / elapsedMinutes);
    const rawWpm = Math.round(rawWords / elapsedMinutes);
    const accuracy = this.totalKeystrokes > 0
      ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100)
      : 100;
    const cpm = Math.round(this.correctKeystrokes / elapsedMinutes);

    return {
      wpm: Math.max(0, wpm),
      rawWpm: Math.max(0, rawWpm),
      accuracy,
      cpm,
      correctChars: this.correctKeystrokes,
      incorrectChars: this.incorrectKeystrokes,
      totalChars: this.totalKeystrokes
    };
  }

  calculateConsistency() {
    if (this.wpmHistory.length < 3) return 100;
    const wpms = this.wpmHistory.map(h => h.wpm);
    const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    // Consistency percentage: higher is better
    const consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / (avg || 1)) * 100)));
    return consistency;
  }

  finishTest() {
    if (this.state === 'finished') return;
    this.state = 'finished';
    this.endTime = Date.now();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (window.soundEngine) {
      window.soundEngine.playSuccessChime();
    }

    const finalMetrics = this.calculateMetrics();
    const consistency = this.calculateConsistency();

    const summary = {
      ...finalMetrics,
      consistency,
      mode: this.mode,
      timeLimit: this.timeLimit,
      wordLimit: this.wordLimit,
      elapsedSeconds: this.elapsedSeconds,
      mistakesMap: this.mistakesMap,
      wpmHistory: this.wpmHistory,
      timestamp: Date.now()
    };

    this.onComplete(summary);
  }
}

window.TypingEngine = TypingEngine;
