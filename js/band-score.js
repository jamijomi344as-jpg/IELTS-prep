/* ============================================================
   IELTS BAND SCORE KALKULYATORI
   Rasmiy IELTS ball konvertatsiya jadvali
   ============================================================ */

const BandScore = {
  // Listening va Academic Reading uchun bir xil jadval
  listening: [
    [39, 40, 9.0], [37, 38, 8.5], [35, 36, 8.0], [33, 34, 7.5],
    [30, 32, 7.0], [27, 29, 6.5], [23, 26, 6.0], [20, 22, 5.5],
    [16, 19, 5.0], [13, 15, 4.5], [10, 12, 4.0], [6, 9, 3.5],
    [4, 5, 3.0], [0, 3, 0.0]
  ],
  readingAcademic: [
    [39, 40, 9.0], [37, 38, 8.5], [35, 36, 8.0], [33, 34, 7.5],
    [30, 32, 7.0], [27, 29, 6.5], [23, 26, 6.0], [20, 22, 5.5],
    [16, 19, 5.0], [13, 15, 4.5], [10, 12, 4.0], [6, 9, 3.5],
    [4, 5, 3.0], [0, 3, 0.0]
  ],
  readingGeneral: [
    [40, 40, 9.0], [38, 39, 8.5], [36, 37, 8.0], [34, 35, 7.5],
    [32, 33, 7.0], [29, 31, 6.5], [27, 28, 6.0], [23, 26, 5.5],
    [19, 22, 5.0], [15, 18, 4.5], [12, 14, 4.0], [8, 11, 3.5],
    [5, 7, 3.0], [0, 4, 0.0]
  ],

  /**
   * To'g'ri javoblar sonidan band ballni hisoblaydi
   * @param {number} correct - To'g'ri javoblar soni
   * @param {number} total - Jami savollar soni
   * @param {string} type - 'listening' yoki 'reading'
   * @returns {number} Band score (0.0 - 9.0)
   */
  calculate(correct, total, type) {
    let table;
    if (type === 'listening') {
      table = this.listening;
    } else if (type === 'reading') {
      table = this.readingAcademic; // Default: Academic
    } else {
      return 0;
    }

    for (const [min, max, band] of table) {
      if (correct >= min && correct <= max) return band;
    }
    return 0;
  },

  /**
   * Writing uchun band hisoblash (4 ta me'yorga asosan)
   * Haqiqiy IELTS da ekspert baholaydi, bu oddiy o'rtacha
   */
  getWritingBand(criteria) {
    const avg = (
      criteria.taskAchievement +
      criteria.coherence +
      criteria.lexical +
      criteria.grammar
    ) / 4;
    // 0.5 ga yaxlitlash
    return Math.round(avg * 2) / 2;
  },

  /**
   * Band ballni matnli tavsifga aylantirish
   */
  getBandDescription(band) {
    const descriptions = {
      9: 'Expert User — Tilni to\'liq biladi',
      8: 'Very Good User — Faqat noaniq hollarda xato qiladi',
      7: 'Good User — Murakkab tilda yaxshi ishlaydi',
      6: 'Competent User — Umumiy tilda samarali ishlaydi',
      5: 'Modest User — Asosiy ma\'noni tushunadi',
      4: 'Limited User — Faqat tanish vaziyatlarda ishlaydi',
      3: 'Extremely Limited User — Faqat eng oddiy vaziyatlarda',
      2: 'Intermittent User — Qiyinlik bilan tushunadi',
      1: 'Non User — Bir necha so\'zdan tashqari bilmaydi',
      0: 'Did not attempt — Test topshirmadi'
    };
    const key = Math.min(9, Math.max(0, Math.floor(band)));
    return descriptions[key] || '';
  }
};
