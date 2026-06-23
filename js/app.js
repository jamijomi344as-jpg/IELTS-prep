/* ============================================================
   ASOSIY ILOVA MODULI
   Routing, sahifa boshqaruvi, global event handlerlar
   ============================================================ */

const App = {
  currentRoute: '',

  // Ilovani ishga tushirish
  async init() {
    // Ma'lumotlar bazasini boshlash
    await initDB();

    // Browser back/forward tugmalari uchun
    window.addEventListener('popstate', () => {
      this._handleRoute();
    });

    // Birinchi sahifani yuklash
    this._handleRoute();

    console.log('IELTS Prep muvaffaqiyatli ishga tushdi');
  },

  // Navigatsiya — hash based routing
  navigate(path) {
    window.location.hash = path;
  },

  // Routeni aniqlash va tegishli sahifani render qilish
  async _handleRoute() {
    var hash = window.location.hash.slice(1);
    var parts = hash.split('/').filter(Boolean);
    var route = parts[0] || '';
    this.currentRoute = route;

    var user = Auth.getCurrentUser();
    var app = document.getElementById('app');

    // Loading ko'rsatish
    app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;">' +
      '<div style="text-align:center;">' +
      '<i class="fa-solid fa-spinner fa-spin" style="font-size:40px;color:var(--primary);margin-bottom:16px;display:block;"></i>' +
      '<p class="text-muted">Yuklanmoqda...</p>' +
      '</div></div>';

    try {

      // ===== Bosh sahifa (landing) =====
      if (route === '') {
        if (user && user.isAdmin) {
          app.innerHTML = await Pages.adminDashboard(user);
        } else if (user) {
          app.innerHTML = await Pages.dashboard(user);
        } else {
          app.innerHTML = Pages.landing();
        }
      }

      // ===== Login =====
      else if (route === 'login') {
        app.innerHTML = Pages.login();
      }

      // ===== Register =====
      else if (route === 'register') {
        app.innerHTML = Pages.register();
      }

      // ===== Dashboard =====
      else if (route === 'dashboard') {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.dashboard(user);
      }

      // ===== Test turi bo'yicha ro'yxat (tests/reading, tests/listening, tests/writing) =====
      else if (route === 'tests' && parts[1]) {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.testList(user, parts[1]);
      }

      // ===== Test rejim tanlash (test/r001) =====
      else if (route === 'test' && parts[1] && !parts[2]) {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.modeSelection(user, parts[1]);
      }

      // ===== Testni boshlash (take/r001/exam yoki take/r001/exercise) =====
      else if (route === 'take' && parts[1] && parts[2]) {
        if (!user) { this.navigate('login'); return; }
        TestEngine.start(parts[1], parts[2]);
        return;
      }

      // ===== Natijalar (results/res_xxx) =====
      else if (route === 'results' && parts[1]) {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await this._renderResults(parts[1], user);
      }

      // ===== Mening natijalarim =====
      else if (route === 'my-results') {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.myResults(user);
      }

      // ===== Admin dashboard =====
      else if (route === 'admin' && !parts[1]) {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminDashboard(user);
      }

      // ===== Admin testlar =====
      else if (route === 'admin' && parts[1] === 'tests') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminTests(user);
      }

      // ===== Admin o'quvchilar =====
      else if (route === 'admin' && parts[1] === 'students') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminStudents(user);
      }

      // ===== Admin natijalar =====
      else if (route === 'admin' && parts[1] === 'results') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminResults(user);
      }

      // ===== 404 =====
      else {
        app.innerHTML = this._render404();
      }

    } catch (err) {
      console.error('Sahifa render xatosi:', err);
      app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;">' +
        '<div class="card card-body text-center" style="max-width:400px;">' +
        '<i class="fa-solid fa-bug" style="font-size:48px;color:var(--danger);margin-bottom:16px;display:block;"></i>' +
        '<h2>Xatolik yuz berdi</h2>' +
        '<p class="text-muted" style="margin-top:8px;">Sahifani yuklashda xatolik ro\'y berdi. Qaytadan urinib ko\'ring.</p>' +
        '<button class="btn btn-primary" style="margin-top:16px;" onclick="App.navigate(\'\')">' +
        '<i class="fa-solid fa-home"></i> Bosh sahifaga</button>' +
        '</div></div>';
    }

    window.scrollTo(0, 0);
  },

  // ==================== NATIJA SAHIFASI ====================
  async _renderResults(resultId, user) {
    var allResults = await DB.findResultsByStudent(user.id);
    var result = null;
    for (var i = 0; i < allResults.length; i++) {
      if (allResults[i].id === resultId) {
        result = allResults[i];
        break;
      }
    }

    if (!result) {
      return renderNavbar(user) +
        '<div class="container" style="padding:80px 24px;text-align:center;">' +
        '<i class="fa-solid fa-circle-xmark" style="font-size:48px;color:var(--danger);margin-bottom:16px;display:block;"></i>' +
        '<h2>Natija topilmadi</h2>' +
        '<p class="text-muted" style="margin-top:8px;">Bu natija mavjud emas yoki o\'chirilgan</p>' +
        '<button class="btn btn-primary" style="margin-top:16px;" onclick="App.navigate(\'dashboard\')">Dashboard ga qaytish</button>' +
        '</div>';
    }

    var isWriting = result.test_type === 'writing';
    var bandDesc = BandScore.getBandDescription(result.band_score);

    // Javob tahlili
    var reviewHTML = '';
    if (isWriting) {
      var answers = result.answers || [];
      for (var w = 0; w < answers.length; w++) {
        var a = answers[w];
        var wStatusClass = a.meets_requirement ? 'badge-success' : 'badge-danger';
        var wIcon = a.meets_requirement ? 'fa-check' : 'fa-xmark';
        var wText = a.meets_requirement ? 'So\'z talabi bajarildi' : 'So\'z talabi bajarilmadi';
        var wContent = a.text || '<span class="text-muted">Yozilgan matn yo\'q</span>';

        reviewHTML += '<div class="card card-body" style="margin-bottom:16px;">' +
          '<h3 style="margin-bottom:12px;">' + a.section_title + '</h3>' +
          '<div class="flex gap-4" style="margin-bottom:16px;">' +
          '<span class="badge ' + wStatusClass + '"><i class="fa-solid ' + wIcon + '"></i> ' + wText + '</span>' +
          '<span class="badge badge-info">' + a.word_count + ' / ' + a.min_words + ' so\'z</span>' +
          '</div>' +
          '<div class="task-prompt">' + wContent + '</div>' +
          '<div class="auth-info" style="margin-top:16px;">' +
          '<i class="fa-solid fa-hourglass-half"></i> Writing javobingiz admin tomonidan ko\'rib chiqiladi va band score belgilanadi.' +
          '</div></div>';
      }
    } else {
      var rAnswers = result.answers || [];
      for (var r = 0; r < rAnswers.length; r++) {
        var ra = rAnswers[r];
        var statusClass = 'unanswered';
        if (ra.is_correct) {
          statusClass = 'correct';
        } else if (ra.user_answer && String(ra.user_answer).trim() !== '') {
          statusClass = 'incorrect';
        }

        var userAnsDisplay = (ra.user_answer && String(ra.user_answer).trim() !== '') ? ra.user_answer : '—';
        var valClass = '';
        if (statusClass === 'correct') valClass = 'correct';
        else if (statusClass === 'incorrect') valClass = 'incorrect';

        reviewHTML += '<div class="review-item ' + statusClass + '">' +
          '<div class="review-q">' +
          '<div class="review-q-num">' + ra.question_id + '</div>' +
          '<div><div style="font-weight:600;margin-bottom:4px;">' + ra.text + '</div>' +
          '<span class="badge badge-info" style="font-size:11px;">' + ra.type.toUpperCase() + '</span></div>' +
          '</div>' +
          '<div class="review-answers">' +
          '<div class="review-answer-item"><span class="label">Sizning javobingiz:</span>' +
          '<span class="value ' + valClass + '">' + userAnsDisplay + '</span></div>' +
          '<div class="review-answer-item"><span class="label">To\'g\'ri javob:</span>' +
          '<span class="value correct">' + ra.correct_answer + '</span></div>' +
          '</div></div>';
      }
    }

    var pct = result.total_questions > 0 ? Math.round((result.score / result.total_questions) * 100) : 0;
    var modeText = result.mode === 'exam' ? 'Imtihon rejimi' : 'Mashg\'ulot rejimi';
    var typeName = getTypeName(result.test_type);

    var scoreDetailHTML = '';
    if (!isWriting) {
      scoreDetailHTML = '<div style="margin-top:20px;display:flex;justify-content:center;gap:32px;">' +
        '<div><div style="font-size:24px;font-weight:800;">' + result.score + '/' + result.total_questions + '</div>' +
        '<div style="font-size:13px;opacity:0.7;">To\'g\'ri javoblar</div></div>' +
        '<div><div style="font-size:24px;font-weight:800;">' + pct + '%</div>' +
        '<div style="font-size:13px;opacity:0.7;">Foiz</div></div></div>';
    }

    var html = renderNavbar(user);
    html += '<div class="container results-container">';

    // Score card
    html += '<div class="result-score-card">' +
      '<div class="score-label">' + typeName + ' — ' + modeText + '</div>' +
      '<div class="band-score">' + result.band_score + '</div>' +
      '<div class="score-detail">' + result.test_title + '</div>' +
      '<div style="margin-top:16px;opacity:0.8;font-size:15px;">' + bandDesc + '</div>' +
      scoreDetailHTML +
      '<div style="margin-top:12px;font-size:13px;opacity:0.6;">' + formatDate(result.submitted_at) + '</div>' +
      '</div>';

    // Actions
    html += '<div class="result-actions">' +
      '<button class="btn btn-primary" onclick="App.navigate(\'tests/' + result.test_type + '\')">' +
      '<i class="fa-solid fa-arrow-rotate-right"></i> Qayta ishlash</button>' +
      '<button class="btn btn-outline" onclick="App.navigate(\'my-results\')">' +
      '<i class="fa-solid fa-list"></i> Barcha natijalar</button>' +
      '<button class="btn btn-ghost" onclick="App.navigate(\'dashboard\')">' +
      '<i class="fa-solid fa-home"></i> Dashboard</button>' +
      '</div>';

    // Review
    html += '<h2 style="font-size:22px;margin-bottom:20px;">' +
      '<i class="fa-solid fa-magnifying-glass" style="color:var(--primary);margin-right:8px;"></i>' +
      'Javob tahlili</h2>' +
      '<div class="answer-review">' + reviewHTML + '</div>';

    // Bottom
    html += '<div style="text-align:center;padding:40px 0;">' +
      '<button class="btn btn-primary btn-lg" onclick="App.navigate(\'tests/' + result.test_type + '\')">' +
      '<i class="fa-solid fa-arrow-rotate-right"></i> Yana test ishlash</button></div>';

    html += '</div>';
    return html;
  },

  // ==================== 404 SAHIFA ====================
  _render404() {
    return renderNavbar(null) +
      '<div style="display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 70px);padding:40px;">' +
      '<div class="text-center">' +
      '<div style="font-size:120px;font-weight:900;color:var(--primary);line-height:1;">404</div>' +
      '<h2 style="font-size:24px;margin-bottom:8px;">Sahifa topilmadi</h2>' +
      '<p class="text-muted" style="margin-bottom:24px;">Siz qidirayotgan sahifa mavjud emas</p>' +
      '<button class="btn btn-primary btn-lg" onclick="App.navigate(\'\')">' +
      '<i class="fa-solid fa-home"></i> Bosh sahifaga</button>' +
      '</div></div>';
  }
};


/* ============================================================
   GLOBAL EVENT HANDLERLAR
   ============================================================ */

// Auth tab switch
function switchAuthTab(el, role) {
  var tabs = document.querySelectorAll('.auth-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }
  el.classList.add('active');
  document.getElementById('login-role').value = role;
}

// Login form submit
async function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('login-email').value;
  var password = document.getElementById('login-password').value;
  var role = document.getElementById('login-role').value;

  var result = await Auth.login(email, password, role === 'admin');

  if (result.success) {
    showToast(result.message, 'success');
    var user = Auth.getCurrentUser();
    if (user && user.isAdmin) {
      App.navigate('admin');
    } else {
      App.navigate('dashboard');
    }
  } else {
    showToast(result.message, 'error');
  }
}

// Register form submit
async function handleRegister(e) {
  e.preventDefault();
  var name = document.getElementById('reg-name').value;
  var email = document.getElementById('reg-email').value;
  var password = document.getElementById('reg-password').value;
  var password2 = document.getElementById('reg-password2').value;

  if (password !== password2) {
    showToast('Parollar mos kelmadi', 'error');
    return;
  }

  var result = await Auth.register(name, email, password);

  if (result.success) {
    showToast(result.message, 'success');
    App.navigate('dashboard');
  } else {
    showToast(result.message, 'error');
  }
}

// Admin: test o'chirish
async function deleteTest(testId) {
  var body = '<p>Haqiqatan ham bu testni o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi.</p>';
  var footer = '<button class="btn btn-ghost" onclick="closeModal()">Bekor qilish</button>' +
    '<button class="btn btn-danger" onclick="confirmDeleteTest(\'' + testId + '\')">Ha, o\'chirish</button>';
  showModal('Testni o\'chirish', body, footer);
}

async function confirmDeleteTest(testId) {
  await DB.remove('tests', testId);
  closeModal();
  showToast('Test muvaffaqiyatli o\'chirildi', 'success');
  App.navigate('admin/tests');
}

// Admin: yangi test qo'shish modal i
function showAddTestModal() {
  var body = '<p class="text-muted" style="margin-bottom:16px;">Yangi test qo\'shish uchun formani to\'ldiring.</p>' +
    '<div class="form-group"><label class="form-label">Test nomi</label>' +
    '<input type="text" class="form-input" id="new-test-title" placeholder="Masalan: Reading Test 2"></div>' +
    '<div class="form-group"><label class="form-label">Turi</label>' +
    '<select class="form-select" id="new-test-type">' +
    '<option value="reading">Reading</option>' +
    '<option value="listening">Listening</option>' +
    '<option value="writing">Writing</option></select></div>' +
    '<div class="form-group"><label class="form-label">Tavsif</label>' +
    '<textarea class="form-textarea" id="new-test-desc" placeholder="Test haqida qisqacha..." style="min-height:80px;"></textarea></div>' +
    '<div class="form-group"><label class="form-label">Vaqt (daqiqa)</label>' +
    '<input type="number" class="form-input" id="new-test-time" value="60" min="5" max="300"></div>' +
    '<div class="auth-info"><i class="fa-solid fa-info-circle"></i> Bo\'limlar va savollar keyin qo\'shiladi.</div>';

  var footer = '<button class="btn btn-ghost" onclick="closeModal()">Bekor qilish</button>' +
    '<button class="btn btn-primary" onclick="addNewTest()">Qo\'shish</button>';

  showModal('Yangi test qo\'shish', body, footer);
}

async function addNewTest() {
  var title = document.getElementById('new-test-title').value.trim();
  var type = document.getElementById('new-test-type').value;
  var description = document.getElementById('new-test-desc').value.trim();
  var timeLimit = parseInt(document.getElementById('new-test-time').value) || 60;

  if (!title) {
    showToast('Test nomini kiriting', 'error');
    return;
  }

  var newTest = {
    id: generateId(type.charAt(0)),
    type: type,
    title: title,
    description: description,
    time_limit: timeLimit,
    sections: [],
    created_at: new Date().toISOString()
  };

  await DB.insert('tests', newTest);
  closeModal();
  showToast('Test muvaffaqiyatli qo\'shildi', 'success');
  App.navigate('admin/tests');
}


/* ============================================================
   ILOVANI ISHGA TUSHIRISH
   ============================================================ */
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Loading ni yashirish, app ni ko'rsatish
    var loader = document.getElementById('initial-loader');
    var appEl = document.getElementById('app');
    if (loader) loader.style.display = 'none';
    if (appEl) appEl.style.display = 'block';

    await App.init();
  } catch (err) {
    console.error('Ilova ishga tushish xatosi:', err);
    var loader2 = document.getElementById('initial-loader');
    var appEl2 = document.getElementById('app');
    if (loader2) loader2.style.display = 'none';
    if (appEl2) {
      appEl2.style.display = 'block';
      appEl2.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px;">' +
        '<div style="text-align:center;max-width:500px;">' +
        '<i class="fa-solid fa-bug" style="font-size:48px;color:#DC2626;margin-bottom:16px;display:block;"></i>' +
        '<h2 style="margin-bottom:8px;">Ilova xatosi</h2>' +
        '<p style="color:#6B7280;margin-bottom:8px;">' + err.message + '</p>' +
        '<button class="btn btn-primary" onclick="location.reload()" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:8px;background:#0D7377;color:#fff;border:none;font-weight:600;cursor:pointer;font-size:15px;">' +
        '<i class="fa-solid fa-rotate-right"></i> Qayta yuklash</button>' +
        '</div></div>';
    }
  }
});
