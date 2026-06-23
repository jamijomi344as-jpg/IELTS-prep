/* ============================================================
   ADMIN TEST BUILDER
   To'liq test qo'shish: bo'limlar + savollar
   ============================================================ */

var AdminBuilder = {
  testId: null,
  testType: 'reading',
  sections: [],

  // Yangi test qo'shish sahifasi
  renderPage(user) {
    this.testId = null;
    this.testType = 'reading';
    this.sections = [];

    return this._renderLayout(user, 'Yangi test qo\'shish');
  },

  // Mavjud testni tahrirlash
  async renderEditPage(user, testId) {
    var test = await DB.getTestById(testId);
    if (!test) {
      showToast('Test topilmadi', 'error');
      App.navigate('admin/tests');
      return '';
    }

    this.testId = test.id;
    this.testType = test.type;
    this.sections = JSON.parse(JSON.stringify(test.sections || []));

    return this._renderLayout(user, 'Testni tahrirlash: ' + test.title);
  },

  // Asosiy layout
  _renderLayout(user, title) {
    return renderNavbar(user) +
      '<div class="admin-layout">' +
        '<aside class="admin-sidebar">' +
          '<div class="admin-sidebar-brand"><i class="fa-solid fa-graduation-cap"></i> IELTS Admin</div>' +
          '<button class="admin-nav-item" onclick="App.navigate(\'admin\')"><i class="fa-solid fa-chart-pie"></i> Dashboard</button>' +
          '<button class="admin-nav-item active" onclick="App.navigate(\'admin/tests\')"><i class="fa-solid fa-list-check"></i> Testlar</button>' +
          '<button class="admin-nav-item" onclick="App.navigate(\'admin/students\')"><i class="fa-solid fa-users"></i> O\'quvchilar</button>' +
          '<button class="admin-nav-item" onclick="App.navigate(\'admin/results\')"><i class="fa-solid fa-trophy"></i> Natijalar</button>' +
        '</aside>' +
        '<main class="admin-content">' +
          '<button class="btn btn-ghost btn-sm mb-4" onclick="App.navigate(\'admin/tests\')"><i class="fa-solid fa-arrow-left"></i> Testlarga qaytish</button>' +
          '<h1>' + title + '</h1>' +
          '<div id="builder-area">' + this._renderForm() + '</div>' +
        '</main>' +
      '</div>';
  },

  // Forma
  _renderForm() {
    var typeLabel = this.testType === 'reading' ? 'Matn (Passage)' :
                    this.testType === 'listening' ? 'Audio matni' : 'Topshiriq matni (Prompt)';

    var sectionsHTML = '';
    for (var i = 0; i < this.sections.length; i++) {
      sectionsHTML += this._renderSectionCard(i);
    }

    return '' +
      '<div class="card card-body mb-6">' +
        '<h3 style="margin-bottom:20px;">Asosiy ma\'lumotlar</h3>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div class="form-group"><label class="form-label">Test nomi</label><input type="text" class="form-input" id="bt-title" placeholder="Masalan: Reading Practice Test 2"></div>' +
          '<div class="form-group"><label class="form-label">Turi</label><select class="form-select" id="bt-type" onchange="AdminBuilder.onTypeChange()"><option value="reading"' + (this.testType==='reading'?' selected':'') + '>Reading</option><option value="listening"' + (this.testType==='listening'?' selected':'') + '>Listening</option><option value="writing"' + (this.testType==='writing'?' selected':'') + '>Writing</option></select></div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div class="form-group"><label class="form-label">Vaqt (daqiqa)</label><input type="number" class="form-input" id="bt-time" value="60" min="5" max="300"></div>' +
          '<div class="form-group"><label class="form-label">Tavsif</label><input type="text" class="form-input" id="bt-desc" placeholder="Qisqacha tavsif"></div>' +
        '</div>' +
      '</div>' +

      '<div class="flex justify-between items-center mb-4">' +
        '<h2>Bo\'limlar (Sections) — ' + this.sections.length + ' ta</h2>' +
        '<button class="btn btn-primary" onclick="AdminBuilder.addSection()"><i class="fa-solid fa-plus"></i> Bo\'lim qo\'shish</button>' +
      '</div>' +

      '<div id="sections-container">' + (sectionsHTML || '<div class="empty-state"><i class="fa-solid fa-layer-group"></i><h3>Hali bo\'lim yo\'q</h3><p>Yuqoridagi tugmani bosing</p></div>') + '</div>' +

      '<div style="text-align:center;padding:40px 0;">' +
        '<button class="btn btn-accent btn-lg" onclick="AdminBuilder.saveTest()"><i class="fa-solid fa-floppy-disk"></i> Testni saqlash</button>' +
      '</div>';
  },

  // Tur o'zgarganda
  onTypeChange() {
    this.testType = document.getElementById('bt-type').value;
    this.sections = [];
    document.getElementById('sections-container').innerHTML = '<div class="empty-state"><i class="fa-solid fa-layer-group"></i><h3>Hali bo\'lim yo\'q</h3><p>Yuqoridagi tugmani bosing</p></div>';
  },

  // Bo'lim qo'shish
  addSection() {
    var sId = this.sections.length + 1;
    var newSection = {
      id: sId,
      title: 'Section ' + sId,
      passage: '',
      audio_text: '',
      prompt: '',
      image_url: '',
      min_words: 150,
      questions: []
    };
    this.sections.push(newSection);
    this._refreshSections();
    showToast('Bo\'lim qo\'shildi', 'success');
  },

  // Bo'lim o'chirish
  removeSection(idx) {
    this.sections.splice(idx, 1);
    this._refreshSections();
    showToast('Bo\'lim o\'chirildi', 'info');
  },

  // Sahifani yangilash
  _refreshSections() {
    var container = document.getElementById('sections-container');
    if (!container) return;
    if (this.sections.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-layer-group"></i><h3>Hali bo\'lim yo\'q</h3><p>Yuqoridagi tugmani bosing</p></div>';
      return;
    }
    var html = '';
    for (var i = 0; i < this.sections.length; i++) {
      html += this._renderSectionCard(i);
    }
    container.innerHTML = html;
  },

  // Bo'lim kartasi
  _renderSectionCard(idx) {
    var s = this.sections[idx];
    var type = this.testType;

    // Matn maydoni turiga qarab
    var contentField = '';
    if (type === 'reading') {
      contentField = '<div class="form-group"><label class="form-label">Matn (Passage) — HTML qo\'llab-quvvatlanadi</label><textarea class="form-textarea" style="min-height:200px;" onchange="AdminBuilder.updateSection(' + idx + ', \'passage\', this.value)" placeholder="<p>Bu yerga matnni yozing...</p>">' + (s.passage || '') + '</textarea></div>';
    } else if (type === 'listening') {
      contentField = '<div class="form-group"><label class="form-label">Audio matni (tinglab o\'qiladi)</label><textarea class="form-textarea" style="min-height:150px;" onchange="AdminBuilder.updateSection(' + idx + ', \'audio_text\', this.value)" placeholder="Dialogue yoki monolog matnini shu yerga yozing...">' + (s.audio_text || '') + '</textarea></div>';
    } else {
      contentField = '<div class="form-group"><label class="form-label">Topshiriq matni (Prompt)</label><textarea class="form-textarea" style="min-height:150px;" onchange="AdminBuilder.updateSection(' + idx + ', \'prompt\', this.value)" placeholder="Writing topshiriq matni...">' + (s.prompt || '') + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Rasm URL (ixtiyoriy)</label><input type="text" class="form-input" value="' + (s.image_url || '') + '" onchange="AdminBuilder.updateSection(' + idx + ', \'image_url\', this.value)" placeholder="https://..."></div>' +
        '<div class="form-group"><label class="form-label">Minimum so\'z soni</label><input type="number" class="form-input" value="' + (s.min_words || 150) + '" onchange="AdminBuilder.updateSection(' + idx + ', \'min_words\', parseInt(this.value))" min="50" max="500"></div>';
    }

    // Savollar ro'yxati (writing bundan mustasno)
    var questionsHTML = '';
    if (type !== 'writing') {
      var qs = s.questions || [];
      for (var q = 0; q < qs.length; q++) {
        questionsHTML += this._renderQuestionCard(idx, q);
      }
      questionsHTML += '<button class="btn btn-outline btn-sm mt-4" onclick="AdminBuilder.addQuestion(' + idx + ')"><i class="fa-solid fa-plus"></i> Savol qo\'shish</button>';
    } else {
      questionsHTML = '<p class="text-muted" style="font-style:italic;">Writing testlarida savollar yo\'q, faqat matn yoziladi.</p>';
    }

    return '<div class="card card-body mb-4" style="border-left:4px solid var(--primary);">' +
      '<div class="flex justify-between items-center mb-4">' +
        '<h3 style="color:var(--primary);">Bo\'lim ' + (idx + 1) + '</h3>' +
        '<button class="btn btn-danger btn-sm" onclick="AdminBuilder.removeSection(' + idx + ')"><i class="fa-solid fa-trash"></i></button>' +
      '</div>' +
      '<div class="form-group"><label class="form-label">Bo\'lim nomi</label><input type="text" class="form-input" value="' + (s.title || '') + '" onchange="AdminBuilder.updateSection(' + idx + ', \'title\', this.value)"></div>' +
      contentField +
      '<div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);">' +
        '<h4 style="margin-bottom:12px;"><i class="fa-solid fa-circle-question" style="color:var(--accent);margin-right:8px;"></i>Savollar (' + (s.questions ? s.questions.length : 0) + ')</h4>' +
        questionsHTML +
      '</div>' +
    '</div>';
  },

  // Section maydonini yangilash
  updateSection(idx, field, value) {
    if (this.sections[idx]) {
      this.sections[idx][field] = value;
    }
  },

  // Savol qo'shish
  addQuestion(sectionIdx) {
    var qs = this.sections[sectionIdx].questions;
    var nextId = 1;
    for (var i = 0; i < qs.length; i++) {
      if (qs[i].id >= nextId) nextId = qs[i].id + 1;
    }
    qs.push({
      id: nextId,
      type: 'mcq',
      text: '',
      options: ['A) ', 'B) ', 'C) ', 'D) '],
      correct_answer: 'A'
    });
    this._refreshSections();
    showToast('Savol qo\'shildi', 'success');
  },

  // Savol o'chirish
  removeQuestion(sIdx, qIdx) {
    this.sections[sIdx].questions.splice(qIdx, 1);
    this._refreshSections();
  },

  // Savol kartasi
  _renderQuestionCard(sIdx, qIdx) {
    var q = this.sections[sIdx].questions[qIdx];
    var qTypes = '<option value="mcq"' + (q.type==='mcq'?' selected':'') + '>Ko\'p tanlov (MCQ)</option>' +
      '<option value="tfng"' + (q.type==='tfng'?' selected':'') + '>True / False / Not Given</option>' +
      '<option value="ynng"' + (q.type==='ynng'?' selected':'') + '>Yes / No / Not Given</option>' +
      '<option value="fill"' + (q.type==='fill'?' selected':'') + '>To\'ldirish (Fill-in)</option>';

    var optionsHTML = '';
    if (q.type === 'mcq') {
      optionsHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
      for (var o = 0; o < q.options.length; o++) {
        optionsHTML += '<input type="text" class="form-input" value="' + (q.options[o] || '') + '" onchange="AdminBuilder.updateOption(' + sIdx + ',' + qIdx + ',' + o + ',this.value)" placeholder="A) Javob varianti" style="font-size:13px;padding:8px 12px;">';
      }
      optionsHTML += '</div>';
    } else if (q.type === 'tfng') {
      optionsHTML = '<select class="form-select" style="max-width:200px;margin-top:8px;" onchange="AdminBuilder.updateQuestion(' + sIdx + ',' + qIdx + ',\'correct_answer\',this.value)">' +
        '<option value="True"' + (q.correct_answer==='True'?' selected':'') + '>True</option>' +
        '<option value="False"' + (q.correct_answer==='False'?' selected':'') + '>False</option>' +
        '<option value="Not Given"' + (q.correct_answer==='Not Given'?' selected':'') + '>Not Given</option></select>';
    } else if (q.type === 'ynng') {
      optionsHTML = '<select class="form-select" style="max-width:200px;margin-top:8px;" onchange="AdminBuilder.updateQuestion(' + sIdx + ',' + qIdx + ',\'correct_answer\',this.value)">' +
        '<option value="Yes"' + (q.correct_answer==='Yes'?' selected':'') + '>Yes</option>' +
        '<option value="No"' + (q.correct_answer==='No'?' selected':'') + '>No</option>' +
        '<option value="Not Given"' + (q.correct_answer==='Not Given'?' selected':'') + '>Not Given</option></select>';
    } else {
      optionsHTML = '<input type="text" class="form-input" style="max-width:300px;margin-top:8px;" value="' + (q.correct_answer || '') + '" onchange="AdminBuilder.updateQuestion(' + sIdx + ',' + qIdx + ',\'correct_answer\',this.value)" placeholder="To\'g\'ri javob">';
    }

    return '<div style="background:var(--bg);border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid var(--border);">' +
      '<div class="flex justify-between items-center mb-2">' +
        '<span class="badge badge-accent">Savol ' + q.id + '</span>' +
        '<button class="btn btn-ghost btn-sm" style="color:var(--danger);padding:4px 8px;" onclick="AdminBuilder.removeQuestion(' + sIdx + ',' + qIdx + ')"><i class="fa-solid fa-trash"></i></button>' +
      '</div>' +
      '<div class="form-group" style="margin-bottom:8px;"><label class="form-label" style="font-size:12px;">Savol turi</label><select class="form-select" style="font-size:13px;padding:8px;" onchange="AdminBuilder.changeQuestionType(' + sIdx + ',' + qIdx + ',this.value)">' + qTypes + '</select></div>' +
      '<div class="form-group" style="margin-bottom:8px;"><label class="form-label" style="font-size:12px;">Savol matni</label><input type="text" class="form-input" value="' + (q.text || '').replace(/"/g, '&quot;') + '" onchange="AdminBuilder.updateQuestion(' + sIdx + ',' + qIdx + ',\'text\',this.value)" placeholder="Savolni yozing..."></div>' +
      '<div class="form-group"><label class="form-label" style="font-size:12px;">To\'g\'ri javob</label>' + optionsHTML + '</div>' +
    '</div>';
  },

  // Savol turini o'zgartirish
  changeQuestionType(sIdx, qIdx, newType) {
    var q = this.sections[sIdx].questions[qIdx];
    q.type = newType;
    if (newType === 'mcq') {
      if (!q.options || q.options.length < 4) {
        q.options = ['A) ', 'B) ', 'C) ', 'D) '];
      }
      q.correct_answer = 'A';
    } else if (newType === 'tfng') {
      q.correct_answer = 'True';
      delete q.options;
    } else if (newType === 'ynng') {
      q.correct_answer = 'Yes';
      delete q.options;
    } else {
      q.correct_answer = '';
      delete q.options;
    }
    this._refreshSections();
  },

  // Savol maydonini yangilash
  updateQuestion(sIdx, qIdx, field, value) {
    this.sections[sIdx].questions[qIdx][field] = value;
  },

  // Option ni yangilash
  updateOption(sIdx, qIdx, oIdx, value) {
    this.sections[sIdx].questions[qIdx].options[oIdx] = value;
  },

  // TESTNI SAQLASH
  async saveTest() {
    var title = document.getElementById('bt-title').value.trim();
    var type = document.getElementById('bt-type').value;
    var timeLimit = parseInt(document.getElementById('bt-time').value) || 60;
    var desc = document.getElementById('bt-desc').value.trim();

    if (!title) {
      showToast('Test nomini kiriting!', 'error');
      return;
    }

    // Savol ID larini tekshirish va tartiblash
    for (var s = 0; s < this.sections.length; s++) {
      var section = this.sections[s];
      if (type === 'reading' && !section.passage) {
        showToast('Bo\'lim ' + (s+1) + ' uchun matn kiriting!', 'error');
        return;
      }
      if (type === 'listening' && !section.audio_text) {
        showToast('Bo\'lim ' + (s+1) + ' uchun audio matn kiriting!', 'error');
        return;
      }
      if (type === 'writing' && !section.prompt) {
        showToast('Bo\'lim ' + (s+1) + ' uchun topshiriq matni kiriting!', 'error');
        return;
      }

      // Savollarni tekshirish
      var qs = section.questions || [];
      for (var q = 0; q < qs.length; q++) {
        if (!qs[q].text || !qs[q].text.trim()) {
          showToast('Bo\'lim ' + (s+1) + ', savol ' + qs[q].id + ' matni yo\'q!', 'error');
          return;
        }
        if (qs[q].type === 'mcq') {
          if (!qs[q].correct_answer || !qs[q].correct_answer.trim()) {
            showToast('Bo\'lim ' + (s+1) + ', savol ' + qs[q].id + ' uchun to\'g\'ri javob tanlang!', 'error');
            return;
          }
        }
      }
    }

    var testData = {
      id: this.testId || generateId(type.charAt(0)),
      type: type,
      title: title,
      description: desc,
      time_limit: timeLimit,
      sections: this.sections,
      created_at: this.testId ? undefined : new Date().toISOString()
    };

    try {
      if (this.testId) {
        // Tahrirlash
        await DB.update('tests', this.testId, testData);
        showToast('Test muvaffaqiyatli yangilandi!', 'success');
      } else {
        // Yangi test
        await DB.insert('tests', testData);
        showToast('Test muvaffaqiyatli qo\'shildi!', 'success');
      }
      App.navigate('admin/tests');
    } catch (err) {
      console.error('Saqlash xatosi:', err);
      showToast('Saqlashda xatolik: ' + err.message, 'error');
    }
  }
};
