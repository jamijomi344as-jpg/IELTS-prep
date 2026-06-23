/* ============================================================
   DATA ABSTRACTION LAYER
   localStorage yoki Supabase orasidagi farqni yashiradi.
   Agar Supabase enabled bo'lsa — Supabase ishlatadi,
   aks holda — localStorage ishlatadi.
   ============================================================ */

const DB = {
  // ---- ASOSIY GET ----
  async get(table, defaultValue = []) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || defaultValue;
      } catch (err) {
        console.error(`DB.get("${table}") xatosi:`, err);
        return this._getLocal(table, defaultValue);
      }
    }
    return this._getLocal(table, defaultValue);
  },

  // ---- ASOSIY INSERT ----
  async insert(table, record) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(table)
          .insert(record)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error(`DB.insert("${table}") xatosi:`, err);
        return this._insertLocal(table, record);
      }
    }
    return this._insertLocal(table, record);
  },

  // ---- UPDATE ----
  async update(table, id, updates) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(table)
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error(`DB.update("${table}") xatosi:`, err);
        return this._updateLocal(table, id, updates);
      }
    }
    return this._updateLocal(table, id, updates);
  },

  // ---- DELETE ----
  async remove(table, id) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from(table)
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error(`DB.remove("${table}") xatosi:`, err);
        return this._removeLocal(table, id);
      }
    }
    return this._removeLocal(table, id);
  },

  // ---- SPECIFIC QUERY: email bo'yicha topish ----
  async findByEmail(table, email) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(table)
          .select('*')
          .eq('email', email)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
      } catch (err) {
        console.error(`DB.findByEmail("${table}") xatosi:`, err);
        return this._findByEmailLocal(table, email);
      }
    }
    return this._findByEmailLocal(table, email);
  },

  // ---- SPECIFIC QUERY: student_id bo'yicha natijalar ----
  async findResultsByStudent(studentId) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('results')
          .select('*')
          .eq('student_id', studentId)
          .order('submitted_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('DB.findResultsByStudent xatosi:', err);
        return this._findResultsByStudentLocal(studentId);
      }
    }
    return this._findResultsByStudentLocal(studentId);
  },

  // ---- Hamma testlarni olish (type bo'yicha filtrlash) ----
  async getTestsByType(type) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tests')
          .select('*')
          .eq('type', type)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('DB.getTestsByType xatosi:', err);
        return this._getTestsByTypeLocal(type);
      }
    }
    return this._getTestsByTypeLocal(type);
  },

  // ---- Testni id bo'yicha olish ----
  async getTestById(id) {
    if (SUPABASE_CONFIG.enabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tests')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('DB.getTestById xatosi:', err);
        return this._getTestByIdLocal(id);
      }
    }
    return this._getTestByIdLocal(id);
  },

  // ==================== LOCAL STORAGE METODLARI ====================

  _getLocal(table, defaultValue) {
    const raw = localStorage.getItem(`ielts_${table}`);
    return Promise.resolve(raw ? JSON.parse(raw) : defaultValue);
  },

  _insertLocal(table, record) {
    const data = this._getSync(table);
    data.push(record);
    localStorage.setItem(`ielts_${table}`, JSON.stringify(data));
    return Promise.resolve(record);
  },

  _updateLocal(table, id, updates) {
    const data = this._getSync(table);
    const idx = data.findIndex(r => r.id === id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...updates };
      localStorage.setItem(`ielts_${table}`, JSON.stringify(data));
      return Promise.resolve(data[idx]);
    }
    return Promise.resolve(null);
  },

  _removeLocal(table, id) {
    const data = this._getSync(table).filter(r => r.id !== id);
    localStorage.setItem(`ielts_${table}`, JSON.stringify(data));
    return Promise.resolve(true);
  },

  _findByEmailLocal(table, email) {
    const data = this._getSync(table);
    return Promise.resolve(data.find(r => r.email === email) || null);
  },

  _findResultsByStudentLocal(studentId) {
    const data = this._getSync('results');
    return Promise.resolve(
      data.filter(r => r.student_id === studentId)
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    );
  },

  _getTestsByTypeLocal(type) {
    const data = this._getSync('tests');
    return Promise.resolve(
      data.filter(t => t.type === type)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    );
  },

  _getTestByIdLocal(id) {
    const data = this._getSync('tests');
    return Promise.resolve(data.find(t => t.id === id) || null);
  },

  // Sinxron versiya (tez kerak bo'lganda)
  _getSync(table, defaultValue = []) {
    const raw = localStorage.getItem(`ielts_${table}`);
    return raw ? JSON.parse(raw) : defaultValue;
  },

  _setSync(table, data) {
    localStorage.setItem(`ielts_${table}`, JSON.stringify(data));
  }
};

// Dastlabki ma'lumotlarni yuklash
async function initDB() {
  const tests = await DB.get('tests');
  if (tests.length === 0) {
    for (const test of SAMPLE_TESTS) {
      await DB.insert('tests', test);
    }
    console.log('Namuna testlar yuklandi');
  }

  const admins = await DB.get('admins');
  if (admins.length === 0) {
    await DB.insert('admins', {
      id: 'admin_001',
      email: SAMPLE_ADMIN.email,
      password: SAMPLE_ADMIN.password,
      created_at: new Date().toISOString()
    });
    console.log('Admin akkaunti yaratildi');
  }
}
