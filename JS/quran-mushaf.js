/* =========================================================
   QURAN MUSHAF — المصحف التفاعلي
   نص عثماني من AlQuran Cloud API
========================================================= */
(function () {
  'use strict';

  var API_BASE = 'https://api.alquran.cloud/v1';
  var TOTAL_PAGES = 604;
  var cache = {};

  // ===== العناصر =====
  var els = {};

  // ===== الحالة =====
  var state = {
    currentPage: 1,
    loading: false
  };

  // =========================================================
  // جلب صفحة من الـ API
  // =========================================================
  async function fetchPage(pageNum) {
    if (cache[pageNum]) return cache[pageNum];

    var url = API_BASE + '/page/' + pageNum + '/quran-uthmani';
    var res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    if (!data.data || !data.data.ayahs) throw new Error('بيانات غير صحيحة');

    cache[pageNum] = data.data;
    return data.data;
  }

  // =========================================================
  // عرض الصفحة
  // =========================================================
  async function renderPage(pageNum) {
    if (state.loading) return;
    if (pageNum < 1 || pageNum > TOTAL_PAGES) return;

    state.loading = true;
    state.currentPage = pageNum;

    // تأثير Fade out
    if (els.page) els.page.classList.add('fade-out');

    // إظهار التحميل
    if (els.loading) els.loading.style.display = 'flex';
    if (els.pageWrapper) els.pageWrapper.style.display = 'none';
    if (els.error) els.error.style.display = 'none';

    try {
      var data = await fetchPage(pageNum);

      // بناء النص
      var html = '';
      var currentSurah = '';
      var surahInfo = '';

      data.ayahs.forEach(function (ayah, i) {
        // لو سورة جديدة، أضف اسمها
        if (i === 0 || ayah.surah.name !== data.ayahs[i - 1].surah.name) {
          if (i > 0) {
            html += '<div style="text-align:center;margin:20px 0;color:var(--gold-dark);font-family:var(--font-title);font-size:1.2rem;">﷽</div>';
            html += '<div style="text-align:center;margin:10px 0 20px;color:var(--gold-dark);font-family:var(--font-title);font-size:1.4rem;font-weight:700;">سورة ' + ayah.surah.name + '</div>';
          }
          currentSurah = ayah.surah.name;
          surahInfo = 'سورة ' + ayah.surah.name + ' • ' + ayah.surah.numberOfAyahs + ' آية';
        }

        // إضافة البسملة (لو أول آية في السورة ومش الفاتحة أو التوبة)
        if (ayah.numberInSurah === 1 && ayah.surah.number !== 1 && ayah.surah.number !== 9) {
          html += '<div style="text-align:center;color:var(--gold-dark);font-family:var(--font-quran);font-size:1.3rem;margin:10px 0;">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
        }

        // نص الآية
        html += '<span class="mushaf-ayah" data-ayah="' + ayah.numberInSurah + '">' + ayah.text;

        // رقم الآية بزخرفة
        html += '<span class="mushaf-ayah-number">' + toArabicNum(ayah.numberInSurah) + '</span>';

        html += '</span>';
      });

      // عرض النص
      els.page.innerHTML = html;

      // تحديث العنوان
      if (els.surahName) els.surahName.textContent = currentSurah || '—';
      if (els.surahInfo) els.surahInfo.textContent = surahInfo || ('صفحة ' + pageNum);

      // تحديث رقم الصفحة
      if (els.pageInput) els.pageInput.value = pageNum;
      if (els.pageTotal) els.pageTotal.textContent = 'من ' + TOTAL_PAGES;

      // شريط التقدم
      if (els.progressBar) {
        els.progressBar.style.width = ((pageNum / TOTAL_PAGES) * 100) + '%';
      }

      // أزرار التنقل
      if (els.prevBtn) els.prevBtn.disabled = pageNum <= 1;
      if (els.nextBtn) els.nextBtn.disabled = pageNum >= TOTAL_PAGES;

      // إظهار الصفحة
      if (els.loading) els.loading.style.display = 'none';
      if (els.pageWrapper) els.pageWrapper.style.display = 'flex';
      setTimeout(function () {
        els.page.classList.remove('fade-out');
      }, 50);

      // Scroll لأعلى الصفحة
      if (els.pageWrapper) {
        els.pageWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } catch (err) {
      console.error('خطأ في تحميل الصفحة:', err);
      if (els.loading) els.loading.style.display = 'none';
      if (els.error) {
        els.error.style.display = 'block';
        els.error.innerHTML = '<span class="mushaf-error-icon">⚠️</span>تعذر تحميل الصفحة. حاول مرة أخرى.';
      }
    } finally {
      state.loading = false;
    }
  }

  // =========================================================
  // تحويل الرقم إلى عربي
  // =========================================================
  function toArabicNum(n) {
    var arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(n).split('').map(function (d) { return arabic[parseInt(d, 10)]; }).join('');
  }

  // =========================================================
  // التنقل
  // =========================================================
  function nextPage() {
    if (state.currentPage < TOTAL_PAGES) renderPage(state.currentPage + 1);
  }

  function prevPage() {
    if (state.currentPage > 1) renderPage(state.currentPage - 1);
  }

  function goToPage(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1 || n > TOTAL_PAGES) return;
    renderPage(n);
  }

  // =========================================================
  // Swipe (السحب)
  // =========================================================
  function initSwipe(el) {
    var startX = 0, startY = 0, moved = false;

    el.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      moved = false;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      if (!startX) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 15) {
        moved = true;
      }
    }, { passive: true });

    el.addEventListener('touchend', function (e) {
      if (!startX || !moved) return;
      var dx = e.changedTouches[0].clientX - startX;
      // RTL: اسحب يمين = الصفحة السابقة، اسحب يسار = الصفحة التالية
      if (dx > 60) prevPage();
      else if (dx < -60) nextPage();
      startX = 0;
      moved = false;
    }, { passive: true });
  }

  // =========================================================
  // كيبورد
  // =========================================================
  function initKeyboard() {
    document.addEventListener('keydown', function (e) {
      // تجاهل لو المستخدم بيكتب في input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') nextPage();      // في RTL: يسار = التالي
      else if (e.key === 'ArrowRight') prevPage(); // يمين = السابق
    });
  }

  // =========================================================
  // بناء الواجهة
  // =========================================================
  function buildUI(container) {
    container.innerHTML =
      '<div class="mushaf-container">' +
        // الزخرفة العلوية
        '<div class="mushaf-top-ornament">' +
          '<div class="surah-name" id="mushafSurahName">—</div>' +
          '<div class="surah-info" id="mushafSurahInfo">—</div>' +
        '</div>' +

        // منطقة الصفحة
        '<div class="mushaf-page-wrapper" id="mushafPageWrapper">' +
          '<div class="mushaf-page" id="mushafPage"></div>' +
        '</div>' +

        // التحميل
        '<div class="mushaf-loading" id="mushafLoading">' +
          '<div class="mushaf-spinner"></div>' +
          '<div>جاري تحميل الصفحة...</div>' +
        '</div>' +

        // الخطأ
        '<div class="mushaf-error" id="mushafError" style="display:none;"></div>' +

        // شريط التقدم
        '<div class="mushaf-progress">' +
          '<div class="mushaf-progress-bar" id="mushafProgressBar" style="width:0%"></div>' +
        '</div>' +

        // أزرار التحكم
        '<div class="mushaf-controls">' +
          '<button class="mushaf-nav-btn" id="mushafNextBtn" type="button" title="الصفحة التالية">◀</button>' +
          '<div class="mushaf-page-info">' +
            '<span>صفحة</span>' +
            '<input type="number" class="mushaf-page-input" id="mushafPageInput" value="1" min="1" max="' + TOTAL_PAGES + '">' +
            '<span class="mushaf-page-total" id="mushafPageTotal">من ' + TOTAL_PAGES + '</span>' +
          '</div>' +
          '<button class="mushaf-nav-btn" id="mushafPrevBtn" type="button" title="الصفحة السابقة">▶</button>' +
        '</div>' +

        // أزرار الانتقال السريع
        '<div class="mushaf-jump" style="padding:0 24px 20px;">' +
          '<button class="mushaf-jump-btn" data-jump="1">الفاتحة</button>' +
          '<button class="mushaf-jump-btn" data-jump="2">البقرة</button>' +
          '<button class="mushaf-jump-btn" data-jump="293">يس</button>' +
          '<button class="mushaf-jump-btn" data-jump="582">الملك</button>' +
          '<button class="mushaf-jump-btn" data-jump="604">الناس</button>' +
        '</div>' +

      '</div>';
  }

  // =========================================================
  // التشغيل
  // =========================================================
  function init() {
    var container = document.getElementById('mushafContainer');
    if (!container) return;

    // بناء الواجهة
    buildUI(container);

    // ربط العناصر
    els = {
      page: document.getElementById('mushafPage'),
      pageWrapper: document.getElementById('mushafPageWrapper'),
      loading: document.getElementById('mushafLoading'),
      error: document.getElementById('mushafError'),
      surahName: document.getElementById('mushafSurahName'),
      surahInfo: document.getElementById('mushafSurahInfo'),
      pageInput: document.getElementById('mushafPageInput'),
      pageTotal: document.getElementById('mushafPageTotal'),
      progressBar: document.getElementById('mushafProgressBar'),
      prevBtn: document.getElementById('mushafPrevBtn'),
      nextBtn: document.getElementById('mushafNextBtn')
    };

    // ربط الأحداث
    if (els.prevBtn) els.prevBtn.addEventListener('click', prevPage);
    if (els.nextBtn) els.nextBtn.addEventListener('click', nextPage);

    if (els.pageInput) {
      els.pageInput.addEventListener('change', function () {
        goToPage(this.value);
      });
      els.pageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') goToPage(this.value);
      });
    }

    // أزرار الانتقال السريع
    container.querySelectorAll('.mushaf-jump-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goToPage(this.dataset.jump);
      });
    });

    // Swipe
    if (els.pageWrapper) initSwipe(els.pageWrapper);

    // Keyboard
    initKeyboard();

    // تحميل أول صفحة
    renderPage(1);
  }

  // التشغيل بعد تحميل الـ DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();