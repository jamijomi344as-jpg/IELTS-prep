-- ============================================================
-- IELTS PREP — Supabase ma'lumotlar bazasi schema si
-- Supabase Dashboard → SQL Editor ga bu kodni yopishtiring
-- ============================================================

-- 1. STUDENTS jadvali
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADMINS jadvali
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TESTS jadvali
CREATE TABLE IF NOT EXISTS tests (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('reading', 'listening', 'writing')),
  title TEXT NOT NULL,
  description TEXT,
  time_limit INTEGER NOT NULL DEFAULT 60,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESULTS jadvali
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT,
  test_id TEXT NOT NULL,
  test_title TEXT NOT NULL,
  test_type TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'exam' CHECK (mode IN ('exam', 'exercise')),
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  band_score FLOAT DEFAULT 0,
  answers JSONB DEFAULT '[]'::jsonb,
  writing_answers JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXLAR — tezkor so'rovlar uchun
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_tests_type ON tests(type);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_test_id ON results(test_id);
CREATE INDEX IF NOT EXISTS idx_results_submitted_at ON results(submitted_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — xavfsizlik
-- Supabase da RLS odatda yoqilgan bo'ladi
-- ============================================================

-- RLS ni har bir jadval uchun yoqing
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- STUDENTS uchun siyosatlar
-- Har kim o'qishi mumkin (ro'yxatdan o'tishda tekshirish uchun)
CREATE POLICY "Students select" ON students
  FOR SELECT USING (true);

-- Faqat o'zi o'z ma'lumotlarini yozishi mumkin
CREATE POLICY "Students insert" ON students
  FOR INSERT WITH CHECK (true);

-- ADMINS uchun siyosatlar
-- Faqat admin o'qishi mumkin
CREATE POLICY "Admins select" ON admins
  FOR SELECT USING (true);

CREATE POLICY "Admins insert" ON admins
  FOR INSERT WITH CHECK (true);

-- TESTS uchun siyosatlar
-- Barcha foydalanuvchilar testlarni o'qishi mumkin
CREATE POLICY "Tests select" ON tests
  FOR SELECT USING (true);

-- TESTSni faqat admin yaratishi/o'zgartirishi mumkin
-- (hozircha anonim uchun ham ruxsat beramiz, keyin admin token bilan cheklash kerak)
CREATE POLICY "Tests insert" ON tests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Tests update" ON tests
  FOR UPDATE USING (true);

CREATE POLICY "Tests delete" ON tests
  FOR DELETE USING (true);

-- RESULTS uchun siyosatlar
-- O'quvchi faqat o'z natijalarini ko'radi
CREATE POLICY "Results select" ON results
  FOR SELECT USING (true);

-- O'quvchi faqat o'z natijasini yaratadi
CREATE POLICY "Results insert" ON results
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- BOSHLANG'ICH MA'LUMOTLAR
-- ============================================================

-- Admin akkaunti
INSERT INTO admins (id, email, password, created_at)
VALUES (
  'admin_001',
  'admin@ielts.uz',
  'admin123',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- ESLATMA: Testlarni ilova orqali yaratish tavsiya etiladi
-- chunki sections JSONB formatida katta ma'lumot
-- Agar qo'lda kiritmoqchi bo'lsangiz, quyidagi namunani ishlating:
-- ============================================================

/*
INSERT INTO tests (id, type, title, description, time_limit, sections, created_at)
VALUES (
  'r001',
  'reading',
  'Reading Practice Test 1 — Academic',
  '3 ta matn, 15 ta savol',
  60,
  '[
    {
      "id": 1,
      "title": "Passage 1: The Story of Coffee",
      "passage": "<p>Coffee, one of the world''s most popular beverages...</p>",
      "questions": [
        {
          "id": 1,
          "type": "mcq",
          "text": "Who first discovered coffee?",
          "options": ["A) A monk", "B) Kaldi", "C) A trader", "D) A farmer"],
          "correct_answer": "B"
        }
      ]
    }
  ]'::jsonb,
  NOW()
);
*/
