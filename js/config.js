/* ============================================================
   SUPABASE KONFIGURATSIYASI
   Bu faylda faqat Supabase ulanish sozlamalari turadi.
   GitHub ga push qilishdan oldin enabled: false qiling!
   ============================================================ */

const SUPABASE_CONFIG = {
  url: 'https://ufhmjjuyheohjpuotdxs.supabase.co',          // ← O'zingizning Supabase URL ingizni shu yerga yozing
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmaG1qanV5aGVvaGpwdW90ZHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjgyMDEsImV4cCI6MjA5NjA0NDIwMX0.n5sxmjOXYgMhaxiAKMYl1iAv1jTNOGL28K5MDP2pj5w',      // ← O'zingizning Supabase Anon Key ingizni shu yerga yozing
  enabled: true     // ← Supabase ishlatmoqchi bo'lsangiz true qiling
};

// Supabase client — faqat enabled bo'lsa yaratiladi
let supabaseClient = null;

if (SUPABASE_CONFIG.enabled && typeof window.supabase !== 'undefined') {
  try {
    supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
    console.log('Supabase muvaffaqiyatli ulandi');
  } catch (err) {
    console.error('Supabase ulanish xatosi:', err);
    SUPABASE_CONFIG.enabled = false;
  }
}
