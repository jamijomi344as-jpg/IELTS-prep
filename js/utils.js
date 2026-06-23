/* ============================================================
   YORDAMCHI FUNKSIYALAR
   Toast xabarnomalari, Modal oynalar, ID generator va boshqalar
   ============================================================ */

// ---- UNIQUE ID GENERATOR ----
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// ---- TOAST XABARNOMALARI ----
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- MODAL OYNA ----
function showModal(title, bodyHTML, footerHTML = '') {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="closeModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>
    </div>
  `;
}

function closeModal() {
  const container = document.getElementById('modal-container');
  const overlay = container.querySelector('.modal-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s';
    setTimeout(() => { container.innerHTML = ''; }, 200);
  }
}

// ---- VAQTNI FORMATLASH ----
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ---- SO'Z SONINI HISOBLASH ----
function countWords(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

// ---- JAVOBNI TEKSHIRISH (case-insensitive, trim) ----
function checkAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || !userAnswer.trim()) return false;
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

// ---- NAVBAR RENDER ----
function renderNavbar(user) {
  let navRight = '';
  if (user) {
    navRight = `
      <span style="font-weight:600;color:var(--text-muted);margin-right:8px;">
        <i class="fa-solid fa-user" style="margin-right:4px;"></i>${user.name}
      </span>
      <button class="btn btn-ghost btn-sm" onclick="App.navigate('dashboard')">
        <i class="fa-solid fa-home"></i> Bosh sahifa
      </button>
      <button class="btn btn-outline btn-sm" onclick="Auth.logout()">
        <i class="fa-solid fa-right-from-bracket"></i> Chiqish
      </button>
    `;
  } else {
    navRight = `
      <button class="btn btn-ghost btn-sm" onclick="App.navigate('login')">Kirish</button>
      <button class="btn btn-primary btn-sm" onclick="App.navigate('register')">Ro'yxatdan o'tish</button>
    `;
  }

  return `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand" onclick="App.navigate('')">
          <i class="fa-solid fa-graduation-cap"></i> IELTS Prep
        </div>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="navbar-nav" id="navbar-nav">
          ${navRight}
        </div>
      </div>
    </nav>
  `;
}

function toggleMobileMenu() {
  document.getElementById('navbar-nav').classList.toggle('open');
}

// ---- TEST TYPE ICON & RANG ----
function getTypeIcon(type) {
  const icons = {
    reading: { icon: 'fa-book-open', bg: 'linear-gradient(135deg, #0D7377, #14B8A6)' },
    listening: { icon: 'fa-headphones', bg: 'linear-gradient(135deg, #D97706, #F59E0B)' },
    writing: { icon: 'fa-pen-fancy', bg: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }
  };
  return icons[type] || icons.reading;
}

function getTypeName(type) {
  const names = { reading: 'Reading', listening: 'Listening', writing: 'Writing' };
  return names[type] || type;
}

function getTotalQuestions(test) {
  let total = 0;
  if (test.sections) {
    test.sections.forEach(s => { total += (s.questions ? s.questions.length : 0); });
  }
  return total;
}
