/* =========================================================
   BACK TO TOP BUTTON
========================================================= */
(function () {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  var SHOW_AFTER = 300;
  var ticking = false;
  function toggleButton() {
    if (window.scrollY > SHOW_AFTER) btn.classList.add('show');
    else btn.classList.remove('show');
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(toggleButton); ticking = true; }
  }, { passive: true });
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  toggleButton();
})();

/* =========================================================
   THEME
========================================================= */
(function () {
  var toggle = document.getElementById('themeToggle');
  var icon = document.getElementById('themeIcon');
  var text = document.getElementById('themeText');
  if (!toggle) return;

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (text) text.textContent = theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي';
    try { localStorage.setItem('quran-theme', theme); } catch (e) {}
  }
  var saved = 'light';
  try { saved = localStorage.getItem('quran-theme') || 'light'; } catch (e) {}
  apply(saved);
  toggle.addEventListener('click', function () {
    var now = document.documentElement.getAttribute('data-theme');
    apply(now === 'dark' ? 'light' : 'dark');
  });
  })();
  /* =========================================================
    PAGE NAVIGATION — مع Dropdown
  ========================================================= */
  (function () {
    var pages = {
      home:      document.getElementById('page-home'),
      athkar:    document.getElementById('page-athkar'),
      tafsir:    document.getElementById('page-tafsir'),
      quran:     document.getElementById('page-quran'),
      ibtihalat: document.getElementById('page-ibtihalat'),
      form:      document.getElementById('page-form'),
      tv:        document.getElementById('page-tv'),
      videos:    document.getElementById('page-videos')
    };

    /* ===== Overlay ===== */
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    var dropdowns = document.querySelectorAll('.nav-dropdown');

    function closeAllDropdowns() {
      dropdowns.forEach(function (d) { d.classList.remove('open'); });
      overlay.classList.remove('show');
    }

    /* ===== تفعيل زر ===== */
    function setActive(key) {
      // شيل active من كل الأزرار
      document.querySelectorAll('.nav-tab').forEach(function (t) {
        t.classList.remove('active');
      });
      document.querySelectorAll('.nav-dropdown-item').forEach(function (i) {
        i.classList.remove('active');
      });

      // فعّل الزر المطابق
      var directBtn = document.querySelector('.nav-tab[data-page="' + key + '"]');
      if (directBtn) {
        directBtn.classList.add('active');
        return;
      }

      var dropItem = document.querySelector('.nav-dropdown-item[data-page="' + key + '"]');
      if (dropItem) {
        dropItem.classList.add('active');
        var parent = dropItem.closest('.nav-dropdown');
        if (parent) {
          var trigger = parent.querySelector('.nav-tab-trigger');
          if (trigger) trigger.classList.add('active');
        }
      }
    }

    /* ===== تغيير الصفحة ===== */
    function goTo(key) {
      if (!key || !pages[key]) return;

      Object.keys(pages).forEach(function (k) {
        if (pages[k]) pages[k].classList.toggle('active', k === key);
      });

      setActive(key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ===== الأزرار اللي بتغيّر الصفحة مباشرة ===== */
    document.querySelectorAll('.nav-tab[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(btn.dataset.page);
        closeAllDropdowns();
      });
    });

    /* ===== أزرار جوه الـ Dropdown ===== */
    document.querySelectorAll('.nav-dropdown-item[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(btn.dataset.page);
        closeAllDropdowns();
      });
    });

    /* ===== فتح/غلق الـ Dropdown ===== */
    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector('.nav-tab-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!wasOpen) {
          dropdown.classList.add('open');
          if (window.innerWidth <= 768) overlay.classList.add('show');
        }
      });
    });

    /* ===== إغلاق عند الضغط على الخلفية ===== */
    overlay.addEventListener('click', closeAllDropdowns);

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-dropdown')) {
        closeAllDropdowns();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });

    /* ===== دعم data-goto (quick cards) ===== */
    document.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.dataset.goto;
        // دور على الزر في الـ nav
        var navBtn = document.querySelector('.nav-tab[data-page="' + target + '"]') ||
                    document.querySelector('.nav-dropdown-item[data-page="' + target + '"]');
        if (navBtn) navBtn.click();
      });
    });
  })();
/* =========================================================
   SURAH NAMES — محمي داخل namespace
========================================================= */
window.SURAH_NAMES = [
  "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
  "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
  "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
  "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
  "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
  "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
  "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
  "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
  "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
  "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
  "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
  "المسد","الإخلاص","الفلق","الناس"
];
/* =========================================================
   AUDIO PLAYER — Enhanced + Race-condition safe
========================================================= */
var Player = (function () {
  var el = document.getElementById('player');
  var audio = document.getElementById('audioElement');
  var titleEl = document.getElementById('playerTitle');
  var subEl = document.getElementById('playerSub');
  var playPause = document.getElementById('playPauseBtn');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var closeBtn = document.getElementById('closePlayerBtn');
  var repeatBtn = document.getElementById('repeatBtn');
  var playerArt = document.getElementById('playerArt');

  /* ===== عناصر التحكم الجديدة ===== */
  var back10Btn    = document.getElementById('back10Btn');
  var fwd10Btn     = document.getElementById('fwd10Btn');
  var muteBtn      = document.getElementById('muteBtn');
  var volumeSlider = document.getElementById('volumeSlider');
  var speedSelect  = document.getElementById('speedSelect');
  var seekBar      = document.getElementById('playerSeek');
  var timeCurrent  = document.getElementById('playerCurrent');
  var timeDuration = document.getElementById('playerDuration');

  /* ===== حالة داخلية ===== */
  var onPrev = null, onNext = null, onRepeat = null;
  var isSeeking = false;

  /* لو المشغل مش موجود في الصفحة، نرجع API فاضي */
  if (!el || !audio) {
    return {
      show: function () {},
      close: function () {},
      hideRepeat: function () {},
      getAudio: function () { return null; },
      getElements: function () { return {}; }
    };
  }

  /* ===== Helper: تنسيق الوقت ===== */
  function fmtTime(s) {
    if (!isFinite(s) || s < 0) return '00:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  /* ===== onended property (سهل نلغيها) ===== */
  audio.onended = function () {
    if (onNext) onNext();
    else if (playPause) playPause.textContent = '▶';
  };

  /* =========================================================
     show()
  ========================================================= */
  function show(opts) {
    if (playerArt && opts.art) playerArt.textContent = opts.art;
    if (titleEl) titleEl.textContent = opts.title || '';
    if (subEl) subEl.textContent = opts.sub || '';
    el.classList.add('visible');

    onPrev = opts.onPrev || null;
    onNext = opts.onNext || null;
    onRepeat = opts.onRepeat || null;

    if (repeatBtn) repeatBtn.style.display = onRepeat ? 'inline-flex' : 'none';

    /* نظف الـ handlers القديمة قبل التشغيل الجديد */
    audio.onloadedmetadata = null;
    audio.ontimeupdate = null;

    /* Reset UI */
    if (seekBar) seekBar.value = 0;
    if (timeCurrent) timeCurrent.textContent = '00:00';
    if (timeDuration) timeDuration.textContent = '00:00';

    audio.src = opts.url;
    audio.load();

    var playPromise = audio.play();
    if (playPromise && playPromise.catch) playPromise.catch(function () {});

    return playPromise;
  }

  /* =========================================================
     close()
  ========================================================= */
  function close() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    el.classList.remove('visible');
    if (playPause) playPause.textContent = '▶';
    if (seekBar) seekBar.value = 0;
    if (timeCurrent) timeCurrent.textContent = '00:00';
    if (timeDuration) timeDuration.textContent = '00:00';
    onPrev = null; onNext = null; onRepeat = null;
    if (repeatBtn) repeatBtn.style.display = 'none';
    document.querySelectorAll('.surah.playing, .ibtihalat-track.playing').forEach(function (x) {
      x.classList.remove('playing');
    });
  }

  function hideRepeat() {
    if (repeatBtn) repeatBtn.style.display = 'none';
    onRepeat = null;
  }

  function getAudio() { return audio; }
  function getElements() {
    return {
      playPause: playPause,
      prevBtn: prevBtn,
      nextBtn: nextBtn,
      repeatBtn: repeatBtn,
      seekBar: seekBar
    };
  }

  /* =========================================================
     Events — الأزرار الأساسية
  ========================================================= */
  if (playPause) {
    playPause.addEventListener('click', function () {
      if (audio.paused) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        audio.pause();
      }
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    if (onPrev) onPrev();
    else audio.currentTime = 0;
  });

  if (nextBtn) nextBtn.addEventListener('click', function () {
    if (onNext) onNext();
  });

  if (repeatBtn) repeatBtn.addEventListener('click', function () {
    if (onRepeat) onRepeat();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  /* =========================================================
     Events — 10 ثواني
  ========================================================= */
  if (back10Btn) back10Btn.addEventListener('click', function () {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  if (fwd10Btn) fwd10Btn.addEventListener('click', function () {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });

  /* =========================================================
     Events — مستوى الصوت
  ========================================================= */
  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      audio.muted = !audio.muted;
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      var v = parseFloat(volumeSlider.value);
      audio.volume = v;
      audio.muted = (v === 0);
    });
  }

  /* =========================================================
     Events — سرعة التشغيل
  ========================================================= */
  if (speedSelect) {
    speedSelect.addEventListener('change', function () {
      audio.playbackRate = parseFloat(speedSelect.value);
    });
  }

  /* =========================================================
     Events — شريط التقدم (Seek)
  ========================================================= */
  if (seekBar) {
    seekBar.addEventListener('input', function () {
      isSeeking = true;
      var pct = parseFloat(seekBar.value);
      if (audio.duration && isFinite(audio.duration)) {
        audio.currentTime = (pct / 100) * audio.duration;
        if (timeCurrent) timeCurrent.textContent = fmtTime(audio.currentTime);
      }
    });
    seekBar.addEventListener('change', function () {
      isSeeking = false;
    });
  }

  /* =========================================================
     Audio events — تحديث الواجهة
  ========================================================= */
  audio.addEventListener('play', function () {
    if (playPause) playPause.textContent = '⏸';
  });

  audio.addEventListener('pause', function () {
    if (playPause) playPause.textContent = '▶';
  });

  audio.addEventListener('error', function () {
    if (playPause) playPause.textContent = '▶';
  });

  audio.addEventListener('loadedmetadata', function () {
    if (timeDuration) timeDuration.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('timeupdate', function () {
    if (isSeeking) return;
    if (!audio.duration || !isFinite(audio.duration)) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    if (seekBar) seekBar.value = pct;
    if (timeCurrent) timeCurrent.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('volumechange', function () {
    if (muteBtn) {
      muteBtn.textContent = (audio.muted || audio.volume === 0) ? '🔇' : '🔊';
    }
    if (volumeSlider && !isSeeking) {
      volumeSlider.value = audio.muted ? 0 : audio.volume;
    }
  });

  /* =========================================================
     Public API
  ========================================================= */
  return {
    show: show,
    close: close,
    hideRepeat: hideRepeat,
    getAudio: getAudio,
    getElements: getElements
  };
})();

/* =========================================================
   TAFSIR ENGINE — مع إصلاح الاعتماد على TafsirAudioAPI
========================================================= */
(function () {
  var BOOKS = {
    'ibn-kathir': { id: 'ar-tafsir-ibn-kathir',  name: 'ابن كثير', author: 'الحافظ ابن كثير',  book: 'تفسير القرآن العظيم', emoji: '📕' },
    'tabari':     { id: 'ar-tafsir-al-tabari',   name: 'الطبري',   author: 'الإمام الطبري',    book: 'جامع البيان',         emoji: '📗' },
    'qurtubi':    { id: 'ar-tafseer-al-qurtubi', name: 'القرطبي',  author: 'الإمام القرطبي',   book: 'الجامع لأحكام القرآن', emoji: '📘' },
    'saadi':      { id: 'ar-tafseer-al-saddi',   name: 'السعدي',   author: 'الشيخ السعدي',     book: 'تيسير الكريم الرحمن', emoji: '📙' }
  };

  var AYAHS_PER_PAGE = 8;
  var grid = document.getElementById('tafsirGrid');
  if (!grid) return;

  var tafsirListView = document.getElementById('tafsirListView');
  var bookWrap = document.getElementById('bookWrap');
  var bookClose = document.getElementById('bookClose');
  var bookBackBtn = document.getElementById('bookBackBtn');
  var bookCoverTitle = document.getElementById('bookCoverTitle');
  var bookCoverAuthor = document.getElementById('bookCoverAuthor');
  var bookCoverBook = document.getElementById('bookCoverBook');
  var bookPageChapter = document.getElementById('bookPageChapter');
  var bookPageSubtitle = document.getElementById('bookPageSubtitle');
  var bookText = document.getElementById('bookText');
  var bookPrev = document.getElementById('bookPrev');
  var bookNext = document.getElementById('bookNext');
  var bookPageNum = document.getElementById('bookPageNum');
  var statusBar = document.getElementById('tafsirStatus');
  var bookPicker = document.getElementById('tafsirBookPicker');
  var modePicker = document.getElementById('tafsirModePicker');

  var currentBookKey = 'ibn-kathir';
  var currentMode = 'read';
  var currentAyahs = [];
  var currentPage = 0;
  var totalPages = 1;
  var currentSurahNum = null;

  if (bookPicker) {
    bookPicker.addEventListener('click', function (e) {
      var btn = e.target.closest('.tafsir-book-btn');
      if (!btn) return;
      bookPicker.querySelectorAll('.tafsir-book-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentBookKey = btn.dataset.book;
      var book = BOOKS[currentBookKey];
      if (statusBar) statusBar.textContent = 'اختر سورة لعرض ' + book.name;
    });
  }

  if (modePicker) {
    modePicker.addEventListener('click', function (e) {
      var btn = e.target.closest('.tafsir-mode-btn');
      if (!btn) return;
      modePicker.querySelectorAll('.tafsir-mode-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
    });
  }

  function renderSurahList() {
    grid.innerHTML = '';
    var frag = document.createDocumentFragment();
    for (var n = 1; n <= 114; n++) {
      (function (n) {
        var item = document.createElement('div');
        item.className = 'tafsir-item';
        var name = window.SURAH_NAMES[n - 1] || ('سورة ' + n);
        item.innerHTML =
          '<div class="tafsir-item-num">' + n + '</div>' +
          '<div class="tafsir-item-body">' +
            '<div class="tafsir-item-name">' + name + '</div>' +
            '<div class="tafsir-item-sub">📖 افتح الكتاب</div>' +
          '</div>';
        item.addEventListener('click', function () { openBook(n); });
        frag.appendChild(item);
      })(n);
    }
    grid.appendChild(frag);
  }

  async function openBook(surahNum) {
    currentPage = 0;
    currentSurahNum = surahNum;
    var book = BOOKS[currentBookKey];
    var surahName = window.SURAH_NAMES[surahNum - 1] || ('سورة ' + surahNum);
    var surahDisplay = 'سورة ' + surahName;

    if (bookCoverTitle) bookCoverTitle.textContent = surahDisplay;
    if (bookCoverAuthor) bookCoverAuthor.textContent = 'تأليف: ' + book.author;
    if (bookCoverBook) bookCoverBook.textContent = book.book;
    if (bookPageChapter) bookPageChapter.textContent = surahDisplay;
    if (bookPageSubtitle) bookPageSubtitle.textContent = 'تفسير ' + book.name;

    if (tafsirListView) tafsirListView.classList.add('hidden');
    if (bookWrap) bookWrap.classList.remove('hidden');
    if (bookText) bookText.innerHTML = '<div style="text-align:center;padding:30px;color:#7a6a4a;">جاري تحميل التفسير...</div>';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      var url = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/' + book.id + '/' + surahNum + '.json';
      var res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();

      var ayahs = [];
      if (Array.isArray(data)) ayahs = data;
      else if (data && Array.isArray(data.ayahs)) ayahs = data.ayahs;
      else if (data && Array.isArray(data.verses)) ayahs = data.verses;
      else if (data && typeof data === 'object') {
        for (var key in data) {
          if (Array.isArray(data[key])) { ayahs = data[key]; break; }
        }
      }

      if (!ayahs.length) throw new Error('no ayahs');

      currentAyahs = ayahs.map(function (a, i) {
        return {
          ayah_number: a.ayah || a.ayah_number || a.verse_number || (i + 1),
          text: a.text || a.tafsir || a.content || ''
        };
      });

      totalPages = Math.ceil(currentAyahs.length / AYAHS_PER_PAGE);
      renderPage();
      if (statusBar) statusBar.textContent = 'تفسير ' + book.name + ' — ' + surahDisplay + ' (' + currentAyahs.length + ' آية)';

      if (currentMode === 'listen') {
        playTafsirAudio(currentBookKey, surahDisplay);
      }
    } catch (err) {
      console.error(err);
      if (bookText) bookText.innerHTML = '<div style="text-align:center;padding:30px;color:#c0392b;">⚠️ تعذر تحميل التفسير لهذه السورة.</div>';
    }
  }

  function renderPage() {
    if (!bookText) return;

    var start = currentPage * AYAHS_PER_PAGE;
    var end = Math.min(start + AYAHS_PER_PAGE, currentAyahs.length);
    var pageAyahs = currentAyahs.slice(start, end);

    var html = '';
    pageAyahs.forEach(function (item) {
      html += '<div class="book-verse">';
      html += '<span class="book-ayah-num">' + item.ayah_number + '</span>';
      html += '<span class="book-verse-text">' + (item.text || '—') + '</span>';
      html += '</div>';
    });
    html += '<div class="book-page-divider">❖ ❖ ❖</div>';

    if (currentMode === 'listen') {
      // ✅ حل آمن: نحاول نستخدم TafsirAudioAPI لو موجود، وإلا رسالة واضحة
      var audioInfo = (window.TafsirAudioAPI && typeof window.TafsirAudioAPI.getAudioInfo === 'function')
        ? window.TafsirAudioAPI.getAudioInfo(currentBookKey)
        : { hasAudio: false, note: 'التفسير الصوتي غير متاح حاليًا لهذا الكتاب' };

      if (audioInfo && audioInfo.hasAudio && audioInfo.externalUrl) {
        html += '<div style="margin-top:1.5rem;text-align:center;padding:1rem;background:#fdf3d0;border-radius:12px;">' +
          '<div style="font-family:Tajawal;font-weight:700;color:#a87f1c;margin-bottom:0.5rem;">🎧 التفسير الصوتي متاح</div>' +
          '<a href="' + audioInfo.externalUrl + '" target="_blank" rel="noopener" ' +
          'style="display:inline-block;padding:0.6rem 1.2rem;background:linear-gradient(135deg,#d4af37,#a87f1c);color:#fff;border-radius:8px;text-decoration:none;font-family:Tajawal;font-weight:700;">' +
          'استمع على المصدر الخارجي ↗</a>' +
          '<div style="margin-top:0.5rem;font-size:0.85rem;color:#7a6a4a;">' + (audioInfo.note || '') + '</div>' +
          '</div>';
      } else {
        html += '<div style="margin-top:1.5rem;text-align:center;padding:1rem;background:#f5f5f5;border-radius:12px;color:#7a6a4a;font-size:0.9rem;">' +
          '🎧 ' + ((audioInfo && audioInfo.note) || 'الصوت غير متاح') +
          '</div>';
      }
    }

    bookText.innerHTML = html;

    if (bookPrev) bookPrev.disabled = currentPage === 0;
    if (bookNext) bookNext.disabled = currentPage >= totalPages - 1;
    if (bookPageNum) bookPageNum.textContent = 'صفحة ' + (currentPage + 1) + ' من ' + totalPages;
  }

  function playTafsirAudio(bookKey, surahDisplay) {
    // ✅ بس للتذكير — العرض نفسه بيتم في renderPage
    if (!window.TafsirAudioAPI) return;
  }

  function backToList() {
    Player.close();
    if (bookWrap) bookWrap.classList.add('hidden');
    if (tafsirListView) tafsirListView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (bookPrev) bookPrev.addEventListener('click', function () { if (currentPage > 0) { currentPage--; renderPage(); } });
  if (bookNext) bookNext.addEventListener('click', function () { if (currentPage < totalPages - 1) { currentPage++; renderPage(); } });
  if (bookBackBtn) bookBackBtn.addEventListener('click', backToList);
  if (bookClose) bookClose.addEventListener('click', backToList);

  renderSurahList();
})();

/* =========================================================
   RECITERS (Audio Quran) — مع إصلاح race condition + MushafAPI
========================================================= */
(function () {
  var API = 'https://mp3quran.net/api/v3/reciters?language=ar';
  var all = [], currentReciter = null, currentMoshaf = null;
  var currentSurahList = [], currentSurahIndex = -1;
  var grid = document.getElementById('recitersGrid');
  if (!grid) return;

  var statusBar = document.getElementById('statusBar');
  var searchInput = document.getElementById('searchInput');
  var listView = document.getElementById('recitersList');
  var detailsView = document.getElementById('reciterDetails');
  var backBtn = document.getElementById('backBtn');
  var detailsAvatar = document.getElementById('detailsAvatar');
  var detailsName = document.getElementById('detailsName');
  var detailsMeta = document.getElementById('detailsMeta');
  var moshafContainer = document.getElementById('moshafContainer');
  var moshafListView = document.getElementById('moshafListView');
  var surahListView = document.getElementById('surahListView');
  var surahBackBtn = document.getElementById('surahBackBtn');
  var moshafInfoCard = document.getElementById('moshafInfoCard');
  var surahContainer = document.getElementById('surahContainer');

  var quranModePicker = document.getElementById('quranModePicker');
  var quranTextView = document.getElementById('quranTextView');
  var quranBackToSurahListBtn = document.getElementById('quranBackToSurahListBtn');
  var quranTextContainer = document.getElementById('quranTextContainer');
  var quranSurahTitle = document.getElementById('quranSurahTitle');

  var quranTextCache = {};

  var currentQuranMode = 'read';

  var continuousMode = false;
  var continuousList = [];
  var continuousIndex = -1;

  function updateModeBadge() {
    var badge = document.getElementById('currentModeBadge');
    if (!badge) return;
    var names = {
      'read': '📖 قراءة فقط',
      'listen': '🎧 استماع فقط',
      'both': '📖🎧 قراءة واستماع'
    };
    badge.textContent = 'الوضع الحالي: ' + (names[currentQuranMode] || '—');
  }

  if (quranModePicker) {
    quranModePicker.addEventListener('click', function (e) {
      var btn = e.target.closest('.tafsir-mode-btn');
      if (!btn) return;
      quranModePicker.querySelectorAll('.tafsir-mode-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentQuranMode = btn.dataset.qmode;
      updateModeBadge();
    });
  }

  async function fetchReciters() {
    if (statusBar) statusBar.textContent = 'جاري تحميل بيانات القراء...';
    try {
      var res = await fetch(API);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      if (!data || !Array.isArray(data.reciters)) throw new Error('bad data');
      all = data.reciters.slice().sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', 'ar');
      });
      if (statusBar) statusBar.textContent = 'إجمالي القراء: ' + all.length + ' قارئ';
      renderList(all);
    } catch (err) {
      if (statusBar) {
        statusBar.textContent = 'تعذر تحميل البيانات';
        statusBar.classList.add('error');
      }
      grid.innerHTML = '<div class="empty"><span class="empty-emoji">⚠️</span>تعذر تحميل البيانات.</div>';
    }
  }

  function renderList(items) {
    grid.innerHTML = '';
    if (!items.length) {
      grid.innerHTML = '<div class="empty"><span class="empty-emoji">🔍</span>لا توجد نتائج</div>';
      return;
    }
    var frag = document.createDocumentFragment();
    items.forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'reciter';
      var count = r.moshaf ? r.moshaf.length : 0;
      card.innerHTML = '<div class="reciter-avatar">' + (r.letter || '?') + '</div>' +
        '<div class="reciter-body"><div class="reciter-name">' + r.name + '</div>' +
        '<div class="reciter-meta"><span class="chip">📚 ' + count + ' مصحف</span></div></div>';
      card.addEventListener('click', function () { openDetails(r); });
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  var searchTimer = null;
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        var q = searchInput.value.trim().toLowerCase();
        if (!q) { renderList(all); return; }
        var out = all.filter(function (r) {
          return (r.name && r.name.toLowerCase().indexOf(q) !== -1);
        });
        renderList(out);
      }, 250);
    });
  }

  function openDetails(r) {
    continuousMode = false;
    continuousIndex = -1;
    continuousList = [];

    currentReciter = r;
    currentSurahList = [];
    currentSurahIndex = -1;
    Player.close();
    if (window.MushafAPI) window.MushafAPI.close();

    if (listView) listView.classList.add('hidden');
    if (detailsView) detailsView.classList.remove('hidden');
    if (detailsAvatar) detailsAvatar.textContent = r.letter || '?';
    if (detailsName) detailsName.textContent = r.name;
    var count = r.moshaf ? r.moshaf.length : 0;
    if (detailsMeta) detailsMeta.innerHTML = '<span class="tag brand">📚 ' + count + ' مصحف</span>';

    if (moshafListView) moshafListView.classList.remove('hidden');
    if (surahListView) surahListView.classList.add('hidden');
    if (quranTextView) quranTextView.classList.add('hidden');

    renderMoshafList(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      continuousMode = false;
      continuousIndex = -1;
      continuousList = [];
      Player.close();
      if (window.MushafAPI) window.MushafAPI.close();
      if (listView) listView.classList.remove('hidden');
      if (detailsView) detailsView.classList.add('hidden');
      if (moshafListView) moshafListView.classList.remove('hidden');
      if (surahListView) surahListView.classList.add('hidden');
      if (quranTextView) quranTextView.classList.add('hidden');
    });
  }

  function renderMoshafList(r) {
    if (!moshafContainer) return;
    moshafContainer.innerHTML = '';
    if (!r.moshaf || !r.moshaf.length) {
      moshafContainer.innerHTML = '<div class="empty"><span class="empty-emoji">📭</span>لا توجد مصاحف</div>';
      return;
    }
    if (r.moshaf.length === 1) {
      openMoshaf(r, r.moshaf[0], 0);
      return;
    }
    r.moshaf.forEach(function (m, idx) {
      var card = document.createElement('div');
      card.className = 'moshaf-card';
      card.style.cursor = 'pointer';
      card.style.transition = 'all 0.2s ease';

      var count = m.surah_total || 0;
      card.innerHTML =
        '<div class="moshaf-title" style="display:flex;justify-content:space-between;align-items:center;">' +
          '<span>📖 ' + (m.name || 'مصحف') + '</span>' +
          '<span class="badge">' + count + ' سورة</span>' +
        '</div>' +
        '<div style="text-align:center;color:var(--text-2);font-size:0.85rem;padding:0.5rem;">' +
          '👆 اضغط لاختيار هذا المصحف' +
        '</div>';

      card.addEventListener('click', function () { openMoshaf(r, m, idx); });
      moshafContainer.appendChild(card);
    });
  }

  function openMoshaf(r, m, idx) {
    continuousMode = false;
    continuousIndex = -1;
    continuousList = [];

    currentMoshaf = m;
    currentSurahList = [];
    currentSurahIndex = -1;

    if (moshafListView) moshafListView.classList.add('hidden');
    if (surahListView) surahListView.classList.remove('hidden');
    if (quranTextView) quranTextView.classList.add('hidden');
    if (window.MushafAPI) window.MushafAPI.close();

    updateModeBadge();

    var count = m.surah_total || 0;
    if (moshafInfoCard) {
      moshafInfoCard.innerHTML =
        '<div style="background:linear-gradient(135deg,#e8f5e9,#c8e6c9);padding:1rem;border-radius:12px;margin-bottom:1rem;text-align:center;">' +
          '<div style="font-size:1.2rem;font-weight:700;color:#1b5e20;margin-bottom:0.3rem;">📖 ' + (m.name || 'مصحف') + '</div>' +
          '<div style="color:#2e7d32;font-size:0.9rem;">' + r.name + ' — ' + count + ' سورة</div>' +
        '</div>';
    }

    if (!surahContainer) return;
    surahContainer.innerHTML = '';
    var sGrid = document.createElement('div');
    sGrid.className = 'surah-grid';

    var list = [];
    if (m.surah_list) {
      list = m.surah_list.split(',').map(function (s) { return parseInt(s.trim(), 10); }).filter(function (n) { return !isNaN(n); });
    }
    if (!list.length) for (var i = 1; i <= 114; i++) list.push(i);

    list.forEach(function (n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'surah';
      b.dataset.surah = n;
      b.dataset.moshaf = idx;
      b.innerHTML = '<span class="num">' + n + '</span><span class="sname">' + (window.SURAH_NAMES[n - 1] || ('سورة ' + n)) + '</span>';
      b.addEventListener('click', function () { handleSurahClick(r, m, list, n, b); });
      sGrid.appendChild(b);
    });

    surahContainer.appendChild(sGrid);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (surahBackBtn) {
    surahBackBtn.addEventListener('click', function () {
      continuousMode = false;
      continuousIndex = -1;
      continuousList = [];
      Player.close();
      if (window.MushafAPI) window.MushafAPI.close();
      if (surahListView) surahListView.classList.add('hidden');
      if (moshafListView) moshafListView.classList.remove('hidden');
      if (quranTextView) quranTextView.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function handleSurahClick(r, m, list, n, btn) {
    continuousMode = false;
    continuousIndex = -1;
    continuousList = [];

    currentReciter = r;
    currentMoshaf = m;
    currentSurahList = list;
    currentSurahIndex = list.indexOf(n);
    document.querySelectorAll('.surah.playing').forEach(function (el) { el.classList.remove('playing'); });
    if (btn) btn.classList.add('playing');

    // ===== 1) قراءة فقط =====
    if (currentQuranMode === 'read') {
      if (surahListView) surahListView.classList.add('hidden');
      if (quranTextView) quranTextView.classList.remove('hidden');
      Player.close();
      Player.hideRepeat();
      if (window.MushafAPI) window.MushafAPI.close();
      renderQuranText(n);
      return;
    }

    // ===== 2) استماع فقط =====
    if (currentQuranMode === 'listen') {
      continuousList = list;
      continuousMode = true;
      if (window.MushafAPI) window.MushafAPI.close();
      if (quranTextView) quranTextView.classList.add('hidden');
      playContinuousSurah(list.indexOf(n));
      return;
    }

    // ===== 3) قراءة واستماع =====
    if (surahListView) surahListView.classList.add('hidden');
    if (quranTextView) quranTextView.classList.remove('hidden');
    Player.hideRepeat();
    // ✅ MushafAPI اختياري — لو مش موجود، النص العادي هو اللي هيظهر
    if (window.MushafAPI) window.MushafAPI.open();
    playSurahWithHighlight(r, m, n);
  }

  if (quranBackToSurahListBtn) {
    quranBackToSurahListBtn.addEventListener('click', function () {
      continuousMode = false;
      continuousIndex = -1;
      continuousList = [];
      Player.close();
      if (window.MushafAPI) window.MushafAPI.close();
      if (quranTextView) quranTextView.classList.add('hidden');
      if (surahListView) surahListView.classList.remove('hidden');
    });
  }

  async function fetchQuranText(surahNum) {
    if (quranTextCache[surahNum]) return quranTextCache[surahNum];
    try {
      var res = await fetch('https://api.alquran.cloud/v1/surah/' + surahNum);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      if (data.code === 200 && data.data && data.data.ayahs) {
        quranTextCache[surahNum] = data.data.ayahs;
        return data.data.ayahs;
      }
      throw new Error('Invalid data structure');
    } catch (err) {
      console.error('Error fetching Quran text:', err);
      return null;
    }
  }

  async function renderQuranText(surahNum) {
    if (!quranTextContainer) return;
    if (quranSurahTitle) quranSurahTitle.textContent = 'سورة ' + (window.SURAH_NAMES[surahNum - 1] || surahNum);
    quranTextContainer.innerHTML = '<div class="loading-quran-text">جاري تحميل نص السورة...</div>';

    var ayahs = await fetchQuranText(surahNum);
    if (!ayahs || !ayahs.length) {
      quranTextContainer.innerHTML = '<div class="loading-quran-text">⚠️ تعذر تحميل نص السورة.</div>';
      return;
    }
    var html = '';
    ayahs.forEach(function (ayah) {
      html += '<span class="ayah-span" data-ayah-num="' + ayah.numberInSurah + '">' +
              ayah.text +
              '<span class="ayah-number-marker">﴿' + ayah.numberInSurah + '﴾</span> </span>';
    });
    quranTextContainer.innerHTML = html;
  }

  /* ===== ✅ إصلاح race condition ===== */
  async function playSurahWithHighlight(r, m, surahNum) {
    var audioUrl = buildUrl(m.server, surahNum);
    var surahName = window.SURAH_NAMES[surahNum - 1] || ('سورة ' + surahNum);

    await renderQuranText(surahNum);

    var audio = Player.getAudio();
    if (!audio) return;

    var ayahs = quranTextCache[surahNum];
    if (!ayahs || !ayahs.length) return;

    var ayahSpans = quranTextContainer ? quranTextContainer.querySelectorAll('.ayah-span') : [];
    var currentAyahIndex = -1;

    // ✅ نظف أي handlers قديمة
    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onloadedmetadata = null;

    function highlightAyah(index) {
      if (currentAyahIndex === index) return;
      ayahSpans.forEach(function (span) { span.classList.remove('playing'); });
      if (ayahSpans[index]) {
        ayahSpans[index].classList.add('playing');
        try { ayahSpans[index].scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      }
      currentAyahIndex = index;
    }

    var totalWords = ayahs.reduce(function (sum, a) { return sum + a.text.split(' ').length; }, 0);
    var durations = ayahs.map(function (a) { return (a.text.split(' ').length / totalWords); });

    var highlightStarted = false;
    function startHighlighting() {
      if (highlightStarted) return;
      var duration = audio.duration;
      if (!duration || !isFinite(duration)) {
        setTimeout(startHighlighting, 300);
        return;
      }
      highlightStarted = true;
      audio.ontimeupdate = function () {
        if (audio.paused) return;
        var progress = audio.currentTime / duration;
        var cumulative = 0;
        for (var i = 0; i < durations.length; i++) {
          cumulative += durations[i];
          if (progress <= cumulative) { highlightAyah(i); return; }
        }
        highlightAyah(durations.length - 1);
      };
      highlightAyah(0);
    }

    // ✅ حط الـ handlers قبل ما تشغّل
    audio.onloadedmetadata = startHighlighting;
    audio.onended = function () {
      ayahSpans.forEach(function (span) { span.classList.remove('playing'); });
      currentAyahIndex = -1;
      audio.ontimeupdate = null;
    };

    // ✅ بعدين شغّل
    Player.show({
      url: audioUrl,
      title: surahName,
      sub: r.name + ' — ' + (m.name || ''),
      art: '♪',
      onPrev: function () {},
      onNext: function () {}
    });

    // ✅ fallback: لو الـ metadata اتحملت بالفعل
    if (audio.readyState >= 1) startHighlighting();
  }

  /* ===== تشغيل متتابع ===== */
  function playContinuousSurah(index) {
    if (index < 0 || index >= continuousList.length) {
      continuousMode = false;
      continuousIndex = -1;
      Player.close();
      document.querySelectorAll('.surah.playing').forEach(function (el) { el.classList.remove('playing'); });
      return;
    }
    continuousIndex = index;
    var surahNum = continuousList[index];

    document.querySelectorAll('.surah.playing').forEach(function (el) { el.classList.remove('playing'); });
    var activeBtn = document.querySelector('.surah[data-surah="' + surahNum + '"]');
    if (activeBtn) {
      activeBtn.classList.add('playing');
      try { activeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }

    var audioUrl = buildUrl(currentMoshaf.server, surahNum);
    var surahName = window.SURAH_NAMES[surahNum - 1] || ('سورة ' + surahNum);

    Player.show({
      url: audioUrl,
      title: surahName,
      sub: currentReciter.name + ' — ' + (currentMoshaf.name || ''),
      art: '♪',
      onPrev: function () {
        if (continuousIndex > 0) playContinuousSurah(continuousIndex - 1);
      },
      onNext: function () {
        if (continuousIndex < continuousList.length - 1) {
          playContinuousSurah(continuousIndex + 1);
        } else {
          continuousMode = false;
          continuousIndex = -1;
          Player.close();
        }
      },
      onRepeat: function () {
        if (continuousIndex >= 0) playContinuousSurah(continuousIndex);
      }
    });
  }

  function buildUrl(server, n) {
    // ✅ بديل padStart للمتصفحات القديمة
    var s = String(n);
    var pad = '000'.substring(0, 3 - s.length) + s;
    var base = server || '';
    if (base && !base.endsWith('/')) base += '/';
    return base + pad + '.mp3';
  }

  fetchReciters();
})();

/* =========================================================
   IBTIHALAT — مع إصلاح normalize وindexOf
========================================================= */
(function () {
  var grid = document.getElementById('ibtihalatGrid');
  if (!grid) return;

  var statusBar = document.getElementById('ibtihalatStatus');
  var listView = document.getElementById('ibtihalatListView');
  var tracksView = document.getElementById('ibtihalatTracksView');
  var backBtn = document.getElementById('ibtihalatBackBtn');
  var sheikhInfo = document.getElementById('ibtihalatSheikhInfo');
  var tracksList = document.getElementById('ibtihalatTracksList');
  var playAllBtn = document.getElementById('ibtihalatPlayAllBtn');

  var sheikhSearchInput = document.getElementById('ibtihalatSearchInput');
  var trackSearchInput = document.getElementById('ibtihalatTrackSearchInput');
  var tracksSearchWrap = document.getElementById('ibtihalatTracksSearchWrap');

  var currentSheikh = null;
  var currentTracks = [];
  var allSheikhs = [];

  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/[أإآا]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/[ةه]/g, 'ه')
      .replace(/[ؤئء]/g, 'ء')
      .replace(/[\u064B-\u0652]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function renderSheikhs(list) {
    var data = list || allSheikhs;
    grid.innerHTML = '';

    if (!data.length) {
      grid.innerHTML = '<div class="empty"><span class="empty-emoji">🔍</span>لا توجد نتائج</div>';
      if (statusBar) statusBar.textContent = 'لا توجد نتائج مطابقة';
      return;
    }

    if (statusBar) statusBar.textContent = 'إجمالي الشيوخ: ' + data.length;

    var frag = document.createDocumentFragment();
    data.forEach(function (s) {
      var card = document.createElement('div');
      card.className = 'ibtihalat-sheikh-card';
      card.innerHTML =
        '<div class="ibtihalat-sheikh-avatar">' + (s.letter || '?') + '</div>' +
        '<div class="ibtihalat-sheikh-name">' + s.name + '</div>' +
        '<div class="ibtihalat-sheikh-count">🎙️ ' + (s.tracks ? s.tracks.length : 0) + ' ابتهال</div>';
      card.addEventListener('click', function () { openSheikh(s); });
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  // ✅ إصلاح O(n²): بنمرر الـ index الحقيقي
  function renderTracks(list) {
    var data = list || currentTracks;
    if (!tracksList) return;
    tracksList.innerHTML = '';

    if (!data.length) {
      tracksList.innerHTML = '<div class="empty"><span class="empty-emoji">🔍</span>لا توجد نتائج</div>';
      return;
    }

    data.forEach(function (t) {
      var realIndex = currentTracks.indexOf(t);
      if (realIndex === -1) realIndex = 0;

      var row = document.createElement('div');
      row.className = 'ibtihalat-track';
      row.dataset.index = realIndex;
      row.innerHTML =
        '<div class="ibtihalat-track-num">' + (realIndex + 1) + '</div>' +
        '<div class="ibtihalat-track-title">' + t.title + '</div>' +
        '<button class="ibtihalat-track-play" type="button">▶</button>';

      row.addEventListener('click', function (e) {
        if (e.target.classList.contains('ibtihalat-track-play')) return;
        playTrack(realIndex);
      });
      row.querySelector('.ibtihalat-track-play').addEventListener('click', function (e) {
        e.stopPropagation();
        playTrack(realIndex);
      });
      tracksList.appendChild(row);
    });
  }

  function openSheikh(s) {
    currentSheikh = s;
    currentTracks = s.tracks || [];

    if (listView) listView.classList.add('hidden');
    if (tracksView) tracksView.classList.remove('hidden');

    if (tracksSearchWrap) tracksSearchWrap.style.display = 'block';
    if (trackSearchInput) trackSearchInput.value = '';

    if (sheikhInfo) {
      sheikhInfo.innerHTML =
        '<div class="ibtihalat-sheikh-info-name">🎙️ ' + s.name + '</div>' +
        '<div style="color:var(--text-2);margin-top:0.3rem;">' + currentTracks.length + ' ابتهال</div>';
    }

    renderTracks(currentTracks);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function playTrack(index) {
    if (index < 0 || index >= currentTracks.length) {
      Player.close();
      return;
    }
    var t = currentTracks[index];
    document.querySelectorAll('.ibtihalat-track.playing').forEach(function (el) { el.classList.remove('playing'); });
    var row = tracksList ? tracksList.querySelector('.ibtihalat-track[data-index="' + index + '"]') : null;
    if (row) {
      row.classList.add('playing');
      try { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }

    Player.show({
      url: t.url,
      title: t.title,
      sub: currentSheikh.name,
      art: '🎙️',
      onPrev: function () {
        if (index > 0) playTrack(index - 1);
      },
      onNext: function () {
        if (index < currentTracks.length - 1) {
          playTrack(index + 1);
        } else {
          Player.close();
        }
      }
    });
  }

  if (sheikhSearchInput) {
    var sTimer = null;
    sheikhSearchInput.addEventListener('input', function () {
      clearTimeout(sTimer);
      sTimer = setTimeout(function () {
        var q = normalizeText(sheikhSearchInput.value);
        if (!q) { renderSheikhs(allSheikhs); return; }
        var filtered = allSheikhs.filter(function (s) {
          return normalizeText(s.name).indexOf(q) !== -1;
        });
        renderSheikhs(filtered);
      }, 200);
    });
  }

  if (trackSearchInput) {
    var tTimer = null;
    trackSearchInput.addEventListener('input', function () {
      clearTimeout(tTimer);
      tTimer = setTimeout(function () {
        var q = normalizeText(trackSearchInput.value);
        if (!q) { renderTracks(currentTracks); return; }
        var filtered = currentTracks.filter(function (t) {
          return normalizeText(t.title).indexOf(q) !== -1;
        });
        renderTracks(filtered);
      }, 200);
    });
  }

  if (playAllBtn) {
    playAllBtn.addEventListener('click', function () {
      if (!currentTracks.length) return;
      var q = trackSearchInput ? normalizeText(trackSearchInput.value) : '';
      if (q) {
        var firstMatch = null;
        for (var i = 0; i < currentTracks.length; i++) {
          if (normalizeText(currentTracks[i].title).indexOf(q) !== -1) { firstMatch = currentTracks[i]; break; }
        }
        if (firstMatch) { playTrack(currentTracks.indexOf(firstMatch)); return; }
      }
      playTrack(0);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      Player.close();
      if (tracksView) tracksView.classList.add('hidden');
      if (listView) listView.classList.remove('hidden');

      if (trackSearchInput) trackSearchInput.value = '';
      if (sheikhSearchInput) {
        sheikhSearchInput.value = '';
        renderSheikhs(allSheikhs);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function loadAndRender() {
    allSheikhs = (window.IbtihalatAPI && window.IbtihalatAPI.getAll && window.IbtihalatAPI.getAll()) || [];
    renderSheikhs(allSheikhs);
  }

  if (window.IbtihalatAPI && window.IbtihalatAPI.refresh) {
    window.IbtihalatAPI.refresh().then(loadAndRender).catch(loadAndRender);
  } else {
    loadAndRender();
  }
})();

/* =========================================================
   HOME — DAILY REMINDER
========================================================= */
(function () {
  var contentEl = document.getElementById('reminderContent');
  var refreshBtn = document.getElementById('refreshReminder');
  if (!contentEl) return;

  var FALLBACK = [
    "كُن على يقين أن هناك شيء ينتظرك بعد الصبر، ليبهرك وينسيك مرارة الألم!",
    "يا مَن يشتري الدار الفردوس يعمرها بركعة في ظلام الليل يخفيها.",
    "ما جلس قوم يذكرون الله عزّ وجل إلا حفَّتْهم الملائكةُ وغشيتْهم الرحمة.",
    "بالاستغفار، ستَسعٌدون وسَتنعٌمون وسترَزقون، مِمن حيث لا تَعلمون.",
    "فرصة ذهبية لتكفير الذنوب ومحو السيئات ومضاعفة الحسنات .. صيام عرفة.",
    "سُبحان الذي إذا ذكرته ذكرك، وإن شكرته زادك، وإن توكلت عليه كفاك.",
    "أحياناً نضحك والهموم تلف بنا من كل جهة، لكننا نؤمن بأن بعد العسر يسراً."
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function getRandomSeven() {
    var api = window.KHawatirAPI || window.KhawatirAPI;
    if (api && typeof api.getAll === 'function') {
      try {
        var all = api.getAll();
        if (Array.isArray(all) && all.length >= 7) return shuffle(all).slice(0, 7);
      } catch (e) { console.warn('KHawatirAPI error:', e); }
    }
    return shuffle(FALLBACK);
  }

  function render() {
    var list = getRandomSeven();
    var html = '<div class="khawatir-list">';
    list.forEach(function (text, i) {
      html += '<div class="khatira-item">';
      html += '<div class="khatira-num">' + (i + 1) + '</div>';
      html += '<div class="khatira-text">' + text + '</div>';
      html += '</div>';
    });
    html += '</div>';
    contentEl.innerHTML = html;
    contentEl.style.opacity = '0';
    contentEl.style.transform = 'translateY(8px)';
    requestAnimationFrame(function () {
      contentEl.style.transition = 'opacity .35s ease, transform .35s ease';
      contentEl.style.opacity = '1';
      contentEl.style.transform = 'translateY(0)';
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      refreshBtn.style.transform = 'rotate(360deg)';
      refreshBtn.style.transition = 'transform .5s ease';
      setTimeout(function () { refreshBtn.style.transform = ''; refreshBtn.style.transition = ''; }, 500);
      render();
    });
  }
  render();
})();

/* =========================================================
   DAILY CONTENT
========================================================= */
(function () {
  var AYAH_API = 'https://api.alquran.cloud/v1/ayah/random/ar.alafasy';
  var HIJRI_API = 'https://api.aladhan.com/v1/gToH';

  var ayahEl = document.getElementById('ayahContent');
  var refreshAyahBtn = document.getElementById('refreshAyah');

  function loadAyah() {
    if (!ayahEl) return;
    ayahEl.innerHTML = '<div class="daily-loading"><div class="daily-spinner"></div><div>جاري التحميل...</div></div>';
    fetch(AYAH_API).then(function (r) { return r.json(); }).then(function (data) {
      var ayah = data.data;
      ayahEl.innerHTML =
        '<div class="daily-text">﴿ ' + ayah.text + ' ﴾' +
        '<span class="daily-source">📖 سورة ' + ayah.surah.name + ' — الآية ' + ayah.numberInSurah + '</span>' +
        '</div>';
    }).catch(function () {
      ayahEl.innerHTML = '<div class="daily-loading">⚠️ تعذر تحميل الآية</div>';
    });
  }
  if (refreshAyahBtn) refreshAyahBtn.addEventListener('click', loadAyah);
  if (ayahEl) loadAyah();

  var hadithEl = document.getElementById('hadithContent');
  var refreshHadithBtn = document.getElementById('refreshHadith');

  function renderHadith(hadith) {
    if (!hadithEl) return;
    hadithEl.innerHTML =
      '<div class="hadith-narrator">' + hadith.narrator + '</div>' +
      '<div class="hadith-body">« ' + hadith.text + ' »</div>' +
      '<div class="hadith-explanation">' + hadith.explanation + '</div>' +
      '<div class="hadith-source">📚 ' + hadith.source + '</div>';
  }
  function loadHadith() {
    if (!hadithEl) return;
    if (typeof AhadithAPI === 'undefined') { hadithEl.innerHTML = '<div class="daily-loading">⚠️ تعذر تحميل الحديث</div>'; return; }
    renderHadith(AhadithAPI.getDaily());
  }
  function loadRandomHadith() {
    if (!hadithEl) return;
    if (typeof AhadithAPI === 'undefined') { hadithEl.innerHTML = '<div class="daily-loading">⚠️ تعذر تحميل الحديث</div>'; return; }
    renderHadith(AhadithAPI.getRandom());
  }
  if (refreshHadithBtn) refreshHadithBtn.addEventListener('click', loadRandomHadith);
  if (hadithEl) loadHadith();

  var hijriEl = document.getElementById('hijriDate');
  if (hijriEl) {
    fetch(HIJRI_API).then(function (r) { return r.json(); }).then(function (data) {
      var hijri = data.data.hijri;
      var months = ['محرم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
      hijriEl.textContent = hijri.weekday.ar + ' • ' + hijri.day + ' ' + months[hijri.month.number - 1] + ' ' + hijri.year + ' هـ';
    }).catch(function () { hijriEl.textContent = 'التاريخ الهجري غير متاح'; });
  }

  var prayerEl = document.getElementById('prayerTime');
  if (prayerEl) {
    var hour = new Date().getHours();
    var prayer = '';
    if (hour < 5) prayer = 'الفجر';
    else if (hour < 12) prayer = 'الظهر';
    else if (hour < 15) prayer = 'العصر';
    else if (hour < 18) prayer = 'المغرب';
    else if (hour < 20) prayer = 'العشاء';
    else prayer = 'الفجر';
    prayerEl.textContent = 'الصلاة القادمة: ' + prayer;
  }

  document.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.dataset.goto;
      var navTab = document.querySelector('.nav-tab[data-page="' + target + '"]');
      if (navTab) navTab.click();
    });
  });
})();

/* =========================================================
   CONTACT FORM — Enhanced
========================================================= */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var successMsg = document.getElementById('successMessage');
  var errorMsg = document.getElementById('errorMessage');
  var submitBtn = document.getElementById('contactSubmitBtn');

  var EMAIL = 'omarahmedniledental@gmail.com';

  var nameInput = document.getElementById('senderName');
  var emailInput = document.getElementById('senderEmail');
  var typeInput = document.getElementById('messageType');
  var messageInput = document.getElementById('messageContent');

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var NAME_MIN = 2;
  var MESSAGE_MIN = 5;

  function showError(title, desc) {
    if (!errorMsg) return;
    var titleEl = errorMsg.querySelector('.contact-error-title');
    var descEl = errorMsg.querySelector('.contact-error-desc');
    if (titleEl) titleEl.textContent = title || 'حدث خطأ';
    if (descEl) descEl.textContent = desc || 'حاول مرة أخرى';
    errorMsg.classList.add('show');
    clearTimeout(errorMsg._timer);
    errorMsg._timer = setTimeout(function () {
      errorMsg.classList.remove('show');
    }, 6000);
  }

  function showSuccess() {
    if (!successMsg) return;
    successMsg.classList.add('show');
    clearTimeout(successMsg._timer);
    successMsg._timer = setTimeout(function () {
      successMsg.classList.remove('show');
    }, 8000);
  }

  function hideMessages() {
    if (successMsg) successMsg.classList.remove('show');
    if (errorMsg) errorMsg.classList.remove('show');
  }

  function clearFieldErrors() {
    [nameInput, emailInput, messageInput].forEach(function (input) {
      if (input) input.classList.remove('input-error');
    });
  }

  // ✅ إصلاح: guards على كل input
  function validate() {
    clearFieldErrors();

    if (!nameInput) return { ok: false, title: 'خطأ', desc: 'حقل الاسم غير موجود' };
    if (!emailInput) return { ok: false, title: 'خطأ', desc: 'حقل البريد غير موجود' };
    if (!messageInput) return { ok: false, title: 'خطأ', desc: 'حقل الرسالة غير موجود' };

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    if (!name) {
      nameInput.classList.add('input-error');
      nameInput.focus();
      return { ok: false, title: 'الاسم مطلوب', desc: 'من فضلك اكتب اسمك.' };
    }
    if (name.length < NAME_MIN) {
      nameInput.classList.add('input-error');
      nameInput.focus();
      return { ok: false, title: 'الاسم قصير جدًا', desc: 'الاسم لازم يكون ' + NAME_MIN + ' حروف على الأقل.' };
    }

    if (!email) {
      emailInput.classList.add('input-error');
      emailInput.focus();
      return { ok: false, title: 'البريد الإلكتروني مطلوب', desc: 'من فضلك اكتب بريدك الإلكتروني.' };
    }
    if (!EMAIL_REGEX.test(email)) {
      emailInput.classList.add('input-error');
      emailInput.focus();
      return { ok: false, title: 'البريد الإلكتروني غير صحيح', desc: 'اكتب بريدًا إلكترونيًا صحيحًا (مثل: name@example.com).' };
    }

    if (!message) {
      messageInput.classList.add('input-error');
      messageInput.focus();
      return { ok: false, title: 'نص الرسالة مطلوب', desc: 'من فضلك اكتب رسالتك.' };
    }
    if (message.length < MESSAGE_MIN) {
      messageInput.classList.add('input-error');
      messageInput.focus();
      return { ok: false, title: 'الرسالة قصيرة جدًا', desc: 'الرسالة لازم تكون ' + MESSAGE_MIN + ' حروف على الأقل.' };
    }

    return { ok: true };
  }

  function saveDraft() {
    try {
      var draft = {
        name: nameInput ? nameInput.value : '',
        email: emailInput ? emailInput.value : '',
        type: typeInput ? typeInput.value : '',
        message: messageInput ? messageInput.value : ''
      };
      localStorage.setItem('contact_draft', JSON.stringify(draft));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem('contact_draft');
      if (!raw) return;
      var draft = JSON.parse(raw);
      if (draft.name && nameInput) nameInput.value = draft.name;
      if (draft.email && emailInput) emailInput.value = draft.email;
      if (draft.type && typeInput) typeInput.value = draft.type;
      if (draft.message && messageInput) messageInput.value = draft.message;
    } catch (e) {}
  }

  function clearDraft() {
    try { localStorage.removeItem('contact_draft'); } catch (e) {}
  }

  if (emailInput) {
    emailInput.addEventListener('input', function () {
      if (emailInput.value && EMAIL_REGEX.test(emailInput.value.trim())) {
        emailInput.classList.remove('input-error');
      }
    });
  }

  [nameInput, messageInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () {
      if (input.value.trim()) input.classList.remove('input-error');
    });
  });

  [nameInput, emailInput, typeInput, messageInput].forEach(function (input) {
    if (!input) return;
    var event = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(event, saveDraft);
  });

  if (messageInput) {
    messageInput.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        // ✅ استدعاء submit مباشرة بدل dispatchEvent
        form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMessages();

    var check = validate();
    if (!check.ok) {
      showError(check.title, check.desc);
      return;
    }

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var type = typeInput ? typeInput.value : '';
    var content = messageInput.value.trim();

    var originalHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span><span>جاري الإرسال...</span>';
    }

    try {
      var response = await fetch('https://formsubmit.co/ajax/' + EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          type: type,
          message: content,
          _subject: 'رسالة جديدة من المكتبة الإسلامية - ' + type,
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (response.ok) {
        showSuccess();
        form.reset();
        clearDraft();
        clearFieldErrors();
      } else {
        var data = await response.json().catch(function () { return {}; });
        showError(
          'فشل الإرسال',
          data.message || 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.'
        );
      }
    } catch (err) {
      console.error('Contact form error:', err);

      var subject = 'رسالة من المكتبة الإسلامية - ' + type;
      var body =
        'الاسم: ' + name + '\n' +
        'البريد: ' + email + '\n' +
        'نوع الرسالة: ' + type + '\n\n' +
        content;

      var mailtoUrl = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      showError(
        'تعذر الاتصال بالسيرفر',
        'سيتم فتح برنامج البريد كبديل. اضغط على "موافق" للمتابعة.'
      );

      setTimeout(function () {
        window.location.href = mailtoUrl;
      }, 1500);

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    }
  });

  loadDraft();
})();

/* =========================================================
   SCROLL REVEAL
========================================================= */
(function initScrollReveal() {
  var targets = document.querySelectorAll(
    '.daily-card, .quick-card, .info-card, .khatira-item, ' +
    '.athkar-card, .tafsir-item, .reciter, .surah, ' +
    '.ibtihalat-sheikh-card, .ibtihalat-track, .contact-info-item'
  );
  if (!targets.length || !('IntersectionObserver' in window)) return;

  targets.forEach(function (el) { el.classList.add('reveal-on-scroll'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
})();

/* =========================================================
   RIPPLE
========================================================= */
(function initRipple() {
  var selector = '.btn-ghost, .quick-card, .tafsir-book-btn, ' +
                 '.tafsir-mode-btn, .athkar-switch-btn, .choice-btn, ' +
                 '.tv-chip, .contact-form-btn, .back-btn, .book-nav-btn';

  document.addEventListener('pointerdown', function (e) {
    var btn = e.target.closest(selector);
    if (!btn) return;

    var rect = btn.getBoundingClientRect();
    var ripple = document.createElement('span');
    var size = Math.max(rect.width, rect.height);

    ripple.style.cssText =
      'position:absolute;border-radius:50%;pointer-events:none;' +
      'background:rgba(212,175,55,.25);transform:translate(-50%,-50%) scale(0);' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'left:' + (e.clientX - rect.left) + 'px;' +
      'top:' + (e.clientY - rect.top) + 'px;' +
      'transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .55s ease;' +
      'opacity:1;z-index:0;';

    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }

    btn.appendChild(ripple);

    requestAnimationFrame(function () {
      ripple.style.transform = 'translate(-50%,-50%) scale(2.4)';
      ripple.style.opacity = '0';
    });

    setTimeout(function () { ripple.remove(); }, 600);
  }, { passive: true });
})();

/* =========================================================
   REFRESH BUTTONS
========================================================= */
(function initRefreshSpin() {
  var btns = document.querySelectorAll('.daily-refresh, .reminder-refresh-btn');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
      btn.style.transform = 'rotate(360deg)';
      setTimeout(function () {
        btn.style.transition = '';
        btn.style.transform = '';
      }, 620);
    });
  });
})();

/* =========================================================
   SMOOTH TAB SWITCH
========================================================= */
(function initSmoothTabs() {
  document.querySelectorAll('.nav-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var page = document.getElementById('page-' + tab.dataset.page);
      if (!page) return;
      page.style.animation = 'none';
      void page.offsetHeight;
      page.style.animation = '';
    });
  });
})();

/* =========================================================
   PLAYER VISIBILITY
========================================================= */
(function initPlayerVisibility() {
  var player = document.getElementById('player');
  if (!player) return;
  var mo = new MutationObserver(function () {
    if (player.classList.contains('visible')) {
      player.style.animation = 'none';
      void player.offsetHeight;
      player.style.animation = '';
    }
  });
  mo.observe(player, { attributes: true, attributeFilter: ['class'] });
})();