/**
 * Application Master Controller
 * Handles tab navigation, theme management, speed test modes,
 * test completion modal, and global keyboard shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize subsystems
  const keyboardVisualizer = new KeyboardVisualizer('virtual-keyboard');
  window.keyboardVisualizer = keyboardVisualizer;

  const statsTracker = new StatsTracker();
  window.statsTracker = statsTracker;

  const lessonsEngine = new LessonsEngine({ keyboardVisualizer });
  window.lessonsEngine = lessonsEngine;

  const wordFallGame = new WordFallGame('game-canvas');
  window.wordFallGame = wordFallGame;

  // Initialize Typing Test Engine
  const typingEngine = new TypingEngine({
    container: document.getElementById('words-display'),
    caret: document.getElementById('typing-caret'),
    inputElement: document.getElementById('typing-input'),
    onProgress: (metrics) => {
      updateLiveHUD(metrics);
    },
    onNextChar: (char) => {
      keyboardVisualizer.highlightTarget(char);
    },
    onComplete: (summary) => {
      statsTracker.recordTest(summary);
      showTestResultModal(summary);
    }
  });
  window.typingEngine = typingEngine;

  // Render initial views
  typingEngine.initSession();
  initThemeManager();
  initSoundSelector();
  initNavigation();
  initModeSelectors();
  renderResourcesView();

  // Reset stats button
  const resetStatsBtn = document.getElementById('btn-reset-stats');
  if (resetStatsBtn) {
    resetStatsBtn.addEventListener('click', () => statsTracker.resetAll());
  }

  // Restart test button
  const restartTestBtn = document.getElementById('btn-restart-test');
  if (restartTestBtn) {
    restartTestBtn.addEventListener('click', () => {
      typingEngine.initSession();
    });
  }

  // Result modal buttons
  const modalRestartBtn = document.getElementById('modal-restart-btn');
  if (modalRestartBtn) {
    modalRestartBtn.addEventListener('click', () => {
      hideTestResultModal();
      typingEngine.initSession();
    });
  }

  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      hideTestResultModal();
      typingEngine.initSession();
    });
  }

  // Custom text modal
  initCustomTextModal();

  // Helper functions
  function updateLiveHUD(metrics) {
    const liveWpmEl = document.getElementById('live-wpm');
    const liveAccEl = document.getElementById('live-acc');
    const liveTimerEl = document.getElementById('live-timer');

    if (liveWpmEl) liveWpmEl.textContent = metrics.wpm;
    if (liveAccEl) liveAccEl.textContent = `${metrics.accuracy}%`;

    if (liveTimerEl) {
      if (metrics.mode === 'time') {
        liveTimerEl.textContent = `${metrics.timeLeft}s`;
      } else {
        liveTimerEl.textContent = `${metrics.elapsed}s`;
      }
    }
  }

  function showTestResultModal(summary) {
    const modal = document.getElementById('test-result-modal');
    if (!modal) return;

    modal.classList.add('active');

    document.getElementById('res-wpm').textContent = summary.wpm;
    document.getElementById('res-acc').textContent = `${summary.accuracy}%`;
    document.getElementById('res-raw-wpm').textContent = summary.rawWpm;
    document.getElementById('res-cpm').textContent = summary.cpm;
    document.getElementById('res-consistency').textContent = `${summary.consistency}%`;
    document.getElementById('res-time').textContent = `${summary.elapsedSeconds}s`;
    document.getElementById('res-errors').textContent = summary.incorrectChars;

    // Render mini trajectory chart
    renderMiniTestChart(summary.wpmHistory);
  }

  function hideTestResultModal() {
    const modal = document.getElementById('test-result-modal');
    if (modal) modal.classList.remove('active');
  }

  function renderMiniTestChart(history) {
    const canvas = document.getElementById('result-chart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 550;
    canvas.height = 160;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!history || history.length < 2) return;

    const padding = { top: 15, right: 20, bottom: 25, left: 35 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const wpms = history.map(d => d.wpm);
    const maxVal = Math.max(...wpms, 40);

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    const points = history.map((d, i) => ({
      x: padding.left + (i / (history.length - 1)) * chartW,
      y: padding.top + chartH - (d.wpm / maxVal) * chartH
    }));

    // Area
    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
  }

  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-tab-btn');
    const sections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const targetView = link.dataset.view;

        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        link.classList.add('active');
        const targetSection = document.getElementById(`view-${targetView}`);
        if (targetSection) targetSection.classList.add('active');

        // View-specific activation hooks
        if (targetView === 'lessons') {
          lessonsEngine.renderCurriculum();
        } else if (targetView === 'stats') {
          statsTracker.renderStatsView();
        } else if (targetView === 'speed-test') {
          typingEngine.initSession();
        } else if (targetView === 'game') {
          wordFallGame.resizeCanvas();
        }
      });
    });
  }

  function initModeSelectors() {
    // Mode buttons: time, words, quote, code, custom
    const modeBtns = document.querySelectorAll('.mode-type-btn');
    const subConfigTime = document.getElementById('sub-config-time');
    const subConfigWords = document.getElementById('sub-config-words');

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.dataset.mode;
        typingEngine.mode = mode;

        if (mode === 'time') {
          if (subConfigTime) subConfigTime.style.display = 'inline-flex';
          if (subConfigWords) subConfigWords.style.display = 'none';
        } else if (mode === 'words') {
          if (subConfigTime) subConfigTime.style.display = 'none';
          if (subConfigWords) subConfigWords.style.display = 'inline-flex';
        } else if (mode === 'custom') {
          if (subConfigTime) subConfigTime.style.display = 'none';
          if (subConfigWords) subConfigWords.style.display = 'none';
          openCustomTextModal();
          return;
        } else {
          if (subConfigTime) subConfigTime.style.display = 'none';
          if (subConfigWords) subConfigWords.style.display = 'none';
        }

        typingEngine.initSession();
      });
    });

    // Sub-options: Time buttons
    const timeBtns = document.querySelectorAll('.time-opt-btn');
    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        typingEngine.timeLimit = parseInt(btn.dataset.time, 10);
        typingEngine.initSession();
      });
    });

    // Sub-options: Words count buttons
    const wordsBtns = document.querySelectorAll('.words-opt-btn');
    wordsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        wordsBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        typingEngine.wordLimit = parseInt(btn.dataset.words, 10);
        typingEngine.initSession();
      });
    });
  }

  function initCustomTextModal() {
    const modal = document.getElementById('custom-text-modal');
    const textarea = document.getElementById('custom-text-input');
    const applyBtn = document.getElementById('apply-custom-text-btn');
    const cancelBtn = document.getElementById('cancel-custom-text-btn');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const text = textarea.value.trim();
        if (text) {
          typingEngine.customText = text;
          typingEngine.mode = 'custom';
          modal.classList.remove('active');
          typingEngine.initSession();
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
  }

  function openCustomTextModal() {
    const modal = document.getElementById('custom-text-modal');
    if (modal) modal.classList.add('active');
  }

  function initThemeManager() {
    const savedTheme = localStorage.getItem('typing_theme') || 'dark';
    setTheme(savedTheme);

    const themeSelect = document.getElementById('theme-selector');
    if (themeSelect) {
      themeSelect.value = savedTheme;
      themeSelect.addEventListener('change', (e) => {
        setTheme(e.target.value);
      });
    }
  }

  function setTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('typing_theme', theme);
  }

  function initSoundSelector() {
    const soundSelect = document.getElementById('sound-selector');
    if (soundSelect && window.soundEngine) {
      soundSelect.addEventListener('change', (e) => {
        window.soundEngine.setProfile(e.target.value);
      });
    }
  }

  function renderResourcesView() {
    // Render Posture
    const postureContainer = document.getElementById('posture-cards-container');
    if (postureContainer && window.RESOURCES_DATA) {
      postureContainer.innerHTML = RESOURCES_DATA.posture.sections.map(sec => `
        <div class="resource-card">
          <span class="resource-badge">${sec.badge}</span>
          <h3 class="resource-heading">${sec.heading}</h3>
          <p class="resource-text">${sec.content.replace(/\n/g, '<br/>')}</p>
        </div>
      `).join('');
    }

    // Render Golden Rules
    const rulesContainer = document.getElementById('golden-rules-container');
    if (rulesContainer && window.RESOURCES_DATA) {
      rulesContainer.innerHTML = RESOURCES_DATA.goldenRules.map(rule => `
        <div class="rule-card">
          <div class="rule-num">${rule.num}</div>
          <div class="rule-body">
            <h4 class="rule-title">${rule.title}</h4>
            <p class="rule-desc">${rule.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // Render Plateau Breakers
    const plateauContainer = document.getElementById('plateau-cards-container');
    if (plateauContainer && window.RESOURCES_DATA) {
      plateauContainer.innerHTML = RESOURCES_DATA.plateaus.map(p => `
        <div class="plateau-card">
          <div class="plateau-range">${p.range}</div>
          <div class="plateau-detail">
            <div class="plateau-label">The Obstacle:</div>
            <p>${p.obstacle}</p>
          </div>
          <div class="plateau-detail solution">
            <div class="plateau-label">The Solution:</div>
            <p>${p.solution}</p>
          </div>
        </div>
      `).join('');
    }

    // Render Glossary
    const glossaryContainer = document.getElementById('glossary-container');
    if (glossaryContainer && window.RESOURCES_DATA) {
      glossaryContainer.innerHTML = RESOURCES_DATA.glossary.map(g => `
        <div class="glossary-item">
          <div class="glossary-term">${g.term}</div>
          <div class="glossary-def">${g.definition}</div>
        </div>
      `).join('');
    }
  }
});
