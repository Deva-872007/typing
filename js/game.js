/**
 * "Word Fall" Arcade Typing Game
 * Enhances typing reflexes and reaction speed by destroying falling words
 * with combos, difficulty scaling, particle explosions, and high score tracking.
 */

class WordFallGame {
  constructor(canvasId = 'game-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.inputElement = document.getElementById('game-input');

    this.wordsPool = [
      "code", "byte", "loop", "fast", "data", "type", "keys", "flow", "mind", "hand",
      "speed", "focus", "quick", "shift", "space", "power", "skill", "light", "rhythm",
      "system", "action", "memory", "finger", "master", "anchor", "smooth", "steady",
      "vector", "signal", "matrix", "stream", "binary", "syntax", "engine", "future",
      "agility", "dynamic", "command", "accuracy", "terminal", "algorithm", "developer"
    ];

    this.state = 'idle'; // 'idle', 'running', 'paused', 'gameover'
    this.words = [];
    this.particles = [];
    this.score = 0;
    this.streak = 0;
    this.lives = 3;
    this.level = 1;
    this.wordsDestroyed = 0;
    this.targetedWord = null;
    this.spawnTimer = 0;
    this.spawnInterval = 130; // frames
    this.fallSpeed = 1.0;
    this.animationId = null;

    this.highScore = parseInt(localStorage.getItem('word_fall_high_score') || '0', 10);

    this.bindEvents();
  }

  bindEvents() {
    if (!this.inputElement) return;

    this.inputElement.addEventListener('input', (e) => {
      this.handleInput(e.target.value.trim());
    });

    const startBtn = document.getElementById('game-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }

    const restartBtn = document.getElementById('game-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startGame());
    }

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || 800;
      this.canvas.height = 420;
    }
  }

  startGame() {
    this.resizeCanvas();
    this.state = 'running';
    this.score = 0;
    this.streak = 0;
    this.lives = 3;
    this.level = 1;
    this.wordsDestroyed = 0;
    this.fallSpeed = 1.0;
    this.spawnInterval = 120;
    this.spawnTimer = 0;
    this.words = [];
    this.particles = [];
    this.targetedWord = null;

    if (this.inputElement) {
      this.inputElement.value = '';
      this.inputElement.disabled = false;
      this.inputElement.focus();
    }

    const startOverlay = document.getElementById('game-start-overlay');
    const overOverlay = document.getElementById('game-over-overlay');
    if (startOverlay) startOverlay.style.display = 'none';
    if (overOverlay) overOverlay.style.display = 'none';

    this.updateHUD();

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.lastTime = performance.now();
    this.loop();
  }

  spawnWord() {
    const wordText = this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)];
    // Ensure word fits on canvas width
    const wordWidth = wordText.length * 14;
    const padding = 40;
    const x = padding + Math.random() * (this.canvas.width - wordWidth - padding * 2);

    this.words.push({
      text: wordText,
      matchedLength: 0,
      x: x,
      y: 20,
      speed: this.fallSpeed * (0.85 + Math.random() * 0.3)
    });
  }

  handleInput(val) {
    if (this.state !== 'running' || !val) return;

    if (!this.targetedWord) {
      // Find candidate word starting with val
      const candidate = this.words
        .filter(w => w.text.startsWith(val))
        .sort((a, b) => b.y - a.y)[0]; // pick lowest word on screen

      if (candidate) {
        this.targetedWord = candidate;
        this.targetedWord.matchedLength = val.length;
        if (window.soundEngine) window.soundEngine.playKeySound(false);

        if (val === this.targetedWord.text) {
          this.destroyWord(this.targetedWord);
        }
      }
    } else {
      if (this.targetedWord.text.startsWith(val)) {
        this.targetedWord.matchedLength = val.length;
        if (window.soundEngine) window.soundEngine.playKeySound(false);

        if (val === this.targetedWord.text) {
          this.destroyWord(this.targetedWord);
        }
      } else {
        // Mistake
        if (window.soundEngine) window.soundEngine.playErrorSound();
        this.streak = 0;
        this.updateHUD();
      }
    }
  }

  destroyWord(word) {
    // Word completed!
    this.createExplosion(word.x + (word.text.length * 7), word.y);
    if (window.soundEngine) window.soundEngine.playSuccessChime();

    this.words = this.words.filter(w => w !== word);
    this.targetedWord = null;
    this.inputElement.value = '';

    this.streak++;
    this.wordsDestroyed++;
    const points = word.text.length * 10 * Math.max(1, Math.floor(this.streak / 5));
    this.score += points;

    // Check level progression
    if (this.wordsDestroyed % 8 === 0) {
      this.level++;
      this.fallSpeed += 0.25;
      this.spawnInterval = Math.max(50, this.spawnInterval - 10);
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('word_fall_high_score', this.highScore.toString());
    }

    this.updateHUD();
  }

  createExplosion(x, y) {
    const colors = ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 2 + Math.random() * 2.5
      });
    }
  }

  updateHUD() {
    const scoreEl = document.getElementById('game-score');
    const streakEl = document.getElementById('game-streak');
    const levelEl = document.getElementById('game-level');
    const livesEl = document.getElementById('game-lives');
    const highEl = document.getElementById('game-highscore');

    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = `x${this.streak}`;
    if (levelEl) levelEl.textContent = this.level;
    if (highEl) highEl.textContent = this.highScore;
    if (livesEl) {
      livesEl.innerHTML = '❤️'.repeat(Math.max(0, this.lives)) + '🤍'.repeat(Math.max(0, 3 - this.lives));
    }
  }

  gameOver() {
    this.state = 'gameover';
    if (this.inputElement) this.inputElement.disabled = true;

    const overOverlay = document.getElementById('game-over-overlay');
    if (overOverlay) {
      overOverlay.style.display = 'flex';
      document.getElementById('final-game-score').textContent = this.score;
      document.getElementById('final-game-words').textContent = this.wordsDestroyed;
    }
  }

  loop() {
    if (this.state !== 'running') return;

    this.update();
    this.render();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Spawn timer
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnWord();
      this.spawnTimer = 0;
    }

    const dangerY = this.canvas.height - 35;

    // Update words
    for (let i = this.words.length - 1; i >= 0; i--) {
      const w = this.words[i];
      w.y += w.speed;

      // Check if reached danger line
      if (w.y >= dangerY) {
        if (window.soundEngine) window.soundEngine.playErrorSound();
        this.lives--;
        this.streak = 0;
        this.words.splice(i, 1);

        if (this.targetedWord === w) {
          this.targetedWord = null;
          this.inputElement.value = '';
        }

        this.updateHUD();

        if (this.lives <= 0) {
          this.gameOver();
          return;
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Danger zone line
    const dangerY = h - 35;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, dangerY);
    ctx.lineTo(w, dangerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Danger label
    ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.font = '11px sans-serif';
    ctx.fillText('DANGER LINE', 10, dangerY - 6);

    // Draw words
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    this.words.forEach(word => {
      const isTarget = (word === this.targetedWord);

      // Word background badge
      const textWidth = ctx.measureText(word.text).width;
      ctx.fillStyle = isTarget ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.07)';
      ctx.strokeStyle = isTarget ? '#6366f1' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = isTarget ? 2 : 1;

      const px = word.x - 6;
      const py = word.y - 18;
      const pw = textWidth + 12;
      const ph = 26;

      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 6);
      ctx.fill();
      ctx.stroke();

      // Matched portion (green) vs remaining portion (white)
      if (word.matchedLength > 0) {
        const matchedStr = word.text.slice(0, word.matchedLength);
        const remStr = word.text.slice(word.matchedLength);

        ctx.fillStyle = '#10b981';
        ctx.fillText(matchedStr, word.x, word.y);

        const matchedWidth = ctx.measureText(matchedStr).width;
        ctx.fillStyle = isTarget ? '#ffffff' : '#cbd5e1';
        ctx.fillText(remStr, word.x + matchedWidth, word.y);
      } else {
        ctx.fillStyle = isTarget ? '#a5b4fc' : '#e2e8f0';
        ctx.fillText(word.text, word.x, word.y);
      }
    });

    // Draw particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

window.WordFallGame = WordFallGame;
