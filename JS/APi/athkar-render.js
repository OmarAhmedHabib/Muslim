/* =========================================================
   ATHKAR RENDERER — عرض الأذكار والتفاعل معها
   يعتمد على athkar-api.js (يجب تحميله قبله)
========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'athkar_progress_v2';

  // =========================================================
  // تحميل / حفظ التقدم
  // =========================================================
  function loadProgress() {
    try {
      var saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }

  // =========================================================
  // صياغة عدد المرات بالعربي
  // =========================================================
  function formatRepeat(n) {
    if (n === 1) return 'مرة واحدة';
    if (n === 2) return 'مرتان';
    if (n >= 3 && n <= 10) return n + ' مرات';
    return n + ' مرة';
  }

  // =========================================================
  // إنشاء كارت ذكر واحد
  // =========================================================
  function createCard(item, index, listId, progress, onComplete) {
    var cardId = listId + '_card_' + index;
    var count = progress[cardId] || 0;
    var repeat = item.repeat || 1;

    // لو خلص خلاص، مش بنعرضه
    if (count >= repeat) return null;

    var card = document.createElement('div');
    card.className = 'athkar-card';
    card.dataset.repeat = repeat;
    card.dataset.cardId = cardId;

    var textHtml = item.quran
      ? '<span class="quran">' + item.text + '</span>'
      : item.text;

    card.innerHTML =
      '<div class="athkar-card-header">' +
        '<span class="athkar-badge">' + item.badge + '</span>' +
        '<span class="athkar-repeat">' + formatRepeat(repeat) + '</span>' +
      '</div>' +
      '<div class="athkar-text">' + textHtml + '</div>' +
      '<div class="athkar-source">' + item.source + '</div>' +
      '<div class="athkar-footer">' +
        '<span class="athkar-counter">' + count + ' / ' + repeat + '</span>' +
        '<button class="athkar-done-btn" type="button">✅ تم</button>' +
      '</div>';

    // ===== التفاعل =====
    var counterEl = card.querySelector('.athkar-counter');
    var doneBtn = card.querySelector('.athkar-done-btn');

    card.style.cursor = 'pointer';
    card.style.userSelect = 'none';
    card.style.webkitTapHighlightColor = 'transparent';

    function increment() {
      if (count >= repeat) return;
      count++;
      progress[cardId] = count;
      saveProgress(progress);

      counterEl.textContent = count + ' / ' + repeat;

      // تأثير نبضة
      card.style.transform = 'scale(0.98)';
      setTimeout(function () { card.style.transform = ''; }, 120);

      // لو خلص
      if (count >= repeat) {
        doneBtn.disabled = true;
        doneBtn.textContent = '✔ تم';
        setTimeout(function () {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(function () {
            card.remove();
            if (onComplete) onComplete();
          }, 400);
        }, 300);
      }
    }

    card.addEventListener('click', increment);
    doneBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      increment();
    });

    return card;
  }

  // =========================================================
  // عرض قائمة كاملة
  // =========================================================
  function renderList(container, items, listId) {
    container.innerHTML = '';
    var progress = loadProgress();
    var frag = document.createDocumentFragment();

    items.forEach(function (item, i) {
      var card = createCard(item, i, listId, progress, function () {
        checkEmpty(container);
      });
      if (card) frag.appendChild(card);
    });

    container.appendChild(frag);
    checkEmpty(container);
  }

  // =========================================================
  // رسالة "أكملت جميع الأذكار"
  // =========================================================
  function checkEmpty(container) {
    if (!container.querySelector('.athkar-card')) {
      var msg = document.createElement('div');
      msg.className = 'athkar-empty';
      msg.style.cssText = 'text-align:center;padding:2rem;color:#2e7d32;font-size:1.2rem;font-weight:600;';
      msg.textContent = '🎉 أكملت جميع الأذكار، تقبل الله منك';
      container.appendChild(msg);
    }
  }

  // =========================================================
  // التبديل بين الصباح والمساء
  // =========================================================
  function initSwitch(morningEl, eveningEl) {
    var switchBtns = document.querySelectorAll('.athkar-switch-btn');

    switchBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.athkar;
        switchBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        if (key === 'morning') {
          morningEl.classList.remove('hidden');
          eveningEl.classList.add('hidden');
        } else {
          morningEl.classList.add('hidden');
          eveningEl.classList.remove('hidden');
        }
      });
    });
  }

  // =========================================================
  // التشغيل الرئيسي
  // =========================================================
  function init() {
    var morningEl = document.getElementById('athkarMorning');
    var eveningEl = document.getElementById('athkarEvening');

    if (!morningEl || !eveningEl) return;

    // التحقق من وجود AthkarAPI
    if (!window.AthkarAPI) {
      console.error('❌ AthkarAPI غير محمّل — تأكد من إضافة athkar-api.js قبل athkar-render.js');
      morningEl.innerHTML = '<div style="text-align:center;padding:2rem;color:#c0392b;">⚠️ تعذر تحميل الأذكار</div>';
      return;
    }

    // عرض القائمتين
    renderList(morningEl, window.AthkarAPI.getMorning(), 'morning');
    renderList(eveningEl, window.AthkarAPI.getEvening(), 'evening');

    // تفعيل التبديل
    initSwitch(morningEl, eveningEl);
  }

  // التشغيل بعد تحميل الـ DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();