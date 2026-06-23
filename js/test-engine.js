/* ============================================================
   TEST ISHLASH MODULI
   Timer, savollarni ko'rsatish, javoblarni yig'ish, natijani hisoblash
   ============================================================ */

const TestEngine = {
  currentTest: null,
  currentMode: 'exam',
  answers: {},
  writingAnswers: {},
  timer: null,
  timeRemaining: 0,
  currentSection: 0,
  flagged: new Set(),
  audioElement: null,
  audioTimer: null,
  audioProgress: 0,

  // Testni boshlash
  async start(testId, mode) {
    const test = await DB.getTestById(testId);
    if (!test) {
      showToast('Test topilmadi', 'error');
      App.navigate('dashboard');
      return;
    }

    this.currentTest = test;
    this.currentMode = mode;
    this.answers = {};
    this.writingAnswers = {};
    this.currentSection = 0;
    this.flagged = new Set();

    if (mode === 'exam') {
      this.timeRemaining = test.time_limit * 60;
      this.startTimer();
    }

    this.render();
  },

  // Timer
  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        this.submit();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const el = document.getElementById('test-timer');
    if (!el) return;
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    el.className = 'test-timer';
    if (this.timeRemaining <= 60) el.classList.add('danger');
    else if (this.timeRemaining <= 300) el.classList.add('warning');
    else el.classList.add('normal');
  },

  // Asosiy render
  render() {
    const test = this.currentTest;
    const user = Auth.getCurrentUser();
    const app = document.getElementById('app');

    if (test.type === 'writing') {
      app.innerHTML = this.renderWritingTest(user);
    } else if (test.type === 'listening') {
      app.innerHTML = this.renderListeningTest(user);
    } else {
      app.innerHTML = this.renderReadingTest(user);
    }

    if (this.currentMode === 'exam') {
      this.updateTimerDisplay();
    }

    // Audio boshlash (listening uchun)
    if (test.type === 'listening') {
      this.initAudio();
    }
  },

  // ==================== READING TEST ====================
  renderReadingTest(user) {
    const test = this.currentTest;
    const section = test.sections[this.currentSection];
    const totalQuestions = this._getAllQuestions().length;

    const questionsHTML = section.questions.map(q => this._renderQuestion(q)).join('');
    const navHTML = this._renderQuestionNav();

    return `
      ${renderNavbar(user)}
      <div class="test-header">
        <div class="container">
          <div class="test-header-left">
            <button class="btn btn-ghost btn-sm" onclick="TestEngine.confirmExit()">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <span class="test-header-title">${test.title}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="badge badge-accent">Section ${this.currentSection + 1}/${test.sections.length}</span>
            ${this.currentMode === 'exam' ? `<div class="test-timer normal" id="test-timer">--:--</div>` : '<span class="badge badge-success"><i class="fa-solid fa-infinity"></i> Mashg\'ulot</span>'}
          </div>
        </div>
      </div>

      <div class="container">
        <div class="test-body">
          <div class="passage-panel">
            <h3>${section.title}</h3>
            <div class="passage-text">${section.passage}</div>
          </div>
          <div class="questions-panel">
            ${questionsHTML}
          </div>
        </div>
        ${navHTML}
      </div>

      <div class="test-footer">
        <div class="container flex justify-between items-center">
          <div class="flex gap-2">
            ${this.currentSection > 0 ? `<button class="btn btn-outline btn-sm" onclick="TestEngine.prevSection()"><i class="fa-solid fa-arrow-left"></i> Oldingi</button>` : ''}
            ${this.currentSection < test.sections.length - 1 ? `<button class="btn btn-primary btn-sm" onclick="TestEngine.nextSection()">Keyingi <i class="fa-solid fa-arrow-right"></i></button>` : ''}
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="TestEngine.toggleFlagAll()"><i class="fa-solid fa-flag"></i> Belgilash</button>
            <button class="btn btn-accent btn-sm" onclick="TestEngine.confirmSubmit()"><i class="fa-solid fa-paper-plane"></i> Topshirish</button>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== LISTENING TEST ====================
  renderListeningTest(user) {
    const test = this.currentTest;
    const section = test.sections[this.currentSection];

    const questionsHTML = section.questions.map(q => this._renderQuestion(q)).join('');
    const navHTML = this._renderQuestionNav();

    return `
      ${renderNavbar(user)}
      <div class="test-header">
        <div class="container">
          <div class="test-header-left">
            <button class="btn btn-ghost btn-sm" onclick="TestEngine.confirmExit()">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <span class="test-header-title">${test.title}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="badge badge-accent">Section ${this.currentSection + 1}/${test.sections.length}</span>
            ${this.currentMode === 'exam' ? `<div class="test-timer normal" id="test-timer">--:--</div>` : '<span class="badge badge-success"><i class="fa-solid fa-infinity"></i> Mashg\'ulot</span>'}
          </div>
        </div>
      </div>

      <div class="container">
        <div class="test-body single-col">
          <div class="questions-panel">
            <div class="audio-player-card">
              <h4><i class="fa-solid fa-headphones" style="margin-right:8px;"></i>${section.title}</h4>
              <div class="audio-player">
                <button class="play-btn" id="audio-play-btn" onclick="TestEngine.toggleAudio()">
                  <i class="fa-solid fa-play"></i>
                </button>
                <div class="audio-progress">
                  <div class="audio-progress-bar" id="audio-progress-bar"></div>
                </div>
                <span class="audio-time" id="audio-time">00:00</span>
              </div>
              <div class="audio-note">
                <i class="fa-solid fa-info-circle"></i>
                Audio matn sifatida ko'rsatiladi. Haqiqiy audio qo'shish uchun audio faylni yuklang.
              </div>
            </div>
            ${questionsHTML}
          </div>
        </div>
        ${navHTML}
      </div>

      <div class="test-footer">
        <div class="container flex justify-between items-center">
          <div class="flex gap-2">
            ${this.currentSection > 0 ? `<button class="btn btn-outline btn-sm" onclick="TestEngine.prevSection()"><i class="fa-solid fa-arrow-left"></i> Oldingi</button>` : ''}
            ${this.currentSection < test.sections.length - 1 ? `<button class="btn btn-primary btn-sm" onclick="TestEngine.nextSection()">Keyingi <i class="fa-solid fa-arrow-right"></i></button>` : ''}
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="TestEngine.toggleFlagAll()"><i class="fa-solid fa-flag"></i> Belgilash</button>
            <button class="btn btn-accent btn-sm" onclick="TestEngine.confirmSubmit()"><i class="fa-solid fa-paper-plane"></i> Topshirish</button>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== WRITING TEST ====================
  renderWritingTest(user) {
    const test = this.currentTest;

    const sectionsHTML = test.sections.map((section, idx) => {
      const wordCount = countWords(this.writingAnswers[section.id] || '');
      const isOk = section.min_words ? wordCount >= section.min_words : true;
      const isLow = section.min_words ? wordCount > 0 && wordCount < section.min_words : false;

      return `
        <div class="task-card">
          <div class="task-header">
            <h3>${section.title}</h3>
            <span class="badge badge-primary">Kamida ${section.min_words || 150} so'z</span>
          </div>
          <div class="task-prompt">${section.prompt}</div>
          ${section.image_url ? `<img src="${section.image_url}" alt="Task image" class="task-image">` : ''}
          <textarea
            class="writing-textarea"
            placeholder="Yozing..."
            oninput="TestEngine.onWritingInput(${section.id}, this)"
          >${this.writingAnswers[section.id] || ''}</textarea>
          <div class="word-count ${isOk ? 'ok' : isLow ? 'low' : ''}">
            <i class="fa-solid fa-font"></i>
            <span id="wc-${section.id}">${wordCount}</span> so'z
            ${section.min_words ? ` / kamida ${section.min_words} so'z kerak` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      ${renderNavbar(user)}
      <div class="test-header">
        <div class="container">
          <div class="test-header-left">
            <button class="btn btn-ghost btn-sm" onclick="TestEngine.confirmExit()">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <span class="test-header-title">${test.title}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="badge badge-primary">Writing</span>
            ${this.currentMode === 'exam' ? `<div class="test-timer normal" id="test-timer">--:--</div>` : '<span class="badge badge-success"><i class="fa-solid fa-infinity"></i> Mashg\'ulot</span>'}
          </div>
        </div>
      </div>

      <div class="container">
        <div class="writing-container">
          ${sectionsHTML}
          <div style="text-align:center;padding:24px 0;">
            <button class="btn btn-accent btn-lg" onclick="TestEngine.confirmSubmit()">
              <i class="fa-solid fa-paper-plane"></i> Topshirish
            </button>
          </div>
        </div>
      </div>

      <div class="test-footer">
        <div class="container flex justify-between items-center">
          <span class="text-muted text-sm">Writing test — yozing va topshiring</span>
          <button class="btn btn-accent btn-sm" onclick="TestEngine.confirmSubmit()">
            <i class="fa-solid fa-paper-plane"></i> Topshirish
          </button>
        </div>
      </div>
    `;
  },

  // ==================== SAVOL RENDER ====================
  _renderQuestion(q) {
    const userAnswer = this.answers[q.id] || '';

    if (q.type === 'mcq') {
      const optionsHTML = q.options.map(opt => {
        const letter = opt.charAt(0);
        const isSelected = userAnswer === letter;
        return `
          <label class="option-label ${isSelected ? 'selected' : ''}" onclick="TestEngine.selectAnswer(${q.id}, '${letter}')">
            <input type="radio" name="q${q.id}" ${isSelected ? 'checked' : ''}>
            <span class="option-letter">${letter}</span>
            <span>${opt.substring(3)}</span>
          </label>
        `;
      }).join('');

      return `
        <div class="question-block" id="qblock-${q.id}">
          <div class="question-text">
            <span class="question-number">${q.id}</span>
            <span>${q.text}</span>
          </div>
          <div class="question-options">${optionsHTML}</div>
        </div>
      `;
    }

    if (q.type === 'tfng' || q.type === 'ynng') {
      const options = q.type === 'tfng'
        ? ['True', 'False', 'Not Given']
        : ['Yes', 'No', 'Not Given'];
      const optionsHTML = options.map(opt => {
        const isSelected = userAnswer === opt;
        return `
          <label class="option-label ${isSelected ? 'selected' : ''}" onclick="TestEngine.selectAnswer(${q.id}, '${opt}')">
            <input type="radio" name="q${q.id}" ${isSelected ? 'checked' : ''}>
            <span class="option-letter">${opt.charAt(0)}</span>
            <span>${opt}</span>
          </label>
        `;
      }).join('');

      return `
        <div class="question-block" id="qblock-${q.id}">
          <div class="question-text">
            <span class="question-number">${q.id}</span>
            <span>${q.text}</span>
          </div>
          <div class="question-options">${optionsHTML}</div>
        </div>
      `;
    }

    if (q.type === 'fill') {
      return `
        <div class="question-block" id="qblock-${q.id}">
          <div class="question-text">
            <span class="question-number">${q.id}</span>
            <span>${q.text}</span>
          </div>
          <input
            type="text"
            class="fill-input"
            placeholder="Javobni kiriting..."
            value="${userAnswer}"
            oninput="TestEngine.selectAnswer(${q.id}, this.value)"
          >
        </div>
      `;
    }

    return '';
  },

  // ==================== SAVOL NAVIGATSIYASI ====================
  _renderQuestionNav() {
    const allQ = this._getAllQuestions();
    return `
      <div class="question-nav">
        ${allQ.map(q => {
          const isAnswered = this.answers[q.id] && this.answers[q.id].trim() !== '';
          const isFlagged = this.flagged.has(q.id);
          let cls = 'q-nav-btn';
          if (isFlagged) cls += ' flagged';
          else if (isAnswered) cls += ' answered';
          return `<button class="${cls}" onclick="document.getElementById('qblock-${q.id}').scrollIntoView({behavior:'smooth',block:'center'})" title="Savol ${q.id}">${q.id}</button>`;
        }).join('')}
      </div>
    `;
  },

  _getAllQuestions() {
    const test = this.currentTest;
    let all = [];
    test.sections.forEach(s => { all = all.concat(s.questions || []); });
    return all;
  },

  // ==================== JAVOB TANLASH ====================
  selectAnswer(questionId, value) {
    if (this.currentMode === 'exam' && this.answers[questionId]) {
      // Imtihon rejimida javobni o'zgartirib bo'lmaydi
      showToast('Imtihon rejimida javobni qayta kirita olmaysiz', 'warning');
      return;
    }
    this.answers[questionId] = value;
    this.render(); // Qayta render (audio uzilmasligi uchun yaxshilash kerak)
  },

  // ==================== WRITING INPUT ====================
  onWritingInput(sectionId, textarea) {
    this.writingAnswers[sectionId] = textarea.value;
    const wc = countWords(textarea.value);
    const wcEl = document.getElementById(`wc-${sectionId}`);
    if (wcEl) wcEl.textContent = wc;
  },

  // ==================== AUDIO ====================
  initAudio() {
    // Demo: matn sifatida audio simulyatsiyasi
    // Haqiqiy loyihada bu yerda Audio API yoki TTS ishlaydi
  },

  toggleAudio() {
    const btn = document.getElementById('audio-play-btn');
    const section = this.currentTest.sections[this.currentSection];

    if (this.audioTimer) {
      clearInterval(this.audioTimer);
      this.audioTimer = null;
      btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      return;
    }

    // Audio matnni o'qish (Web Speech API)
    if ('speechSyn
