/* =========================================================
   LIVE TV (API-driven)
========================================================= */
(function () {
  var video = document.getElementById('NQR-video');
  if (!video) return;
  var cover = document.getElementById('NQR-cover');
  var bigPlay = document.getElementById('NQR-big-play');
  var loading = document.getElementById('NQR-loading');
  var title = document.getElementById('NQR-title');
  var coverTitle = document.getElementById('NQR-cover-title');
  var currentName = document.getElementById('NQR-current-name');
  var status = document.getElementById('NQR-status');
  var chipsWrap = document.querySelector('.tv-chips');
  var hls = null, currentURL = '';

  function setStatus(t) { if (status) status.textContent = t; }
  function showLoading() { loading.classList.add('show'); }
  function hideLoading() { loading.classList.remove('show'); }
  function destroyHLS() { if (hls) { try { hls.destroy(); } catch (e) {} hls = null; } }

  function playChannel(url, name) {
    currentURL = url;
    title.textContent = 'البث المباشر لـ ' + name;
    coverTitle.textContent = name;
    currentName.textContent = name;
    setStatus('جاري الاتصال...');
    showLoading();
    destroyHLS();

    try { video.pause(); } catch (e) {}
    video.removeAttribute('src');
    video.load();

    // Native HLS (Safari / iOS)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.load();
      video.play().catch(function(){});
      return;
    }

    // HLS.js
    if (window.Hls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('تم التحميل');
        hideLoading();
        video.play().catch(function () {});
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data.fatal) return;
        setStatus('مشكلة في الاتصال...');
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) setTimeout(function () { if (hls) hls.startLoad(); }, 2000);
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) { try { hls.recoverMediaError(); } catch (e) {} }
        else { destroyHLS(); setStatus('تعذر التشغيل'); }
      });
      return;
    }

    hideLoading();
    setStatus('المتصفح لا يدعم HLS');
  }

  // Build chips from API
  function buildChips(list) {
    if (!chipsWrap) return;
    chipsWrap.innerHTML = '';
    list.forEach(function (item, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tv-chip d-inline-flex align-center justify-center gap-2' + (i === 0 ? ' active' : '');
      btn.dataset.url = item.url;
      btn.dataset.name = item.name;
      btn.innerHTML = '<span class="dot"></span><span>' + item.name + '</span>';
      btn.addEventListener('click', function () {
        chipsWrap.querySelectorAll('.tv-chip').forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        playChannel(item.url, item.name);
      });
      chipsWrap.appendChild(btn);
    });
    if (list[0]) playChannel(list[0].url, list[0].name);
  }

  // Fetch from API
  fetch('https://mp3quran.net/api/v3/live-tv?language=ar')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data && data.livetv && data.livetv.length) buildChips(data.livetv);
      else fallback();
    })
    .catch(function () { fallback(); });

  // Fallback if API fails
  function fallback() {
    buildChips([
      { name: 'قناة القرآن الكريم', url: 'https://win.holol.com/live/quran/playlist.m3u8' },
      { name: 'قناة السنة النبوية', url: 'https://win.holol.com/live/sunnah/playlist.m3u8' }
    ]);
  }

  // Controls
  bigPlay.addEventListener('click', function () {
    if (video.paused || video.readyState === 0) {
      if (currentURL) { showLoading(); video.play().catch(function () {}); }
    } else video.pause();
  });
  video.addEventListener('playing', function () {
    hideLoading();
    cover.style.opacity = '0';
    cover.style.pointerEvents = 'none';
    bigPlay.classList.add('hide');
    setStatus('يعمل الآن');
  });
  video.addEventListener('pause', function () { bigPlay.classList.remove('hide'); });
  video.addEventListener('waiting', function () { showLoading(); });
  video.addEventListener('canplay', hideLoading);
  video.addEventListener('error', function () { hideLoading(); setStatus('تعذر التشغيل'); });
})();