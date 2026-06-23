/* ============================================================
   ASOSIY ILOVA MODULI
   ============================================================ */

const App = {
  currentRoute: '',

  async init() {
    await initDB();

    window.addEventListener('popstate', () => { this._handleRoute(); });
    window.addEventListener('hashchange', () => { this._handleRoute(); });

    this._handleRoute();
    console.log('IELTS Prep ishga tushdi');
  },

  navigate(path) {
    if (window.location.hash === '#' + path) {
      this._handleRoute();
    } else {
      window.location.hash = path;
    }
  },

  async _handleRoute() {
    var hash = window.location.hash.slice(1);
    var parts = hash.split('/').filter(Boolean);
    var route = parts[0] || '';
    this.currentRoute = route;
    var user = Auth.getCurrentUser();
    var app = document.getElementById('app');

    app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;"><div style="text-align:center;"><i class="fa-solid fa-spinner fa-spin" style="font-size:40px;color:var(--primary);margin-bottom:16px;display:block;"></i><p class="text-muted">Yuklanmoqda...</p></div></div>';

    try {
      if (route === '') {
        if (user && user.isAdmin) app.innerHTML = await Pages.adminDashboard(user);
        else if (user) app.innerHTML = await Pages.dashboard(user);
        else app.innerHTML = Pages.landing();
      }
      else if (route === 'login') { app.innerHTML = Pages.login(); }
      else if (route === 'register') { app.innerHTML = Pages.register(); }
      else if (route === 'dashboard') {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.dashboard(user);
      }
      else if (route === 'tests' && parts[1]) {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.testList(user, parts[1]);
      }
      else if (route === 'test' && parts[1] && !parts[2]) {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.modeSelection(user, parts[1]);
      }
      else if (route === 'take' && parts[1] && parts[2]) {
        if (!user) { this.navigate('login'); return; }
        TestEngine.start(parts[1], parts[2]);
        return;
      }
      else if (route === 'results' && parts[1]) {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await this._renderResults(parts[1], user);
      }
      else if (route === 'my-results') {
        if (!user) { this.navigate('login'); return; }
        app.innerHTML = await Pages.myResults(user);
      }
      else if (route === 'admin' && !parts[1]) {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminDashboard(user);
      }
      else if (route === 'admin' && parts[1] === 'tests') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminTests(user);
      }
      // YANGI: Test qo'shish sahifasi
      else if (route === 'admin' && parts[1] === 'add-test') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = AdminBuilder.renderPage(user);
      }
      // YANGI: Mavjud testni tahrirlash
      else if (route === 'admin' && parts[1] === 'edit-test' && parts[2]) {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await AdminBuilder.renderEditPage(user, parts[2]);
      }
      else if (route === 'admin' && parts[1] === 'students') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminStudents(user);
      }
      else if (route === 'admin' && parts[1] === 'results') {
        if (!user || !user.isAdmin) { this.navigate('login'); return; }
        app.innerHTML = await Pages.adminResults(user);
      }
      else {
        app.innerHTML = this._render404();
      }
    } catch (err) {
      console.error('Sahifa render xatosi:', err);
      app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;"><div class="card card-body text-center" style="max-width:400px;"><i class="fa-solid fa-bug" style="font-size:48px;color:var(--danger);margin-bottom:16px;display:block;"></i><h2>Xatolik yuz berdi</h2><p class="text-muted" style="margin-top:8px;">' + err.message + '</p><button class="btn btn-primary" style="margin-top:16px;" onclick="App.navigate(\'\')"><i class="fa-solid fa-home"></i> Bosh sahifaga</button></div></div>';
    }
    window.scrollTo(0, 0);
  },

  async _renderResults(resultId, user) {
    var allResults = await DB.findResultsByStudent(user.id);
    var result = null;
    for (var i = 0; i < allResults.length; i++) {
      if (allResults[i].id === resultId) { result = allResults[i]; break; }
    }
    if (!result) {
      return renderNavbar(user) + '<div class="container" style="padding:80px 24px;text-align:center;"><i class="fa-solid fa-circle-xmark" style="font-size:48px;color:var(--danger);margin-bottom:16px;display:block;"></i><h2>Natija topilmadi</h2><button class="btn btn-primary" style="margin-top:16px;" onclick="App.navigate(\'dashboard\')">Qaytish</button></div>';
    }
    var isWriting = result.test_type === 'writing';
    var bandDesc = BandScore.getBandDescription(result.band_score);
    var reviewHTML = '';
    if (isWriting) {
      var answers = result.answers || [];
      for (var w = 0; w < answers.length; w++) {
        var a = answers[w];
        reviewHTML += '<div class="card card-body" style="margin-bottom:16px;"><h3 style="margin-bottom:12px;">' + a.section_title + '</h3><div class="flex gap-4" style="margin-bottom:16px;"><span class="badge ' + (a.meets_requirement ? 'badge-success' : 'badge-danger') + '"><i class="fa-solid ' + (a.meets_requirement ? 'fa-check' : 'fa-xmark') + '"></i> ' + (a.meets_requirement ? 'So\'z talabi bajarildi' : 'So\'z talabi bajarilmadi') + '</span><span class="badge badge-info">' + a.word_count + ' / ' + a.min_words + ' so\'z</span></div><div class="task-prompt">' + (a.text || '<span class="text-muted">Matn yo\'q</span>') + '</div></div>';
      }
    } else {
      var rAnswers = result.answers || [];
      for (var r = 0; r < rAnswers.length; r++) {
        var ra = rAnswers[r];
        var sc = ra.is_correct ? 'correct' : (ra.user_answer && String(ra.user_answer).trim() !== '' ? 'incorrect' : 'unanswered');
        var ua = (ra.user_answer && String(ra.user_answer).trim() !== '') ? ra.user_answer : '—';
        var vc = sc === 'correct' ? 'correct' : (sc === 'incorrect' ? 'incorrect' : '');
        reviewHTML += '<div class="review-item ' + sc + '"><div class="review-q"><div class="review-q-num">' + ra.question_id + '</div><div><div style="font-weight:600;margin-bottom:4px;">' + ra.text + '</div><span class="badge badge-info" style="font-size:11px;">' + ra.type.toUpperCase() + '</span></div></div><div class="review-answers"><div class="review-answer-item"><span class="label">Sizning javob:</span><span class="value ' + vc + '">' + ua + '</span></div><div class="review-answer-item"><span class="label">To\'g\'ri javob:</span><span class="value correct">' + ra.correct_answer + '</span></div></div></div>';
      }
    }
    var pct = result.total_questions > 0 ? Math.round((result.score / result.total_questions) * 100) : 0;
    var sdHTML = '';
    if (!isWriting) sdHTML = '<div style="margin-top:20px;display:flex;justify-content:center;gap:32px;"><div><div style="font-size:24px;font-weight:800;">' + result.score + '/' + result.total_questions + '</div><div style="font-size:13px;opacity:0.7;">To\'g\'ri</div></div><div><div style="font-size:24px;font-weight:800;">' + pct + '%</div><div style="font-size:13px;opacity:0.7;">Foiz</div></div></div>';
    return renderNavbar(user) + '<div class="container results-container"><div class="result-score-card"><div class="score-label">' + getTypeName(result.test_type) + ' — ' + (result.mode === 'exam' ? 'Imtihon' : 'Mashg\'ulot') + '</div><div class="band-score">' + result.band_score + '</div><div class="score-detail">' + result.test_title + '</div><div style="margin-top:16px;opacity:0.8;font-size:15px;">' + bandDesc + '</div>' + sdHTML + '<div style="margin-top:12px;font-size:13px;opacity:0.6;">' + formatDate(result.submitted_at) + '</div></div><div class="result-actions"><button class="btn btn-primary" onclick="App.navigate(\'tests/' + result.test_type + '\')"><i class="fa-solid fa-arrow-rotate-right"></i> Qayta ishlash</button><button class="btn btn-outline" onclick="App.navigate(\'my-results\')"><i class="fa-solid fa-list"></i> Natijalar</button></div><h2 style="font-size:22px;margin-bottom:20px;"><i class="fa-solid fa-magnifying-glass" style="color:var(--primary);margin-right:8px;"></i>Javob tahlili</h2><div class="answer-review">' + reviewHTML + '</div></div>';
  },

  _render404() {
    return renderNavbar(null) + '<div style="display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 70px);padding:40px;"><div class="text-center"><div style="font-size:120px;font-weight:900;color:var(--primary);line-height:1;">404</div><h2 style="font-size:24px;margin-bottom:8px;">Sahifa topilmadi</h2><button class="btn btn-primary btn-lg" style="margin-top:16px;" onclick="App.navigate(\'\')"><i class="fa-solid fa-home"></i> Bosh sahifa</button></div></div>';
  }
};

/* GLOBAL HANDLERS */
function switchAuthTab(el, role) {
  var tabs = document.querySelectorAll('.auth-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  el.classList.add('active');
  document.getElementById('login-role').value = role;
}
async function handleLogin(e) {
  e.preventDefault();
  var r = await Auth.login(document.getElementById('login-email').value, document.getElementById('login-password').value, document.getElementById('login-role').value === 'admin');
  if (r.success) { showToast(r.message, 'success'); var u = Auth.getCurrentUser(); App.navigate(u && u.isAdmin ? 'admin' : 'dashboard'); }
  else showToast(r.message, 'error');
}
async function handleRegister(e) {
  e.preventDefault();
  if (document.getElementById('reg-password').value !== document.getElementById('reg-password2').value) { showToast('Parollar mos kelmadi', 'error'); return; }
  var r = await Auth.register(document.getElementById('reg-name').value, document.getElementById('reg-email').value, document.getElementById('reg-password').value);
  if (r.success) { showToast(r.message, 'success'); App.navigate('dashboard'); } else showToast(r.message, 'error');
}
async function deleteTest(testId) {
  showModal('Testni o\'chirish', '<p>Haqiqatan ham o\'chirmoqchimisiz?</p>', '<button class="btn btn-ghost" onclick="closeModal()">Bekor</button><button class="btn btn-danger" onclick="confirmDeleteTest(\'' + testId + '\')">O\'chirish</button>');
}
async function confirmDeleteTest(testId) {
  await DB.remove('tests', testId);
  closeModal(); showToast('O\'chirildi', 'success'); App.navigate('admin/tests');
}

/* ISHGA TUSHIRISH */
document.addEventListener('DOMContentLoaded', async function() {
  try {
    var loader = document.getElementById('initial-loader');
    var appEl = document.getElementById('app');
    if (loader) loader.style.display = 'none';
    if (appEl) appEl.style.display = 'block';
    await App.init();
  } catch (err) {
    console.error('Xato:', err);
    var l2 = document.getElementById('initial-loader');
    var a2 = document.getElementById('app');
    if (l2) l2.style.display = 'none';
    if (a2) { a2.style.display = 'block'; a2.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px;text-align:center;"><div><i class="fa-solid fa-bug" style="font-size:48px;color:#DC2626;margin-bottom:16px;display:block;"></i><h2>Xato: ' + err.message + '</h2><br><button class="btn btn-primary" onclick="location.reload()"><i class="fa-solid fa-rotate-right"></i> Qayta yuklash</button></div></div>'; }
  }
});
