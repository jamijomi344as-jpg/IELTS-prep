/* ============================================================
   SAHIFA RENDER MODULI
   Har bir sahifani HTML qilib chiqaradi
   ============================================================ */

const Pages = {

  // ==================== LANDING (Bosh sahifa) ====================
  landing() {
    return renderNavbar(null) +
      '<section class="hero">' +
        '<div class="container">' +
          '<div class="hero-content">' +
            '<h1>IELTS imtihoniga <span>bepul</span> tayyorgarlik</h1>' +
            '<p>Reading, Listening va Writing bo\'yicha professional testlar. Har qanday qurilmada ishlaydi, natijangizni darhol ko\'ring.</p>' +
            '<div class="hero-buttons">' +
              '<button class="btn btn-accent btn-lg" onclick="App.navigate(\'register\')"><i class="fa-solid fa-rocket"></i> Bepul boshlash</button>' +
              '<button class="btn btn-lg" style="background:rgba(255,255,255,0.15);color:#fff;border:2px solid rgba(255,255,255,0.3);" onclick="App.navigate(\'login\')">Tizimga kirish</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section">' +
        '<div class="container">' +
          '<h2 class="section-title">Nima taklif qilamiz?</h2>' +
          '<p class="section-subtitle">IELTS imtihonining har bir bo\'limi uchun maxsus tayyorgarlik materiallari</p>' +
          '<div class="features-grid">' +
            '<div class="feature-card"><div class="feature-icon reading"><i class="fa-solid fa-book-open"></i></div><h3>Reading</h3><p>Akademik matnlarni o\'qish, asosiy g\'oyalarni tushunish va turli savol turlariga javob berish.</p></div>' +
            '<div class="feature-card"><div class="feature-icon listening"><i class="fa-solid fa-headphones"></i></div><h3>Listening</h3><p>Audio materiallarni tinglab, muhim ma\'lumotlarni aniqlash va aniq javoblar yozish.</p></div>' +
            '<div class="feature-card"><div class="feature-icon writing"><i class="fa-solid fa-pen-fancy"></i></div><h3>Writing</h3><p>Task 1 va Task 2 topshiriqlarini bajarish, so\'z sonini nazorat qilish va strukturani saqlash.</p></div>' +
            '<div class="feature-card"><div class="feature-icon extras"><i class="fa-solid fa-chart-line"></i></div><h3>Baholash</h3><p>Rasmiy IELTS band score jadvali asosida natijangizni aniqlang va progressingizni kuzating.</p></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section" style="padding-top:0;">' +
        '<div class="container">' +
          '<div class="stats-bar">' +
            '<div class="stat-item"><div class="stat-number">3</div><div class="stat-label">Test turi</div></div>' +
            '<div class="stat-item"><div class="stat-number">50+</div><div class="stat-label">Savollar</div></div>' +
            '<div class="stat-item"><div class="stat-number">9.0</div><div class="stat-label">Maksimal ball</div></div>' +
            '<div class="stat-item"><div class="stat-number">100%</div><div class="stat-label">Bepul</div></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section">' +
        '<div class="container">' +
          '<h2 class="section-title">IELTS Reading uchun foydali maslahatlar</h2>' +
          '<p class="section-subtitle">Yuqori ball olish uchun quyidagi strategiyalardan foydalaning</p>' +
          '<div class="tip-card"><div class="tip-icon"><i class="fa-solid fa-lightbulb"></i></div><div class="tip-content"><h4>Avval savollarni o\'qing</h4><p>Matnni o\'qishdan oldin savollarni ko\'rib chiqing. Shunda qidirayotgan ma\'lumotingizni oldindan bilasiz.</p></div></div>' +
          '<div class="tip-card"><div class="tip-icon"><i class="fa-solid fa-clock"></i></div><div class="tip-content"><h4>Vaqtni boshqaring</h4><p>Har bir passage uchun taxminan 20 daqiqa ajrating. Qiyin savollar ustida ko\'p vaqt sarflamang.</p></div></div>' +
          '<div class="tip-card"><div class="tip-icon"><i class="fa-solid fa-spell-check"></i></div><div class="tip-content"><h4>Spelling ga e\'tibor bering</h4><p>Fill-in savollarda spelling xatosi natijani pastga tushiradi. Diqqat bilan yozing.</p></div></div>' +
          '<div class="tip-card"><div class="tip-icon"><i class="fa-solid fa-arrows-left-right"></i></div><div class="tip-content"><h4>True/False/Not Given farqini tushuning</h4><p>False — matn aksi aytilgan. Not Given — matnda umuman bu haqida gap yo\'q. Ikisini adashtirmang.</p></div></div>' +
        '</div>' +
      '</section>' +

      '<footer style="background:var(--primary-dark);color:rgba(255,255,255,0.7);padding:40px 0;text-align:center;">' +
        '<div class="container">' +
          '<p style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;"><i class="fa-solid fa-graduation-cap" style="color:var(--accent-light);margin-right:8px;"></i>IELTS Prep</p>' +
          '<p style="font-size:14px;">Bepul IELTS tayyorgarlik platformasi. Barcha huquqlar himoyalangan.</p>' +
        '</div>' +
      '</footer>';
  },

  // ==================== LOGIN ====================
  login() {
    return renderNavbar(null) +
      '<div class="auth-page">' +
        '<div class="card auth-card">' +
          '<h2>Tizimga kirish</h2>' +
          '<p class="auth-subtitle">IELTS Prep platformasiga xush kelibsiz</p>' +
          '<div class="auth-tabs">' +
            '<button class="auth-tab active" onclick="switchAuthTab(this,\'student\')">O\'quvchi</button>' +
            '<button class="auth-tab" onclick="switchAuthTab(this,\'admin\')">Admin</button>' +
          '</div>' +
          '<form onsubmit="handleLogin(event)">' +
            '<input type="hidden" id="login-role" value="student">' +
            '<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="login-email" placeholder="email@example.com" required></div>' +
            '<div class="form-group"><label class="form-label">Parol</label><input type="password" class="form-input" id="login-password" placeholder="Parolingizni kiriting" required></div>' +
            '<button type="submit" class="btn btn-primary btn-block btn-lg"><i class="fa-solid fa-right-to-bracket"></i> Kirish</button>' +
          '</form>' +
          '<div class="auth-info"><i class="fa-solid fa-circle-info"></i> Hisobingiz yo\'qmi? <a href="#" onclick="App.navigate(\'register\');return false;">Ro\'yxatdan o\'ting</a></div>' +
        '</div>' +
      '</div>';
  },

  // ==================== REGISTER ====================
  register() {
    return renderNavbar(null) +
      '<div class="auth-page">' +
        '<div class="card auth-card">' +
          '<h2>Ro\'yxatdan o\'tish</h2>' +
          '<p class="auth-subtitle">Yangi hisob yarating va testlarni boshlang</p>' +
          '<form onsubmit="handleRegister(event)">' +
            '<div class="form-group"><label class="form-label">Ismingiz</label><input type="text" class="form-input" id="reg-name" placeholder="To\'liq ismingiz" required></div>' +
            '<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="reg-email" placeholder="email@example.com" required></div>' +
            '<div class="form-group"><label class="form-label">Parol</label><input type="password" class="form-input" id="reg-password" placeholder="Kamida 6 ta belgi" required minlength="6"></div>' +
            '<div class="form-group"><label class="form-label">Parolni takrorlang</label><input type="password" class="form-input" id="reg-password2" placeholder="Parolni qayta kiriting" required></div>' +
            '<button type="submit" class="btn btn-primary btn-block btn-lg"><i class="fa-solid fa-user-plus"></i> Ro\'yxatdan o\'tish</button>' +
          '</form>' +
          '<div class="auth-info"><i class="fa-solid fa-circle-info"></i> Allaqachon ro\'yxatdan o\'tganmisiz? <a href="#" onclick="App.navigate(\'login\');return false;">Tizimga kiring</a></div>' +
        '</div>' +
      '</div>';
  },

  // ==================== DASHBOARD ====================
  async dashboard(user) {
    var allTests = await DB.get('tests');
    var results = await DB.findResultsByStudent(user.id);

    var readingTests = allTests.filter(function(t) { return t.type === 'reading'; });
    var listeningTests = allTests.filter(function(t) { return t.type === 'listening'; });
    var writingTests = allTests.filter(function(t) { return t.type === 'writing'; });

    var completedCount = results.length;
    var avgBand = '—';
    if (completedCount > 0) {
      var sum = 0;
      for (var i = 0; i < results.length; i++) sum += (results[i].band_score || 0);
      avgBand = (sum / completedCount).toFixed(1);
    }

    var readingIcon = getTypeIcon('reading');
    var listeningIcon = getTypeIcon('listening');
    var writingIcon = getTypeIcon('writing');

    var recentResultsHTML = '';
    var recent = results.slice(0, 5);
    if (recent.length > 0) {
      for (var r = 0; r < recent.length; r++) {
        var res = recent[r];
        var bClass = res.band_score >= 7 ? 'badge-success' : (res.band_score >= 5 ? 'badge-warning' : 'badge-danger');
        var modeText = res.mode === 'exam' ? 'Imtihon rejimi' : 'Mashg\'ulot rejimi';
        recentResultsHTML += '<div class="test-item">' +
          '<div class="test-item-info"><h3>' + res.test_title + '</h3><p>' + getTypeName(res.test_type) + ' · ' + modeText + ' · ' + formatDate(res.submitted_at) + '</p></div>' +
          '<div class="test-item-meta">' +
            '<span class="badge ' + bClass + '">Band ' + res.band_score + '</span>' +
            '<span class="badge badge-info">' + res.score + '/' + res.total_questions + '</span>' +
            '<button class="btn btn-sm btn-outline" onclick="App.navigate(\'results/' + res.id + '\')"><i class="fa-solid fa-eye"></i></button>' +
          '</div></div>';
      }
    } else {
      recentResultsHTML = '<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i><h3>Hali natijalar yo\'q</h3><p>Test topshiring va natijalaringiz shu yerda ko\'rinadi</p></div>';
    }

    return renderNavbar(user) +
      '<div class="dashboard-header"><div class="container"><h1>Assalomu alaykum, ' + user.name + '!</h1><p class="text-muted">IELTS tayyorgarligingizni davom ettiring</p></div></div>' +
      '<div class="container" style="padding-top:32px;padding-bottom:60px;">' +
        '<div class="dashboard-stats">' +
          '<div class="stat-card"><div class="stat-card-icon" style="background:linear-gradient(135deg,#0D7377,#14B8A6);"><i class="fa-solid fa-check-double"></i></div><div><div class="stat-card-value">' + completedCount + '</div><div class="stat-card-label">Topshirilgan testlar</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-icon" style="background:linear-gradient(135deg,#D97706,#F59E0B);"><i class="fa-solid fa-star"></i></div><div><div class="stat-card-value">' + avgBand + '</div><div class="stat-card-label">O\'rtacha band score</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-icon" style="background:linear-gradient(135deg,#7C3AED,#A78BFA);"><i class="fa-solid fa-list"></i></div><div><div class="stat-card-value">' + allTests.length + '</div><div class="stat-card-label">Mavjud testlar</div></div></div>' +
        '</div>' +

        '<div class="section-header"><h2>Test turini tanlang</h2></div>' +
        '<div class="test-categories">' +
          '<div class="category-card" onclick="App.navigate(\'tests/reading\')"><div class="cat-icon" style="background:' + readingIcon.bg + ';"><i class="fa-solid ' + readingIcon.icon + '"></i></div><h3>Reading</h3><p>Akademik matnlarni o\'qib savollarga javob bering</p><div class="cat-meta"><i class="fa-solid fa-file-lines"></i> ' + readingTests.length + ' ta test<i class="fa-solid fa-chevron-right"></i></div></div>' +
          '<div class="category-card" onclick="App.navigate(\'tests/listening\')"><div class="cat-icon" style="background:' + listeningIcon.bg + ';"><i class="fa-solid ' + listeningIcon.icon + '"></i></div><h3>Listening</h3><p>Audio tinglab savollarga javob bering</p><div class="cat-meta"><i class="fa-solid fa-file-lines"></i> ' + listeningTests.length + ' ta test<i class="fa-solid fa-chevron-right"></i></div></div>' +
          '<div class="category-card" onclick="App.navigate(\'tests/writing\')"><div class="cat-icon" style="background:' + writingIcon.bg + ';"><i class="fa-solid ' + writingIcon.icon + '"></i></div><h3>Writing</h3><p>Insho va tahliliy yozish topshiriqlari</p><div class="cat-meta"><i class="fa-solid fa-file-lines"></i> ' + writingTests.length + ' ta test<i class="fa-solid fa-chevron-right"></i></div></div>' +
        '</div>' +

        '<div class="section-header"><h2>So\'nggi natijalar</h2><button class="btn btn-sm btn-ghost" onclick="App.navigate(\'my-results\')">Barchasini ko\'rish</button></div>' +
        '<div class="test-list">' + recentResultsHTML + '</div>' +
      '</div>';
  },

  // ==================== TEST LIST (type bo'yicha) ====================
  async testList(user, type) {
    var tests = await DB.getTestsByType(type);
    var icon = getTypeIcon(type);
    var name = getTypeName(type);

    var listHTML = '';
    if (tests.length > 0) {
      for (var i = 0; i < tests.length; i++) {
        var t = tests[i];
        var totalQ = getTotalQuestions(t);
        listHTML += '<div class="test-item">' +
          '<div class="test-item-info"><h3>' + t.title + '</h3><p>' + (t.description || '') + '</p></div>' +
          '<div class="test-item-meta">' +
            '<span class="badge badge-primary"><i class="fa-solid fa-clock"></i> ' + t.time_limit + ' daqiqa</span>' +
            '<span class="badge badge-info"><i class="fa-solid fa-question"></i> ' + totalQ + ' savol</span>' +
            '<button class="btn btn-primary btn-sm" onclick="App.navigate(\'test/' + t.id + '\')"><i class="fa-solid fa-play"></i> Boshlash</button>' +
          '</div></div>';
      }
    } else {
      listHTML = '<div class="empty-state"><i class="fa-solid fa-folder-open"></i><h3>Hali testlar yo\'q</h3><p>Bu turdagi testlar tez orada qo\'shiladi</p></div>';
    }

    return renderNavbar(user) +
      '<div class="dashboard-header"><div class="container">' +
        '<button class="btn btn-ghost btn-sm mb-4" onclick="App.navigate(\'dashboard\')"><i class="fa-solid fa-arrow-left"></i> Orqaga</button>' +
        '<h1><i class="fa-solid ' + icon.icon + '" style="color:var(--accent);margin-right:12px;"></i>' + name + ' Testlar</h1>' +
        '<p class="text-muted">' + tests.length + ' ta test mavjud</p>' +
      '</div></div>' +
      '<div class="container" style="padding-top:24px;padding-bottom:60px;"><div class="test-list">' + listHTML + '</div></div>';
  },

  // ==================== MODE SELECTION ====================
  async modeSelection(user, testId) {
    var test = await DB.getTestById(testId);
    if (!test) return '<p>Test topilmadi</p>';

    var totalQ = getTotalQuestions(test);

    return renderNavbar(user) +
      '<div class="dashboard-header"><div class="container">' +
        '<button class="btn btn-ghost btn-sm mb-4" onclick="App.navigate(\'tests/' + test.type + '\')"><i class="fa-solid fa-arrow-left"></i> Orqaga</button>' +
        '<h1>' + test.title + '</h1>' +
        '<p class="text-muted">' + (test.description || '') + ' · ' + totalQ + ' savol · ' + test.time_limit + ' daqiqa</p>' +
      '</div></div>' +
      '<div class="container" style="padding-top:40px;padding-bottom:60px;">' +
        '<h2 class="section-title" style="font-size:28px;margin-bottom:32px;">Rejimni tanlang</h2>' +
        '<div class="mode-selection">' +
          '<div class="mode-card exam" onclick="App.navigate(\'take/' + test.id + '/exam\')">' +
            '<div class="mode-icon"><i class="fa-solid fa-stopwatch"></i></div>' +
            '<h3>Imtihon rejimi</h3>' +
            '<p>Haqiqiy IELTS sharoitida — vaqt chegarasi bor, javobni keyin o\'zgartirib bo\'lmaydi</p>' +
            '<ul class="mode-features">' +
              '<li><i class="fa-solid fa-check"></i> Vaqt chegarasi: ' + test.time_limit + ' daqiqa</li>' +
              '<li><i class="fa-solid fa-check"></i> Javobni faqat bir marta berish</li>' +
              '<li><i class="fa-solid fa-check"></i> Haqiqiy imtihon tajribasi</li>' +
              '<li><i class="fa-solid fa-check"></i> Band score hisoblanadi</li>' +
            '</ul>' +
            '<button class="btn btn-danger btn-lg btn-block"><i class="fa-solid fa-play"></i> Imtihonni boshlash</button>' +
          '</div>' +
          '<div class="mode-card exercise" onclick="App.navigate(\'take/' + test.id + '/exercise\')">' +
            '<div class="mode-icon"><i class="fa-solid fa-dumbbell"></i></div>' +
            '<h3>Mashg\'ulot rejimi</h3>' +
            '<p>O\'rganish uchun — vaqt yo\'q, javoblarni qayta kiriting, tushuntirish ko\'ring</p>' +
            '<ul class="mode-features">' +
              '<li><i class="fa-solid fa-check"></i> Vaqt chegarasi yo\'q</li>' +
              '<li><i class="fa-solid fa-check"></i> Javobni o\'zgartirish mumkin</li>' +
              '<li><i class="fa-solid fa-check"></i> To\'g\'ri/javobni darhol ko\'rish</li>' +
              '<li><i class="fa-solid fa-check"></i> Qo\'shimcha tushuntirishlar</li>' +
            '</ul>' +
            '<button class="btn btn-success btn-lg btn-block"><i class="fa-solid fa-play"></i> Mashg\'ulotni boshlash</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  },

  // ==================== MY RESULTS ====================
  async myResults(user) {
    var results = await DB.findResultsByStudent(user.id);

    var listHTML = '';
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        var bClass = r.band_score >= 7 ? 'badge-success' : (r.band_score >= 5 ? 'badge-warning' : 'badge-danger');
        var modeText = r.mode === 'exam' ? 'Imtihon' : 'Mashg\'ulot';
        listHTML += '<div class="test-item">' +
          '<div class="test-item-info"><h3>' + r.test_title + '</h3><p>' + getTypeName(r.test_type) + ' · ' + modeText + ' · ' + formatDate(r.submitted_at) + '</p></div>' +
          '<div class="test-item-meta">' +
            '<span class="badge ' + bClass + '">Band ' + r.band_score + '</span>' +
            '<span class="badge badge-info">' + r.score + '/' + r.total_questions + '</span>' +
            '<button class="btn btn-sm btn-outline" onclick="App.navigate(\'results/' + r.id + '\')"><i class="fa-solid fa-eye"></i></button>' +
          '</div></div>';
      }
    } else {
      listHTML = '<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i><h3>Hali natijalar yo\'q</h3><p>Test topshiring va natijalaringiz shu yerda ko\'rinadi</p></div>';
    }

    return renderNavbar(user) +
      '<div class="dashboard-header"><div class="container">' +
        '<button class="btn btn-ghost btn-sm mb-4" onclick="App.navigate(\'dashboard\')"><i class="fa-solid fa-arrow-left"></i> Orqaga</button>' +
        '<h1>Barcha natijalarim</h1>' +
        '<p class="text-muted">Jami ' + results.length + ' ta natija</p>' +
      '</div></div>' +
      '<div class="container" style="padding-top:24px;padding-bottom:60px;"><div class="test-list">' + listHTML + '</div></div>';
  },

  // ==================== ADMIN DASHBOARD ====================
  async adminDashboard(user) {
    var tests = await DB.get('tests');
    var students = await DB.get('students');
    var results = await DB.get('results');

    var readingCount = 0, listeningCount = 0, writingCount = 0;
    for (var i = 0; i < tests.length; i++) {
      if (tests[i].type === 'reading') readingCount++;
      else if (tests[i].type === 'listening') listeningCount++;
      else if (tests[i].type === 'writing') writingCount++;
    }

    var avgBand = '—';
    if (results.length > 0) {
      var sum = 0;
      for (var j = 0; j < results.length; j++) sum += (results[j].band_score || 0);
      avgBand = (sum / results.length).toFixed(1);
    }

    var tableRows = '';
    var recentResults = results.slice(0, 20);
    if (recentResults.length > 0) {
      for (var k = 0; k < recentResults.length; k++) {
        var res = recentResults[k];
        var bc = res.band_score >= 7 ? 'badge-success' : (res.band_score >= 5 ? 'badge-warning' : 'badge-danger');
        tableRows += '<tr><td>' + (res.student_name || '—') + '</td><td>' + res.test_title + '</td><td><span class="badge badge-primary">' + getTypeName(res.test_type) + '</span></td><td><span class="badge ' + bc + '">Band ' + res.band_score + '</span></td><td>' + res.score + '/' + res.total_questions + '</td><td>' + formatDate(res.submitted_at) + '</td></tr>';
      }
    } else {
      tableRows = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">Hali natijalar yo\'q</td></tr>';
    }

    return '<div class="admin-layout">' +
      '<aside class="admin-sidebar" id="admin-sidebar">' +
        '<div class="admin-sidebar-brand"><i class="fa-solid fa-graduation-cap"></i> IELTS Admin</div>' +
        '<button class="admin-nav-item active" onclick="App.navigate(\'admin\')"><i class="fa-solid fa-chart-pie"></i> Dashboard</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/tests\')"><i class="fa-solid fa-list-check"></i> Testlar</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/students\')"><i class="fa-solid fa-users"></i> O\'quvchilar</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/results\')"><i class="fa-solid fa-trophy"></i> Natijalar</button>' +
        '<div style="padding:24px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;">' +
          '<button class="admin-nav-item" onclick="App.navigate(\'\')"><i class="fa-solid fa-globe"></i> Saytga o\'tish</button>' +
          '<button class="admin-nav-item" onclick="Auth.logout()"><i class="fa-solid fa-right-from-bracket"></i> Chiqish</button>' +
        '</div>' +
      '</aside>' +
      '<main class="admin-content">' +
        '<h1>Admin Dashboard</h1>' +
        '<div class="admin-stats-grid">' +
          '<div class="admin-stat-card"><div class="stat-label">Jami o\'quvchilar</div><div class="stat-value">' + students.length + '</div></div>' +
          '<div class="admin-stat-card"><div class="stat-label">Jami testlar</div><div class="stat-value">' + tests.length + '</div></div>' +
          '<div class="admin-stat-card"><div class="stat-label">Jami natijalar</div><div class="stat-value">' + results.length + '</div></div>' +
          '<div class="admin-stat-card"><div class="stat-label">O\'rtacha band</div><div class="stat-value">' + avgBand + '</div></div>' +
        '</div>' +
        '<h2 style="font-size:20px;margin-bottom:16px;">Testlar turi bo\'yicha</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;">' +
          '<div class="card card-body" style="text-align:center;"><div style="font-size:32px;font-weight:800;color:var(--primary);">' + readingCount + '</div><div style="color:var(--text-muted);font-size:14px;">Reading</div></div>' +
          '<div class="card card-body" style="text-align:center;"><div style="font-size:32px;font-weight:800;color:var(--accent);">' + listeningCount + '</div><div style="color:var(--text-muted);font-size:14px;">Listening</div></div>' +
          '<div class="card card-body" style="text-align:center;"><div style="font-size:32px;font-weight:800;color:#7C3AED;">' + writingCount + '</div><div style="color:var(--text-muted);font-size:14px;">Writing</div></div>' +
        '</div>' +
        '<h2 style="font-size:20px;margin-bottom:16px;">So\'nggi natijalar</h2>' +
        '<div class="admin-table"><table><thead><tr><th>O\'quvchi</th><th>Test</th><th>Turi</th><th>Band</th><th>Javoblar</th><th>Sana</th></tr></thead><tbody>' + tableRows + '</tbody></table></div>' +
      '</main></div>';
  },

  // ==================== ADMIN TESTS ====================
  async adminTests(user) {
    var tests = await DB.get('tests');

    var rows = '';
    if (tests.length > 0) {
      for (var i = 0; i < tests.length; i++) {
        var t = tests[i];
        var totalQ = getTotalQuestions(t);
        rows += '<tr>' +
          '<td>' + t.title + '</td>' +
          '<td><span class="badge badge-primary">' + getTypeName(t.type) + '</span></td>' +
          '<td>' + totalQ + '</td>' +
          '<td>' + t.time_limit + ' daqiqa</td>' +
          '<td>' + formatDate(t.created_at) + '</td>' +
          '<td>' +
            '<button class="btn btn-sm btn-outline" onclick="App.navigate(\'admin/edit-test/' + t.id + '\')" style="margin-right:4px;"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="btn btn-sm btn-danger" onclick="deleteTest(\'' + t.id + '\')"><i class="fa-solid fa-trash"></i></button>' +
          '</td></tr>';
      }
    } else {
      rows = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">Testlar yo\'q</td></tr>';
    }

    return '<div class="admin-layout">' +
      '<aside class="admin-sidebar">' +
        '<div class="admin-sidebar-brand"><i class="fa-solid fa-graduation-cap"></i> IELTS Admin</div>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin\')"><i class="fa-solid fa-chart-pie"></i> Dashboard</button>' +
        '<button class="admin-nav-item active" onclick="App.navigate(\'admin/tests\')"><i class="fa-solid fa-list-check"></i> Testlar</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/students\')"><i class="fa-solid fa-users"></i> O\'quvchilar</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/results\')"><i class="fa-solid fa-trophy"></i> Natijalar</button>' +
      '</aside>' +
      '<main class="admin-content">' +
        '<div class="flex justify-between items-center mb-6">' +
          '<h1>Testlar boshqaruvi</h1>' +
          '<button class="btn btn-primary" onclick="App.navigate(\'admin/add-test\')"><i class="fa-solid fa-plus"></i> Yangi test</button>' +
        '</div>' +
        '<div class="admin-table"><table><thead><tr><th>Nomi</th><th>Turi</th><th>Savollar</th><th>Vaqt</th><th>Sana</th><th>Amallar</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</main></div>';
  },

  // ==================== ADMIN STUDENTS ====================
  async adminStudents(user) {
    var students = await DB.get('students');

    var rows = '';
    if (students.length > 0) {
      for (var i = 0; i < students.length; i++) {
        var s = students[i];
        rows += '<tr><td>' + s.name + '</td><td>' + s.email + '</td><td>' + formatDate(s.registered_at) + '</td></tr>';
      }
    } else {
      rows = '<tr><td colspan="3" style="text-align:center;padding:40px;color:var(--text-muted);">O\'quvchilar yo\'q</td></tr>';
    }

    return '<div class="admin-layout">' +
      '<aside class="admin-sidebar">' +
        '<div class="admin-sidebar-brand"><i class="fa-solid fa-graduation-cap"></i> IELTS Admin</div>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin\')"><i class="fa-solid fa-chart-pie"></i> Dashboard</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/tests\')"><i class="fa-solid fa-list-check"></i> Testlar</button>' +
        '<button class="admin-nav-item active" onclick="App.navigate(\'admin/students\')"><i class="fa-solid fa-users"></i> O\'quvchilar</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/results\')"><i class="fa-solid fa-trophy"></i> Natijalar</button>' +
      '</aside>' +
      '<main class="admin-content">' +
        '<h1>O\'quvchilar</h1>' +
        '<div class="admin-table" style="margin-top:24px;"><table><thead><tr><th>Ism</th><th>Email</th><th>Ro\'yxatdan o\'tgan sana</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</main></div>';
  },

  // ==================== ADMIN RESULTS ====================
  async adminResults(user) {
    var results = await DB.get('results');

    var rows = '';
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        var bc = r.band_score >= 7 ? 'badge-success' : (r.band_score >= 5 ? 'badge-warning' : 'badge-danger');
        var modeText = r.mode === 'exam' ? 'Imtihon' : 'Mashg\'ulot';
        rows += '<tr>' +
          '<td>' + (r.student_name || '—') + '</td>' +
          '<td>' + r.test_title + '</td>' +
          '<td><span class="badge badge-primary">' + getTypeName(r.test_type) + '</span></td>' +
          '<td>' + modeText + '</td>' +
          '<td><span class="badge ' + bc + '">Band ' + r.band_score + '</span></td>' +
          '<td>' + r.score + '/' + r.total_questions + '</td>' +
          '<td>' + formatDate(r.submitted_at) + '</td></tr>';
      }
    } else {
      rows = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">Natijalar yo\'q</td></tr>';
    }

    return '<div class="admin-layout">' +
      '<aside class="admin-sidebar">' +
        '<div class="admin-sidebar-brand"><i class="fa-solid fa-graduation-cap"></i> IELTS Admin</div>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin\')"><i class="fa-solid fa-chart-pie"></i> Dashboard</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/tests\')"><i class="fa-solid fa-list-check"></i> Testlar</button>' +
        '<button class="admin-nav-item" onclick="App.navigate(\'admin/students\')"><i class="fa-solid fa-users"></i> O\'quvchilar</button>' +
        '<button class="admin-nav-item active" onclick="App.navigate(\'admin/results\')"><i class="fa-solid fa-trophy"></i> Natijalar</button>' +
      '</aside>' +
      '<main class="admin-content">' +
        '<h1>Barcha natijalar</h1>' +
        '<div class="admin-table" style="margin-top:24px;"><table><thead><tr><th>O\'quvchi</th><th>Test</th><th>Turi</th><th>Rejim</th><th>Band</th><th>Javoblar</th><th>Sana</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</main></div>';
  }
};
