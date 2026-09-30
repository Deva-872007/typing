/**
 * Touch Typing Lessons Engine
 * Manages lesson unlocking, interactive tutor drills, real-time keyboard sync,
 * star ratings (1-3 stars), and LocalStorage persistence.
 */

class LessonsEngine {
  constructor(options = {}) {
    this.container = document.getElementById('lessons-content');
    this.tutorModal = document.getElementById('lesson-tutor-modal');
    this.keyboardVisualizer = options.keyboardVisualizer || window.keyboardVisualizer;

    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.charElements = [];
    this.currentIndex = 0;
    this.startTime = null;
    this.correctCount = 0;
    this.totalCount = 0;
    this.mistakesCount = 0;
    this.isExerciseActive = false;

    // Load progress from localStorage
    this.progress = this.loadProgress();

    this.bindEvents();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('typing_academy_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load lesson progress', e);
    }
    // Default: Lesson 1 is unlocked
    return {
      unlocked: ['lesson-1'],
      scores: {} // lessonId: { stars: 3, bestWpm: 25, bestAcc: 98, completedAt: ... }
    };
  }

  saveProgress() {
    try {
      localStorage.setItem('typing_academy_progress', JSON.stringify(this.progress));
    } catch (e) {
      console.warn('Failed to save lesson progress', e);
    }
  }

  bindEvents() {
    // Stage filter buttons
    const filterBtns = document.querySelectorAll('.stage-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCurriculum(btn.dataset.stage);
      });
    });

    // Close tutor modal button
    const closeBtn = document.getElementById('close-tutor-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeTutor());
    }

    // Tutor keyboard input
    const tutorInput = document.getElementById('tutor-hidden-input');
    if (tutorInput) {
      tutorInput.addEventListener('keydown', (e) => this.handleTutorKeyDown(e));
      tutorInput.addEventListener('input', () => { tutorInput.value = ''; });
    }
  }

  renderCurriculum(filterStage = 'all') {
    const listEl = document.getElementById('lessons-grid');
    if (!listEl) return;
    listEl.innerHTML = '';

    const lessons = (filterStage === 'all')
      ? LESSONS_DATA
      : LESSONS_DATA.filter(l => l.stage === filterStage);

    lessons.forEach(lesson => {
      const isUnlocked = this.progress.unlocked.includes(lesson.id);
      const score = this.progress.scores[lesson.id] || null;
      const stars = score ? score.stars : 0;

      const card = document.createElement('div');
      card.className = `lesson-card stage-${lesson.stage} ${isUnlocked ? 'unlocked' : 'locked'}`;

      const starsHtml = `
        <div class="lesson-stars">
          <span class="star ${stars >= 1 ? 'filled' : ''}">★</span>
          <span class="star ${stars >= 2 ? 'filled' : ''}">★</span>
          <span class="star ${stars >= 3 ? 'filled' : ''}">★</span>
        </div>
      `;

      card.innerHTML = `
        <div class="lesson-header">
          <span class="lesson-stage-tag stage-${lesson.stage}">Stage ${lesson.stageNumber}</span>
          <span class="lesson-number">#${lesson.lessonNumber}</span>
          ${starsHtml}
        </div>
        <h3 class="lesson-title">${lesson.title}</h3>
        <p class="lesson-desc">${lesson.description}</p>
        <div class="lesson-meta">
          <div class="meta-item"><span class="meta-icon">🎯</span> Target: <strong>${lesson.targetWpm} WPM</strong></div>
          <div class="meta-item"><span class="meta-icon">✨</span> Accuracy: <strong>${lesson.minAccuracy}%</strong></div>
        </div>
        <div class="lesson-keys-preview">
          ${lesson.newKeys.map(k => `<span class="key-pill">${k === ' ' ? 'Space' : k}</span>`).join('')}
        </div>
        <button class="btn lesson-action-btn ${isUnlocked ? 'btn-primary' : 'btn-disabled'}" ${isUnlocked ? '' : 'disabled'}>
          ${isUnlocked ? (score ? 'Practice Again' : 'Start Lesson') : '🔒 Locked'}
        </button>
      `;

      if (isUnlocked) {
        card.addEventListener('click', (e) => {
          this.startLesson(lesson.id);
        });
      }

      listEl.appendChild(card);
    });

    // Update global Academy progress bar
    this.updateAcademyStats();
  }

  updateAcademyStats() {
    const totalLessons = LESSONS_DATA.length;
    const completedCount = Object.keys(this.progress.scores).length;
    const percent = Math.round((completedCount / totalLessons) * 100);

    const barEl = document.getElementById('academy-progress-bar');
    const textEl = document.getElementById('academy-progress-text');
    if (barEl) barEl.style.width = `${percent}%`;
    if (textEl) textEl.textContent = `${completedCount} of ${totalLessons} Lessons Completed (${percent}%)`;
  }

  startLesson(lessonId) {
    const lesson = LESSONS_DATA.find(l => l.id === lessonId);
    if (!lesson) return;

    this.currentLesson = lesson;
    this.currentExerciseIndex = 0;

    const modal = document.getElementById('lesson-tutor-modal');
    if (!modal) return;
    modal.classList.add('active');

    document.getElementById('tutor-lesson-title').textContent = `Lesson ${lesson.lessonNumber}: ${lesson.title}`;
    document.getElementById('tutor-lesson-guide').textContent = lesson.fingerGuide;
    document.getElementById('tutor-target-wpm').textContent = `${lesson.targetWpm} WPM`;
    document.getElementById('tutor-target-acc').textContent = `${lesson.minAccuracy}%`;

    this.loadExercise(0);
  }

  loadExercise(index) {
    this.currentExerciseIndex = index;
    const exerciseText = this.currentLesson.exercises[index];
    this.rawText = exerciseText;
    this.currentIndex = 0;
    this.startTime = null;
    this.correctCount = 0;
    this.totalCount = 0;
    this.mistakesCount = 0;
    this.isExerciseActive = false;

    // Update exercise progress dots
    const dotsContainer = document.getElementById('tutor-exercise-steps');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      this.currentLesson.exercises.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `step-dot ${i === index ? 'active' : (i < index ? 'done' : '')}`;
        dotsContainer.appendChild(dot);
      });
    }

    // Render exercise text
    const displayEl = document.getElementById('tutor-words-display');
    if (!displayEl) return;
    displayEl.innerHTML = '';
    this.charElements = [];

    for (let i = 0; i < exerciseText.length; i++) {
      const char = exerciseText[i];
      const span = document.createElement('span');
      span.className = 'tutor-char';
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
        span.classList.add('char-space');
      } else {
        span.textContent = char;
      }
      displayEl.appendChild(span);
      this.charElements.push(span);
    }

    if (this.charElements[0]) {
      this.charElements[0].classList.add('current');
    }

    // Focus input and highlight key
    const input = document.getElementById('tutor-hidden-input');
    if (input) input.focus();

    if (window.keyboardVisualizer && exerciseText.length > 0) {
      window.keyboardVisualizer.highlightTarget(exerciseText[0]);
    }

    this.updateTutorMetrics();
  }

  handleTutorKeyDown(e) {
    if (!this.currentLesson || this.currentIndex >= this.rawText.length) return;

    if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    if (!this.isExerciseActive) {
      this.isExerciseActive = true;
      this.startTime = Date.now();
    }

    const expectedChar = this.rawText[this.currentIndex];

    // Backspace
    if (e.key === 'Backspace') {
      if (this.currentIndex > 0) {
        this.charElements[this.currentIndex].classList.remove('current');
        this.currentIndex--;
        this.charElements[this.currentIndex].classList.remove('correct', 'incorrect');
        this.charElements[this.currentIndex].classList.add('current');

        if (window.keyboardVisualizer) {
          window.keyboardVisualizer.highlightTarget(this.rawText[this.currentIndex]);
        }
      }
      return;
    }

    const typedChar = e.key;
    this.totalCount++;
    const isCorrect = (typedChar === expectedChar);

    if (window.soundEngine) {
      if (isCorrect) window.soundEngine.playKeySound(typedChar === ' ');
      else window.soundEngine.playErrorSound();
    }

    const currentSpan = this.charElements[this.currentIndex];
    currentSpan.classList.remove('current');

    if (isCorrect) {
      this.correctCount++;
      currentSpan.classList.add('correct');
    } else {
      this.mistakesCount++;
      currentSpan.classList.add('incorrect');
    }

    this.currentIndex++;

    this.updateTutorMetrics();

    // Check if exercise completed
    if (this.currentIndex >= this.rawText.length) {
      this.finishExercise();
      return;
    }

    // Advance to next char
    const nextSpan = this.charElements[this.currentIndex];
    if (nextSpan) nextSpan.classList.add('current');

    if (window.keyboardVisualizer) {
      window.keyboardVisualizer.highlightTarget(this.rawText[this.currentIndex]);
    }
  }

  updateTutorMetrics() {
    const elapsedMinutes = Math.max(0.01, (Date.now() - (this.startTime || Date.now())) / 60000);
    const wpm = this.startTime ? Math.round((this.correctCount / 5) / elapsedMinutes) : 0;
    const acc = this.totalCount > 0 ? Math.round((this.correctCount / this.totalCount) * 100) : 100;

    const liveWpmEl = document.getElementById('tutor-live-wpm');
    const liveAccEl = document.getElementById('tutor-live-acc');
    if (liveWpmEl) liveWpmEl.textContent = `${wpm} WPM`;
    if (liveAccEl) liveAccEl.textContent = `${acc}%`;
  }

  finishExercise() {
    if (window.soundEngine) {
      window.soundEngine.playSuccessChime();
    }

    const isLastExercise = (this.currentExerciseIndex >= this.currentLesson.exercises.length - 1);

    if (!isLastExercise) {
      // Advance to next exercise after brief 400ms pause
      setTimeout(() => {
        this.loadExercise(this.currentExerciseIndex + 1);
      }, 400);
    } else {
      // Completed all exercises for this lesson!
      this.evaluateLessonCompletion();
    }
  }

  evaluateLessonCompletion() {
    const elapsedMinutes = Math.max(0.01, (Date.now() - this.startTime) / 60000);
    const wpm = Math.round((this.correctCount / 5) / elapsedMinutes);
    const acc = this.totalCount > 0 ? Math.round((this.correctCount / this.totalCount) * 100) : 100;

    let stars = 0;
    const passed = (acc >= this.currentLesson.minAccuracy * 0.9);

    if (acc >= this.currentLesson.minAccuracy && wpm >= this.currentLesson.targetWpm) {
      stars = 3;
    } else if (acc >= this.currentLesson.minAccuracy || wpm >= this.currentLesson.targetWpm * 0.8) {
      stars = 2;
    } else if (passed) {
      stars = 1;
    }

    // Save score if better
    const existing = this.progress.scores[this.currentLesson.id];
    if (!existing || stars > existing.stars || (stars === existing.stars && wpm > existing.bestWpm)) {
      this.progress.scores[this.currentLesson.id] = {
        stars,
        bestWpm: Math.max(wpm, existing ? existing.bestWpm : 0),
        bestAcc: Math.max(acc, existing ? existing.bestAcc : 0),
        completedAt: Date.now()
      };
    }

    // Unlock next lesson if passed with at least 1 star
    if (passed) {
      const currentIdx = LESSONS_DATA.findIndex(l => l.id === this.currentLesson.id);
      if (currentIdx !== -1 && currentIdx + 1 < LESSONS_DATA.length) {
        const nextId = LESSONS_DATA[currentIdx + 1].id;
        if (!this.progress.unlocked.includes(nextId)) {
          this.progress.unlocked.push(nextId);
        }
      }
    }

    this.saveProgress();

    // Show completion modal
    this.showCompletionModal(stars, wpm, acc, passed);
  }

  showCompletionModal(stars, wpm, acc, passed) {
    const modal = document.getElementById('lesson-result-modal');
    if (!modal) return;

    modal.classList.add('active');

    document.getElementById('result-stars').innerHTML = `
      <span class="star-res ${stars >= 1 ? 'gold' : ''}">★</span>
      <span class="star-res ${stars >= 2 ? 'gold' : ''}">★</span>
      <span class="star-res ${stars >= 3 ? 'gold' : ''}">★</span>
    `;

    document.getElementById('result-lesson-title').textContent = `${this.currentLesson.title} Complete!`;
    document.getElementById('result-wpm-stat').textContent = `${wpm} WPM (Target: ${this.currentLesson.targetWpm})`;
    document.getElementById('result-acc-stat').textContent = `${acc}% (Target: ${this.currentLesson.minAccuracy}%)`;

    const feedbackEl = document.getElementById('result-feedback');
    if (stars === 3) {
      feedbackEl.textContent = '🌟 Flawless! Exceptional speed and accuracy!';
    } else if (stars === 2) {
      feedbackEl.textContent = '👍 Great job! You passed the requirements.';
    } else if (stars === 1) {
      feedbackEl.textContent = '🌱 You passed! Practice once more to master this lesson.';
    } else {
      feedbackEl.textContent = 'Keep practicing! Focus on accuracy first, speed will follow.';
    }

    const nextBtn = document.getElementById('result-next-btn');
    const currentIdx = LESSONS_DATA.findIndex(l => l.id === this.currentLesson.id);
    const hasNext = (currentIdx + 1 < LESSONS_DATA.length);

    if (hasNext && passed) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.onclick = () => {
        modal.classList.remove('active');
        this.startLesson(LESSONS_DATA[currentIdx + 1].id);
      };
    } else {
      nextBtn.style.display = 'none';
    }

    document.getElementById('result-retry-btn').onclick = () => {
      modal.classList.remove('active');
      this.startLesson(this.currentLesson.id);
    };

    document.getElementById('result-back-btn').onclick = () => {
      modal.classList.remove('active');
      this.closeTutor();
    };
  }

  closeTutor() {
    const modal = document.getElementById('lesson-tutor-modal');
    if (modal) modal.classList.remove('active');
    this.currentLesson = null;
    if (window.keyboardVisualizer) {
      window.keyboardVisualizer.clearHighlights();
    }
    this.renderCurriculum();
  }
}

window.LessonsEngine = LessonsEngine;
