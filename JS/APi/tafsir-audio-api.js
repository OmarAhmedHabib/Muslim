async function openBook(surahNum) {
  // ... الكود الموجود ...

  // ✅ ضيف زر الاستماع لو متاح
  var audioInfo = window.TafsirAudioAPI ? window.TafsirAudioAPI.getAudioInfo(currentBookKey) : null;
  var listenBtnHtml = '';
  if (audioInfo && audioInfo.hasAudio) {
    listenBtnHtml = '<button id="tafsirListenBtn" class="continuous-listen-btn" style="margin-top:1rem;">' +
                    '<span class="cl-icon">🎧</span>' +
                    '<span class="cl-text">الاستماع للتفسير الصوتي</span>' +
                    '</button>';
  } else {
    listenBtnHtml = '<div style="text-align:center;color:var(--text-2);padding:1rem;font-size:0.9rem;">' +
                    '🎧 ' + (audioInfo ? audioInfo.note : 'الصوت غير متاح') +
                    '</div>';
  }

  // بعد ما تحمّل النص، ضيف الزر
  bookText.innerHTML = html + listenBtnHtml;

  // اربط الزر
  var listenBtn = document.getElementById('tafsirListenBtn');
  if (listenBtn && audioInfo && audioInfo.hasAudio) {
    listenBtn.addEventListener('click', function() {
      // فتح رابط archive.org في تاب جديد
      window.open('https://archive.org/details/TafsirAlqurtobi', '_blank');
    });
  }
}