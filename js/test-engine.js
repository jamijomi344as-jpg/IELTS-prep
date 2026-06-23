/* ============================================================
   TEST ISHLASH MODULI
   ============================================================ */

var TestEngine = {
  currentTest: null,
  currentMode: 'exam',
  answers: {},
  writingAnswers: {},
  timer: null,
  timeRemaining: 0,
  currentSection: 0,
  flagged: {},
  audioTimer: null,
  audioElapsed: 0,
  audioPlaying: false,
  speechUtterance: null,

  start: function(testId, mode) {
    var self = this;
    DB.getTestById(testId).then(function(test) {
      if (!test) {
        showToast('Test topilmadi', 'error');
        App.navigate('dashboard');
        return;
      }

      self.currentTest = test;
      self.currentMode = mode;
      self.answers = {};
      self.writingAnswers = {};
      self.currentSection = 0;
      self.flagged = {};
      self.audioElapsed = 0;
      self.audioPlaying = false;

      if (!test.time_limit && test.timeLimit) {
        test.time_limit = test.timeLimit;
      }
      if (test.sections) {
        for (var i = 0; i < test.sections.length; i++) {
          var sec = test.sections[i];
          if (sec.questions) {
            for (var j = 0; j < sec.questions.length; j++) {
              var q = sec.questions[j];
              if (q.correctAnswer && !q.correct_answer) q.correct_answer = q.correctAnswer;
              if (q.audioText && !q.audio_text) q.audio_text = q.audioText;
              if (q.imageUrl && !q.image_url) q.image_url = q.imageUrl;
              if (q.minWords && !q.min_words) q.min_words = q.minWords;
            }
          }
        }
      }

      if (mode === 'exam') {
        self.timeRemaining = (test.time_limit || 60) * 60;
        self.startTimer();
      }

      self.render();
      window.scrollTo(0, 0);
    });
  },

  startTimer: function() {
    var self = this;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(function() {
      self.timeRemaining--;
      self.updateTimerDisplay();
      if (self.timeRemaining <= 0) {
        clearInterval(self.timer);
        showToast('Vaqt tugadi! Test topshirilmoqda...', 'warning');
        setTimeout(function() { self.submit(); }, 1000);
      }
    }, 1000);
  },

  updateTimerDisplay: function() {
    var el = document.getElementById('test-timer');
    if (!el) return;
    var m = Math.floor(this.timeRemaining / 60);
    var s = this.timeRemaining % 60;
    el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    el.className = 'test-timer';
    if (this.timeRemaining <= 60) el.classList.add('danger');
    else if (this.timeRemaining <= 300) el.classList.add('warning');
    else el.classList.add('normal');
  },

  stopTimer: function() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  },

  stopAudio: function() {
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch(e) {}
    if (this.audioTimer) { clearInterval(this.audioTimer); this.audioTimer = null; }
    this.audioPlaying = false;
    this.audioElapsed = 0;
  },

  render: function() {
    var test = this.currentTest;
    var user = Auth.getCurrentUser();
    var app = document.getElementById('app');
    if (!app) return;

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
    if (test.type === 'listening' && this.audioPlaying) {
      var btn = document.getElementById('audio-play-btn');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  },

  renderReadingTest: function(user) {
    var test = this.currentTest;
    var sec = test.sections[this.currentSection];
    if (!sec) return '<p>Bo\'lim topilmadi</p>';
    var qHTML = this.renderQuestions(sec.questions || []);
    var navHTML = this.renderNav();
    var secInfo = '<span class="badge badge-accent">Section ' + (this.currentSection + 1) + '/' + test.sections.length + '</span>';
    var timerHTML = this.currentMode === 'exam'
      ? '<div class="test-timer normal" id="test-timer">--:--</div>'
      : '<span class="badge badge-success"><i class="fa-solid fa-infinity"></i> Mashg\'ulot</span>';
    var prevBtn = this.currentSection > 0 ? '<button class="btn btn-outline btn-sm" onclick="TestEngine.prevSection()"><i class="fa-solid fa-arrow-left"></i> Oldingi</button>' : '';
    var nextBtn = this.currentSection < test.sections.length - 1 ? '<button class="btn btn-primary btn-sm" onclick="TestEngine.nextSection()">Keyingi <i class="fa-solid fa-arrow-right"></i></button>' : '';

    return renderNavbar(user) +
      '<div class="test-header"><div class="container"><div class="test-header-left">' +
        '<button class="btn btn-ghost btn-sm" onclick="TestEngine.confirmExit()"><i class="fa-solid fa-xmark"></i></button>' +
        '<span class="test-header-title">' + test.title + '</span></div>' +
        '<div class="flex items-center gap-4">' + secInfo + timerHTML + '</div></div></div>' +
      '<div class="container"><div class="test-body">' +
        '<div class="passage-panel"><h3>' + sec.title + '</h3><div class="passage-text">' + (sec.passage || '') + '</div></div>' +
        '<div class="questions-panel">' + qHTML + '</div></div>' + navHTML + '</div>' +
      '<div class="test-footer"><div class="container flex justify-between items-center">' +
        '<div class="flex gap-2">' + prevBtn + nextBtn + '</div>' +
        '<div class="flex gap-2">' +
          '<button class="btn btn-ghost btn-sm" onclick="TestEngine.showFlagModal()"><i class="fa-solid fa-flag"></i> ' + this.countFlagged() + '</button>' +
          '<button class="btn btn-accent btn-sm" onclick="TestEngine.confirmSubmit()"><i class="fa-solid fa-paper-plane"></i> Topshirish</button>' +
        '</div></div></div>';
  },

  renderListeningTest: function(user) {
    var test = this.currentTest;
    var sec = test.sections[this.currentSection];
    if (!sec) return '<p>Bo\'lim topilmadi</p>';
    var qHTML = this.renderQuestions(sec.questions || []);
    var navHTML = this.renderNav();
    var secInfo = '<span class="badge badge-accent">Section ' + (this.currentSection + 1) + '/' + test.sections.length + '</span>';
    var timerHTML = this.currentMode === 'exam'
      ? '<div class="test-timer normal" id="test-timer">--:--</div>'
      : '<span class="badge badge-success"><i class="fa-solid fa-infinity"></i> Mashg\'ulot</span>';
    var prevBtn = this.currentSection > 0 ? '<button class="btn btn-outline btn-sm" onclick="TestEngine.prevSection()"><i class="fa-solid fa-arrow-left"></i> Oldingi</button>' : '';
    var nextBtn = this.currentSection < test.sections.length - 1 ? '<button class="btn btn-primary btn-sm" onclick="TestEngine.nextSection()">Keyingi <i class="fa-solid fa-arrow-right"></i></button>' : '';

    var audioCard = '<div class="audio-player-card">' +
      '<h4><i class="fa-solid fa-headphones" style="margin-right:8px;"></i>' + sec.title + '</h4>' +
      '<div class="audio-player">' +
        '<button class="play-btn" id="audio-play-btn" onclick="TestEngine.toggleAudio()"><i class="fa-solid fa-play"></i></button>' +
        '<div class="audio-progress"><div class="audio-progress-bar" id="audio-progress-bar" style="width:' + (this.audioElapsed > 0 ? '50' : '0') + '%"></div></div>' +
        '<span class="audio-time" id="audio-time">' + formatTime(this.audioElapsed) + '</span>' +
      '</div>' +
      '<div class="audio-note"><i class="fa-solid fa-volume-high"></i> Matn o\'qish orqali audio simulyatsiyasi</div></div>';

    return renderNavbar(user) +
      '<div class="test-header"><div class="container"><div class="test-header-left">' +
        '<button class="btn btn-ghost btn-sm" onclick="TestEngine.confirmExit()"><i class="fa-solid fa-xmark"></i></button>' +
        '<span class="test-header-title">' + test.title + '</span></div>' +
        '<div class="flex items-center gap-4">' + secInfo + timerHTML + '</div></div></div>' +
      '<div class="container"><div class="test-body single-col">' +
        '<div class="questions-panel">' + audioCard + qHTML + '</div></div>' + navHTML + '</div>' +
      '<div class="test-footer"><div class="container flex justify-between items-center">' +
        '<div class="flex gap-2">' + prevBtn + nextBtn + '</div>' +
        '<div class="flex gap-2">' +
          '<button class="btn btn-ghost btn-sm" onclick="TestEngine.showFlagModal()"><i class="fa-solid fa-flag"></i> ' + this.countFlagged() + '</button>' +
          '<button class="btn btn-accent btn-sm" onclick="TestEngine.confirmSubmit()"><i class="fa-solid fa-paper-plane"></i> Topshirish</button>' +
        '</div></div></div>';
  },

  renderWritingTest: function(user) {
    var test = this.currentTest;
    var secHTML = '';
    for (var i = 0; i < test.sections.length; i++) {
      var sec = test.sections[i];
      var wc = countWords(this.writingAnswers[sec.id] || '');
      var minW = sec.min_words || 150;
      var wcClass = wc >= minW ? 'ok' : (wc > 0 ? 'low' : '');
      var imgTag = sec.image_url ? '<img src="' + sec.image_url + '" alt="Task image" class="task-image" onerror="this.style.display=\'none\'">' : '';

      secHTML += '<div class="task-card">' +
        '<div class="task-header"><h3>' + sec.title + '</h3><span class="badge badge-primary">Kamida ' + minW + ' so\'z</span></div>' +
        '<div class="task-prompt">' + (sec.prompt || '') + '</div>' + imgTag +
        '<textarea class="writing-textarea" placeholder="O\'z javobingizni shu yerga yozing..." oninput="TestEngine.onWritingInput(' + sec.id + ', this)">' + (this.writingAnswers[sec.id] || '') + '</textarea>' +
        '<div class="word-count ' + wcClass + '"><i class="fa-solid fa-font"></i> <span id="wc-' + sec.id + '">' + wc + '</span> so\'z / kamida ' + minW + ' so\'z kerak</div></div>';
    }

    var timerHTML = this.currentMode === 'exam'
      ? '<div class="test-timer normal" id="test-timer">--:--</div>'
      : '<span class="badge badge-success"><i class="fa-solid fa-infinity"></i> Mashg\'ulot</span>';

    return renderNavbar(user) +
      '<div class="test-header"><div class="container"><div class="test-header-left">' +
        '<button class="btn btn-ghost btn-sm" onclick="TestEngine.confirmExit()"><i class="fa-solid fa-xmark"></i></button>' +
        '<span class="test-header-title">' + test.title + '</span></div>' +
        '<div class="flex items-center gap-4"><span class="badge badge-primary">Writing</span>' + timerHTML + '</div></div></div>' +
      '<div class="container"><div class="writing-container">' + secHTML +
        '<div style="text-align:center;padding:32px 0;"><button class="btn btn-accent btn-lg" onclick="TestEngine.confirmSubmit()"><i class="fa-solid fa-paper-plane"></i> Topshirish</button></div>' +
      '</div></div>' +
      '<div class="test-footer"><div class="container flex justify-between items-center">' +
        '<span class="text-muted text-sm">Writing test</span>' +
        '<button class="btn btn-accent btn-sm" onclick="TestEngine.confirmSubmit()"><i class="fa-solid fa-paper-plane"></i> Topshirish</button>' +
      '</div></div>';
  },

  renderQuestions: function(questions) {
    var html = '';
    for (var i = 0; i < questions.length; i++) {
      html += this.renderOneQuestion(questions[i]);
    }
    return html;
  },

  renderOneQuestion: function(q) {
    var ua = this.answers[q.id] || '';
    var html = '<div class="question-block" id="qblock-' + q.id + '">' +
      '<div class="question-text"><span class="question-number">' + q.id + '</span><span>' + q.text + '</span></div>';

    if (q.type === 'mcq') {
      html += '<div class="question-options">';
      for (var i = 0; i < q.options.length; i++) {
        var opt = q.options[i];
        var letter = opt.charAt(0);
        var sel = ua === letter ? ' selected' : '';
        var text = opt.length > 2 ? opt.substring(3) : opt;
        html += '<label class="option-label' + sel + '" onclick="TestEngine.selectAnswer(' + q.id + ', \'' + letter + '\')">' +
          '<input type="radio" name="q' + q.id + '"' + (sel ? ' checked' : '') + '>' +
          '<span class="option-letter">' + letter + '</span><span>' + text + '</span></label>';
      }
      html += '</div>';
    } else if (q.type === 'tfng') {
      var opts = ['True', 'False', 'Not Given'];
      html += '<div class="question-options">';
      for (var j = 0; j < opts.length; j++) {
        var s2 = ua === opts[j] ? ' selected' : '';
        html += '<label class="option-label' + s2 + '" onclick="TestEngine.selectAnswer(' + q.id + ', \'' + opts[j] + '\')">' +
          '<input type="radio" name="q' + q.id + '"' + (s2 ? ' checked' : '') + '>' +
          '<span class="option-letter">' + opts[j].charAt(0) + '</span><span>' + opts[j] + '</span></label>';
      }
      html += '</div>';
    } else if (q.type === 'ynng') {
      var opts2 = ['Yes', 'No', 'Not Given'];
      html += '<div class="question-options">';
      for (var k = 0; k < opts2.length; k++) {
        var s3 = ua === opts2[k] ? ' selected' : '';
        html += '<label class="option-label' + s3 + '" onclick="TestEngine.selectAnswer(' + q.id + ', \'' + opts2[k] + '\')">' +
          '<input type="radio" name="q' + q.id + '"' + (s3 ? ' checked' : '') + '>' +
          '<span class="option-letter">' + opts2[k].charAt(0) + '</span><span>' + opts2[k] + '</span></label>';
      }
      html += '</div>';
    } else if (q.type === 'fill') {
      html += '<input type="text" class="fill-input" placeholder="Javobni kiriting..." value="' + ua + '" oninput="TestEngine.selectAnswer(' + q.id + ', this.value)">';
    }

    html += '</div>';
    return html;
  },

  renderNav: function() {
    var allQ = this.getAllQuestions();
    if (allQ.length === 0) return '';
    var html = '<div class="question-nav">';
    for (var i = 0; i < allQ.length; i++) {
      var q = allQ[i];
      var answered = this.answers[q.id] && String(this.answers[q.id]).trim() !== '';
      var flagged = this.flagged[q.id];
      var cls = 'q-nav-btn';
      if (flagged) cls += ' flagged';
      else if (answered) cls += ' answered';
      html += '<button class="' + cls + '" onclick="document.getElementById(\'qblock-' + q.id + '\').scrollIntoView({behavior:\'smooth\',block:\'center\'})" title="Savol ' + q.id + '">' + q.id + '</button>';
    }
    html += '</div>';
    return html;
  },

  getAllQuestions: function() {
    if (!this.currentTest || !this.currentTest.sections) return [];
    var all = [];
    for (var i = 0; i < this.currentTest.sections.length; i++) {
      var sec = this.currentTest.sections[i];
      if (sec.questions) {
        for (var j = 0; j < sec.questions.length; j++) {
          all.push(sec.questions[j]);
        }
      }
    }
    return all;
  },

  countFlagged: function() {
    var c = 0;
    for (var k in this.flagged) { if (this.flagged[k]) c++; }
    return c > 0 ? c : '';
  },

  selectAnswer: function(qid, val) {
    if (this.currentMode === 'exam' && this.answers[qid] && String(this.answers[qid]).trim() !== '') {
      showToast('Imtihon rejimida javobni o\'zgartirib bo\'lmaydi', 'warning');
      return;
    }
    this.answers[qid] = val;

    var block = document.getElementById('qblock-' + qid);
    if (block) {
      var labels = block.querySelectorAll('.option-label');
      for (var i = 0; i < labels.length; i++) {
        var lbl = labels[i];
        var ltr = lbl.querySelector('.option-letter');
        if (ltr && val === ltr.textContent) {
          lbl.classList.add('selected');
          var inp = lbl.querySelector('input');
          if (inp) inp.checked = true;
        } else {
          lbl.classList.remove('selected');
          var inp2 = lbl.querySelector('input');
          if (inp2) inp2.checked = false;
        }
      }
    }
  },

  onWritingInput: function(secId, ta) {
    this.writingAnswers[secId] = ta.value;
    var wc = countWords(ta.value);
    var el = document.getElementById('wc-' + secId);
    if (el) el.textContent = wc;
    var test = this.currentTest;
    if (test && test.sections) {
      for (var i = 0; i < test.sections.length; i++) {
        if (test.sections[i].id === secId) {
          var minW = test.sections[i].min_words || 150;
          var p = el ? el.parentElement : null;
          if (p) {
            p.className = 'word-count';
            if (wc >= minW) p.classList.add('ok');
            else if (wc > 0) p.classList.add('low');
          }
          break;
        }
      }
    }
  },

  toggleAudio: function() {
    var btn = document.getElementById('audio-play-btn');
    var sec = this.currentTest.sections[this.currentSection];
    var txt = sec.audio_text || '';

    if (this.audioPlaying) {
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch(e) {}
      if (this.audioTimer) { clearInterval(this.audioTimer); this.audioTimer = null; }
      this.audioPlaying = false;
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      return;
    }

    if (!txt) { showToast('Audio matni mavjud emas', 'warning'); return; }

    if (window.speechSynthesis) {
      var self = this;
      this.speechUtterance = new SpeechSynthesisUtterance(txt);
      this.speechUtterance.lang = 'en-GB';
      this.speechUtterance.rate = 0.9;
      var words = txt.split(/\s+/).length;
      var dur = Math.ceil(words * 0.6);
      this.audioElapsed = 0;

      this.speechUtterance.onend = function() {
        self.audioPlaying = false;
        if (self.audioTimer) { clearInterval(self.audioTimer); self.audioTimer = null; }
        if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
        var bar = document.getElementById('audio-progress-bar');
        if (bar) bar.style.width = '100%';
      };

      window.speechSynthesis.speak(this.speechUtterance);
      this.audioPlaying = true;
      if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i>';

      if (this.audioTimer) clearInterval(this.audioTimer);
      this.audioTimer = setInterval(function() {
        self.audioElapsed++;
        var pct = Math.min(100, (self.audioElapsed / dur) * 100);
        var bar = document.getElementById('audio-progress-bar');
        if (bar) bar.style.width = pct + '%';
        var tEl = document.getElementById('audio-time');
        if (tEl) tEl.textContent = formatTime(self.audioElapsed);
      }, 1000);
    } else {
      showToast('Brauzer so\'zlash funksiyasini qo\'llab-quvvatlamaydi', 'error');
    }
  },

  prevSection: function() {
    if (this.currentSection > 0) {
      this.stopAudio();
      this.currentSection--;
      this.audioElapsed = 0;
      this.render();
      window.scrollTo(0, 0);
    }
  },

  nextSection: function() {
    if (this.currentSection < this.currentTest.sections.length - 1) {
      this.stopAudio();
      this.currentSection++;
      this.audioElapsed = 0;
      this.render();
      window.scrollTo(0, 0);
    }
  },

  confirmExit: function() {
    showModal('Testni tark etish',
      '<p style="margin-bottom:16px;">Haqiqatan ham testni tark etmoqchimisiz?</p><p class="text-muted" style="font-size:14px;">Javoblar saqlanmaydi.</p>',
      '<button class="btn btn-ghost" onclick="closeModal()">Bekor qilish</button>' +
      '<button class="btn btn-danger" onclick="TestEngine.exitTest()">Ha, chiqish</button>'
    );
  },

  exitTest: function() {
    this.stopAudio();
    this.stopTimer();
    closeModal();
    var user = Auth.getCurrentUser();
    App.navigate(user && user.isAdmin ? 'admin' : 'dashboard');
  },

  showFlagModal: function() {
    var allQ = this.getAllQuestions();
    var flaggedQ = [];
    for (var i = 0; i < allQ.length; i++) {
      if (this.flagged[allQ[i].id]) flaggedQ.push(allQ[i]);
    }
    var body = '';
    if (flaggedQ.length === 0) {
      body = '<p class="text-muted text-center" style="padding:20px;">Hech qanday savol belgilanmagan</p>';
    } else {
      for (var j = 0; j < flaggedQ.length; j++) {
        var fq = flaggedQ[j];
        body += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">' +
          '<span><strong>Savol ' + fq.id + ':</strong> ' + fq.text.substring(0, 60) + '...</span>' +
          '<button class="btn btn-sm btn-ghost" onclick="TestEngine.unflag(' + fq.id + ');TestEngine.showFlagModal();"><i class="fa-solid fa-xmark" style="color:var(--danger);"></i></button></div>';
      }
    }
    showModal('Belgilangan savollar (' + flaggedQ.length + ')', body);
  },

  unflag: function(qid) {
    delete this.flagged[qid];
  },

  confirmSubmit: function() {
    var allQ = this.getAllQuestions();
    var isW = this.currentTest.type === 'writing';
    var ansCount = 0;
    if (!isW) {
      for (var i = 0; i < allQ.length; i++) {
        if (this.answers[allQ[i].id] && String(this.answers[allQ[i].id]).trim() !== '') ansCount++;
      }
    }
    var body = '';
    if (isW) {
      body = '<p>Writing testni topshirmoqchimisiz?</p>';
    } else {
      body = '<p style="margin-bottom:16px;">Testni topshirmoqchimisiz?</p>' +
        '<div style="display:flex;gap:24px;margin-bottom:16px;">' +
        '<div style="text-align:center;"><div style="font-size:32px;font-weight:800;color:var(--success);">' + ansCount + '</div><div style="font-size:13px;color:var(--text-muted);">Javob berilgan</div></div>' +
        '<div style="text-align:center;"><div style="font-size:32px;font-weight:800;color:var(--danger);">' + (allQ.length - ansCount) + '</div><div style="font-size:13px;color:var(--text-muted);">Javobsiz</div></div></div>' +
        (ansCount < allQ.length ? '<p style="color:var(--warning);font-size:14px;"><i class="fa-solid fa-triangle-exclamation"></i> ' + (allQ.length - ansCount) + ' ta savolga javob berilmagan!</p>' : '');
    }
    showModal('Testni topshirish', body,
      '<button class="btn btn-ghost" onclick="closeModal()">Bekor qilish</button>' +
      '<button class="btn btn-accent" onclick="closeModal();TestEngine.submit();">Topshirish</button>'
    );
  },

  submit: function() {
    var self = this;
    this.stopTimer();
    this.stopAudio();

    var test = this.currentTest;
    var user = Auth.getCurrentUser();
    if (!user) { App.navigate('login'); return; }

    var allQ = this.getAllQuestions();
    var isW = test.type === 'writing';
    var score = 0;
    var bandScore = 0;
    var details = [];

    if (isW) {
      for (var i = 0; i < test.sections.length; i++) {
        var sec = test.sections[i];
        var txt = this.writingAnswers[sec.id] || '';
        var wc = countWords(txt);
        var minW = sec.min_words || 150;
        details.push({ section_id: sec.id, section_title: sec.title, word_count: wc, min_words: minW, meets_requirement: wc >= minW, text: txt });
      }
      bandScore = 0;
      score = 0;
    } else {
      for (var j = 0; j < allQ.length; j++) {
        var q = allQ[j];
        var uAns = this.answers[q.id] || '';
        var cAns = q.correct_answer || '';
        var correct = checkAnswer(uAns, cAns);
        if (correct) score++;
        details.push({ question_id: q.id, type: q.type, text: q.text, user_answer: uAns, correct_answer: cAns, is_correct: correct });
      }
      bandScore = BandScore.calculate(score, allQ.length, test.type);
      bandScore = Math.round(bandScore * 2) / 2;
    }

    var result = {
      id: generateId('res'),
      student_id: user.id,
      student_name: user.name || user.email,
      test_id: test.id,
      test_title: test.title,
      test_type: test.type,
      mode: this.currentMode,
      score: score,
      total_questions: allQ.length,
      band_score: bandScore,
      answers: details,
      writing_answers: this.writingAnswers,
      submitted_at: new Date().toISOString()
    };

    DB.insert('results', result).then(function() {
      App.navigate('results/' + result.id);
    });
  }
};
