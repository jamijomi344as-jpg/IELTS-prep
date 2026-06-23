/* ============================================================
   AUTHENTIKATSIYA MODULI
   Ro'yxatdan o'tish, tizimga kirish, chiqish
   ============================================================ */

const Auth = {
  // Joriy foydalanuvchini olish (sessionStorage dan)
  getCurrentUser() {
    const raw = sessionStorage.getItem('ielts_current_user');
    return raw ? JSON.parse(raw) : null;
  },

  // Foydalanuvchini saqlash
  _saveUser(user) {
    sessionStorage.setItem('ielts_current_user', JSON.stringify(user));
  },

  // Ro'yxatdan o'tish
  async register(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, message: 'Barcha maydonlarni to\'ldiring' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' };
    }
    if (!email.includes('@')) {
      return { success: false, message: 'To\'g\'ri email manzil kiriting' };
    }

    // Email allaqachon mavjudligini tekshirish
    const existing = await DB.findByEmail('students', email);
    if (existing) {
      return { success: false, message: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
    }

    const student = {
      id: generateId('stu'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // Haqiqiy loyihada hash qilingan bo'lishi kerak!
      registered_at: new Date().toISOString()
    };

    await DB.insert('students', student);
    this._saveUser({ id: student.id, name: student.name, email: student.email });

    return { success: true, message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!' };
  },

  // Tizimga kirish
  async login(email, password, isAdmin = false) {
    if (!email || !password) {
      return { success: false, message: 'Email va parolni kiriting' };
    }

    const table = isAdmin ? 'admins' : 'students';
    const user = await DB.findByEmail(table, email.trim().toLowerCase());

    if (!user) {
      return { success: false, message: 'Bunday email topilmadi' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Parol noto\'g\'ri' };
    }

    if (isAdmin) {
      this._saveUser({ id: user.id, email: user.email, isAdmin: true });
    } else {
      this._saveUser({ id: user.id, name: user.name, email: user.email });
    }

    return { success: true, message: 'Tizimga muvaffaqiyatli kirdingiz!' };
  },

  // Chiqish
  logout() {
    sessionStorage.removeItem('ielts_current_user');
    App.navigate('');
    showToast('Tizimdan chiqdingiz', 'info');
  }
};
