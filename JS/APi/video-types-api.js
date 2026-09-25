/* =========================================================
   VIDEOS API — FIXED (WITH INLINE PLAYER)
========================================================= */
(function () {

  var TYPES_API =
    'https://mp3quran.net/api/v3/video_types?language=ar';

  var VIDEOS_API =
    'https://mp3quran.net/api/v3/videos?language=ar';

  var typesGrid = document.getElementById('videoTypesGrid');

  if (!typesGrid) return;

  var statusEl =
    document.getElementById('videoTypesStatus');

  var searchInput =
    document.getElementById('videoTypesSearch');

  var typesView =
    document.getElementById('videoTypesView');

  var videosView =
    document.getElementById('videoVideosView');

  var backBtn =
    document.getElementById('videoVideosBackBtn');

  var videosGrid =
    document.getElementById('videoVideosGrid');

  var videosTitle =
    document.getElementById('videoVideosTitle');

  var videosSearch =
    document.getElementById('videoVideosSearch');

  var videosStatus =
    document.getElementById('videoVideosStatus');


  /* ===== Inline player elements ===== */
  var playerWrap     = document.getElementById('videoPlayerWrap');
  var playerBackBtn  = document.getElementById('videoPlayerBackBtn');
  var playerTitle    = document.getElementById('videoPlayerTitle');
  var inlineVideo    = document.getElementById('inlineVideo');
  var vcPlayBtn      = document.getElementById('vcPlayBtn');
  var vcMuteBtn      = document.getElementById('vcMuteBtn');
  var vcDownloadBtn  = document.getElementById('vcDownloadBtn');


  var allTypes = [];
  var allVideos = [];
  var currentVideos = [];


  function setStatus(text) {
    if (statusEl) {
      statusEl.textContent = text;
    }
  }


  function setVideosStatus(text) {
    if (videosStatus) {
      videosStatus.textContent = text;
    }
  }


  /* =========================================================
     تحميل أنواع الفيديوهات
  ========================================================= */
  async function fetchTypes() {

    setStatus('جاري تحميل الأنواع...');

    try {

      var res = await fetch(TYPES_API);

      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }

      var data = await res.json();

      if (
        !data ||
        !Array.isArray(data.video_types)
      ) {
        throw new Error('Invalid video types data');
      }

      allTypes = data.video_types;

      setStatus(
        'عدد الأنواع المتاحة: ' +
        allTypes.length
      );

      renderTypes(allTypes);

    } catch (err) {

      console.error(
        'Video Types Error:',
        err
      );

      setStatus(
        '⚠️ تعذر تحميل أنواع الفيديوهات'
      );

      typesGrid.innerHTML =
        '<div class="empty">' +
          '<span class="empty-emoji">⚠️</span>' +
          'تعذر تحميل البيانات' +
        '</div>';
    }
  }


  /* =========================================================
     تحميل جميع الفيديوهات
  ========================================================= */
  async function fetchAllVideos() {

    if (allVideos.length) {
      return allVideos;
    }

    try {

      var res = await fetch(VIDEOS_API);

      if (!res.ok) {
        throw new Error(
          'HTTP ' + res.status
        );
      }

      var data = await res.json();

      if (
        !data ||
        !Array.isArray(data.videos)
      ) {
        throw new Error(
          'Invalid videos data'
        );
      }


      var flat = [];


      data.videos.forEach(function (reciter) {

        var reciterName =
          reciter.reciter_name || '';


        if (!Array.isArray(reciter.videos)) {
          return;
        }


        reciter.videos.forEach(function (video) {

          flat.push({

            id: video.id,

            video_type:
              video.video_type,

            video_url:
              video.video_url,

            video_thumb_url:
              video.video_thumb_url,

            reciter_name:
              reciterName
          });

        });

      });


      allVideos = flat;

      return allVideos;


    } catch (err) {

      console.error(
        'Videos API Error:',
        err
      );

      return [];
    }
  }


  /* =========================================================
     عرض أنواع الفيديوهات
  ========================================================= */
  function renderTypes(list) {

    typesGrid.innerHTML = '';


    if (!list.length) {

      typesGrid.innerHTML =
        '<div class="empty">' +
          '<span class="empty-emoji">🔍</span>' +
          'لا توجد نتائج' +
        '</div>';

      return;
    }


    var frag =
      document.createDocumentFragment();


    list.forEach(function (type) {

      var card =
        document.createElement('button');


      card.type = 'button';

      card.className =
        'video-type-card';


      var name =
        type.video_type || 'نوع فيديو';


      card.innerHTML =

        '<div class="video-type-icon">🎬</div>' +

        '<div class="video-type-body">' +

          '<div class="video-type-name">' +
            escapeHTML(name) +
          '</div>' +

          '<div class="video-type-sub">' +
            'اضغط للعرض' +
          '</div>' +

        '</div>' +

        '<div class="video-type-arrow">←</div>';


      card.addEventListener(
        'click',
        function () {

          openVideos(
            type.id,
            name
          );

        }
      );


      frag.appendChild(card);

    });


    typesGrid.appendChild(frag);
  }


  /* =========================================================
     فتح فيديوهات نوع معين
  ========================================================= */
  async function openVideos(
    typeId,
    typeName
  ) {

    if (typesView) {
      typesView.classList.add('hidden');
    }

    if (videosView) {
      videosView.classList.remove('hidden');
    }


    if (videosTitle) {
      videosTitle.textContent =
        '🎬 ' + typeName;
    }


    if (videosSearch) {
      videosSearch.value = '';
    }


    if (videosGrid) {

      videosGrid.innerHTML =
        '<div class="loading-quran-text">' +
          'جاري تحميل الفيديوهات...' +
        '</div>';
    }


    setVideosStatus(
      'جاري تحميل الفيديوهات...'
    );


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });


    var videos =
      await fetchAllVideos();


    currentVideos =
      videos.filter(function (video) {

        return String(
          video.video_type
        ) === String(typeId);

      });


    setVideosStatus(
      'عدد الفيديوهات: ' +
      currentVideos.length
    );


    renderVideos(currentVideos);
  }


  /* =========================================================
     عرض الفيديوهات
  ========================================================= */
  function renderVideos(list) {

    if (!videosGrid) return;


    videosGrid.innerHTML = '';


    if (!list.length) {

      videosGrid.innerHTML =
        '<div class="empty">' +
          '<span class="empty-emoji">🎬</span>' +
          'لا توجد فيديوهات لهذا النوع' +
        '</div>';

      return;
    }


    var frag =
      document.createDocumentFragment();


    list.forEach(function (video) {

      var card =
        document.createElement('div');


      card.className =
        'video-card';


      /* Thumbnail */
      var thumb =
        document.createElement('div');

      thumb.className =
        'video-thumb';


      if (video.video_thumb_url) {

        thumb.style.backgroundImage =
          'url("' +
          video.video_thumb_url.replace(
            /"/g,
            '\\"'
          ) +
          '")';
      }


      var playIcon =
        document.createElement('div');

      playIcon.className =
        'video-play-icon';

      playIcon.textContent = '▶';


      thumb.appendChild(playIcon);


      /* Body */
      var body =
        document.createElement('div');

      body.className =
        'video-body';


      var title =
        document.createElement('div');

      title.className =
        'video-title';

      title.textContent =
        '🎬 ' +
        (
          video.reciter_name ||
          'فيديو'
        );


      var type =
        document.createElement('div');

      type.className =
        'video-sheikh';

      type.textContent =
        video.video_type
          ? 'النوع: ' + video.video_type
          : '';


      body.appendChild(title);

      body.appendChild(type);


      card.appendChild(thumb);

      card.appendChild(body);


      /* ⬇ تشغيل داخل نفس الصفحة */
      card.addEventListener(
        'click',
        function () {

          if (!video.video_url) {
            return;
          }

          openInlinePlayer(video);
        }
      );


      frag.appendChild(card);

    });


    videosGrid.appendChild(frag);
  }


  /* =========================================================
     تشغيل الفيديو داخل نفس الصفحة
  ========================================================= */
  function openInlinePlayer(video) {

    if (!playerWrap || !inlineVideo) return;

    /* إخفاء القوائم */
    if (typesView)  typesView.classList.add('hidden');
    if (videosView) videosView.classList.add('hidden');

    /* إظهار المشغل */
    playerWrap.classList.remove('hidden');

    /* العنوان */
    if (playerTitle) {
      playerTitle.textContent =
        '🎬 ' + (video.reciter_name || 'فيديو');
    }

    /* الرابط */
    inlineVideo.src = video.video_url;
    inlineVideo.load();
    inlineVideo.play().catch(function () {});

    /* زر التحميل */
    if (vcDownloadBtn) {
      vcDownloadBtn.href = video.video_url;
      vcDownloadBtn.setAttribute('download', '');
    }

    /* تصفير حالة الأزرار */
    if (vcPlayBtn) vcPlayBtn.textContent = '⏸ إيقاف';
    if (vcMuteBtn) vcMuteBtn.textContent = '🔇 كتم الصوت';
    inlineVideo.muted = false;

    /* Scroll للمشغل */
    playerWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  /* =========================================================
     أزرار المشغل
  ========================================================= */

  /* زر الإيقاف / التشغيل */
  if (vcPlayBtn && inlineVideo) {
    vcPlayBtn.addEventListener('click', function () {
      if (inlineVideo.paused) {
        inlineVideo.play().catch(function () {});
      } else {
        inlineVideo.pause();
      }
    });
  }

  /* زر كتم الصوت */
  if (vcMuteBtn && inlineVideo) {
    vcMuteBtn.addEventListener('click', function () {
      inlineVideo.muted = !inlineVideo.muted;
    });
  }

  /* تحديث نص الأزرار حسب حالة الفيديو */
  if (inlineVideo) {

    inlineVideo.addEventListener('play', function () {
      if (vcPlayBtn) vcPlayBtn.textContent = '⏸ إيقاف';
    });

    inlineVideo.addEventListener('pause', function () {
      if (vcPlayBtn) vcPlayBtn.textContent = '▶ تشغيل';
    });

    inlineVideo.addEventListener('volumechange', function () {
      if (vcMuteBtn) {
        vcMuteBtn.textContent = inlineVideo.muted
          ? '🔊 إلغاء الكتم'
          : '🔇 كتم الصوت';
      }
    });
  }

  /* زر إغلاق المشغل */
  if (playerBackBtn && inlineVideo) {
    playerBackBtn.addEventListener('click', function () {

      try { inlineVideo.pause(); } catch (e) {}
      inlineVideo.removeAttribute('src');
      inlineVideo.load();

      if (playerWrap) playerWrap.classList.add('hidden');

      if (videosView) videosView.classList.remove('hidden');
    });
  }


  /* =========================================================
     رجوع للأنواع
  ========================================================= */
  if (backBtn) {

    backBtn.addEventListener(
      'click',
      function () {

        if (videosView) {
          videosView.classList.add('hidden');
        }

        if (typesView) {
          typesView.classList.remove('hidden');
        }

        currentVideos = [];


        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    );
  }


  /* =========================================================
     البحث في الأنواع
  ========================================================= */
  if (searchInput) {

    var typeTimer = null;


    searchInput.addEventListener(
      'input',
      function () {

        clearTimeout(typeTimer);


        typeTimer = setTimeout(
          function () {

            var q =
              searchInput.value
                .trim()
                .toLowerCase();


            if (!q) {

              renderTypes(allTypes);

              return;
            }


            var filtered =
              allTypes.filter(
                function (type) {

                  return (
                    type.video_type ||
                    ''
                  )
                    .toLowerCase()
                    .indexOf(q) !== -1;

                }
              );


            renderTypes(filtered);

          },
          200
        );
      }
    );
  }


  /* =========================================================
     البحث في الفيديوهات
  ========================================================= */
  if (videosSearch) {

    var videoTimer = null;


    videosSearch.addEventListener(
      'input',
      function () {

        clearTimeout(videoTimer);


        videoTimer = setTimeout(
          function () {

            var q =
              videosSearch.value
                .trim()
                .toLowerCase();


            if (!q) {

              renderVideos(
                currentVideos
              );

              return;
            }


            var filtered =
              currentVideos.filter(
                function (video) {

                  return (
                    video.reciter_name ||
                    ''
                  )
                    .toLowerCase()
                    .indexOf(q) !== -1;

                }
              );


            renderVideos(filtered);

          },
          200
        );
      }
    );
  }


  /* =========================================================
     HTML Escape
  ========================================================= */
  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }


  /* =========================================================
     START
  ========================================================= */
  fetchTypes();

})();