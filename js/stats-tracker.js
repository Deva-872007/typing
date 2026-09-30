/**
 * User Statistics and Performance Heatmap Engine
 * Tracks historical WPM, accuracy, key-by-key error frequencies,
 * and renders smooth HTML5 Canvas progression charts.
 */

class StatsTracker {
  constructor() {
    this.storageKey = 'typing_academy_user_stats';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load user stats', e);
    }

    return {
      testsCompleted: 0,
      totalWordsTyped: 0,
      totalTimeSeconds: 0,
      bestWpm: 0,
      totalWpmSum: 0,
      totalAccSum: 0,
      history: [],
      mistakeHeatmap: {}
    };
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }
  }

  recordTest(summary) {
    if (!summary || !summary.wpm) return;

    this.data.testsCompleted++;
    this.data.totalWordsTyped += Math.round(summary.correctChars / 5);
    this.data.totalTimeSeconds += summary.elapsedSeconds || 0;
    this.data.totalWpmSum += summary.wpm;
    this.data.totalAccSum += summary.accuracy;

    if (summary.wpm > this.data.bestWpm) {
      this.data.bestWpm = summary.wpm;
    }

    // Merge mistakes into heatmap
    if (summary.mistakesMap) {
      Object.entries(summary.mistakesMap).forEach(([key, count]) => {
        const normKey = key.toLowerCase();
        this.data.mistakeHeatmap[normKey] = (this.data.mistakeHeatmap[normKey] || 0) + count;
      });
    }

    // Add to history (keep last 40 tests)
    this.data.history.push({
      timestamp: summary.timestamp || Date.now(),
      wpm: summary.wpm,
      rawWpm: summary.rawWpm,
      accuracy: summary.accuracy,
      consistency: summary.consistency || 100,
      mode: summary.mode,
      duration: summary.elapsedSeconds
    });

    if (this.data.history.length > 40) {
      this.data.history.shift();
    }

    this.saveData();
  }

  getAverages() {
    const count = this.data.testsCompleted;
    if (count === 0) return { avgWpm: 0, avgAcc: 0 };
    return {
      avgWpm: Math.round(this.data.totalWpmSum / count),
      avgAcc: Math.round(this.data.totalAccSum / count)
    };
  }

  renderStatsView() {
    const { avgWpm, avgAcc } = this.getAverages();

    // Summary cards
    const bestWpmEl = document.getElementById('stats-best-wpm');
    const avgWpmEl = document.getElementById('stats-avg-wpm');
    const avgAccEl = document.getElementById('stats-avg-acc');
    const testsCountEl = document.getElementById('stats-tests-count');
    const wordsCountEl = document.getElementById('stats-words-count');
    const timeSpentEl = document.getElementById('stats-time-spent');

    if (bestWpmEl) bestWpmEl.textContent = this.data.bestWpm;
    if (avgWpmEl) avgWpmEl.textContent = avgWpm;
    if (avgAccEl) avgAccEl.textContent = `${avgAcc}%`;
    if (testsCountEl) testsCountEl.textContent = this.data.testsCompleted;
    if (wordsCountEl) wordsCountEl.textContent = this.data.totalWordsTyped.toLocaleString();
    if (timeSpentEl) {
      const mins = Math.floor(this.data.totalTimeSeconds / 60);
      timeSpentEl.textContent = `${mins}m ${this.data.totalTimeSeconds % 60}s`;
    }

    // Render Canvas WPM Progression Chart
    this.renderChart();

    // Render Heatmap visual
    this.renderHeatmap();

    // Render Recent History Table
    this.renderHistoryTable();
  }

  renderChart() {
    const canvas = document.getElementById('stats-chart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 750;
    canvas.height = 240;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const history = this.data.history;
    if (history.length < 2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Complete at least 2 speed tests to view your speed chart.', w / 2, h / 2);
      return;
    }

    const padding = { top: 25, right: 30, bottom: 35, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const wpms = history.map(d => d.wpm);
    const maxWpm = Math.max(...wpms, 60);
    const minWpm = 0;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    const yTicks = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= yTicks; i++) {
      const yVal = Math.round(minWpm + (maxWpm - minWpm) * (i / yTicks));
      const y = padding.top + chartH - (i / yTicks) * chartH;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      ctx.fillText(`${yVal}`, padding.left - 8, y + 4);
    }

    // Points coordinates
    const points = history.map((d, idx) => {
      const x = padding.left + (idx / (history.length - 1)) * chartW;
      const y = padding.top + chartH - ((d.wpm - minWpm) / (maxWpm - minWpm)) * chartH;
      return { x, y, ...d };
    });

    // Gradient area under curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach((pt, i) => {
      if (i === 0) ctx.lineTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line curve
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // Data points circles
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#818cf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  renderHeatmap() {
    const listEl = document.getElementById('heatmap-weak-keys');
    if (!listEl) return;
    listEl.innerHTML = '';

    const mistakes = Object.entries(this.data.mistakeHeatmap)
      .sort((a, b) => b[1] - a[1]);

    if (mistakes.length === 0) {
      listEl.innerHTML = '<div class="no-data-msg">No key errors recorded yet. Practice tests to populate your weak-key analysis!</div>';
      return;
    }

    const topMistakes = mistakes.slice(0, 8);
    const maxVal = topMistakes[0][1] || 1;

    topMistakes.forEach(([key, count]) => {
      const percentage = Math.round((count / maxVal) * 100);
      const item = document.createElement('div');
      item.className = 'heatmap-key-row';

      const keyDisplay = (key === ' ') ? 'Space' : key.toUpperCase();
      item.innerHTML = `
        <div class="key-badge">${keyDisplay}</div>
        <div class="heatmap-bar-wrap">
          <div class="heatmap-bar" style="width: ${percentage}%"></div>
        </div>
        <div class="mistake-count">${count} errors</div>
      `;
      listEl.appendChild(item);
    });
  }

  renderHistoryTable() {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (this.data.history.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No test history available.</td></tr>';
      return;
    }

    const reversed = [...this.data.history].reverse().slice(0, 10);
    reversed.forEach(record => {
      const tr = document.createElement('tr');
      const date = new Date(record.timestamp).toLocaleDateString([], {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      tr.innerHTML = `
        <td>${date}</td>
        <td><span class="mode-tag">${record.mode}</span></td>
        <td><strong class="wpm-highlight">${record.wpm}</strong> WPM</td>
        <td>${record.accuracy}%</td>
        <td>${record.consistency}%</td>
      `;
      tbody.appendChild(tr);
    });
  }

  resetAll() {
    if (confirm('Are you sure you want to reset all your typing stats and history?')) {
      this.data = {
        testsCompleted: 0,
        totalWordsTyped: 0,
        totalTimeSeconds: 0,
        bestWpm: 0,
        totalWpmSum: 0,
        totalAccSum: 0,
        history: [],
        mistakeHeatmap: {}
      };
      this.saveData();
      this.renderStatsView();
    }
  }
}

window.StatsTracker = StatsTracker;
