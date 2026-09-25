/* =========================================================
   IBTIHALAT API — بيانات الابتهالات (Internet Archive)
========================================================= */
window.IbtihalatAPI = (function () {

  var SHEIKHS_DEF = [
    // ===== النقشبندي =====
    {
      id: 'naqshabandi',
      name: 'الشيخ سيد النقشبندي',
      letter: 'ن',
      archiveId: 'www.arabp-2p.net_20240615',
      fallbackTracks: [
        {
          title: 'إلهي ظمئت إلى رحمتك',
          url: 'https://archive.org/download/www.arabp-2p.net_20240615/%D8%A7%D8%A8%D8%AA%D9%87%D8%A7%D9%84%D8%A7%D8%AA%20%D8%B1%D9%85%D8%B6%D8%A7%D9%86/%D8%A5%D9%84%D9%87%D9%8A%20%D8%B8%D9%85%D8%A6%D8%AA%20%D8%A5%D9%84%D9%89%20%D8%B1%D8%AD%D9%85%D8%AA%D9%83.mp3'
        }
      ]
    },

    // ===== كامل البهتيمي (من مكتبة مشتركة) =====
    {
      id: 'bahtimi',
      name: 'الشيخ كامل يوسف البهتيمي',
      letter: 'ك',
      archiveId: 'a214aaaaaaaaaaaaaaaaa',  // ✅ مكتبة مشتركة
      fallbackTracks: []
    },

    // ===== عبد الباسط (مصاحف) =====
    {
      id: 'abdulbasit',
      name: 'الشيخ عبد الباسط عبد الصمد',
      letter: 'ع',
      archiveId: 'a251127_0515aaa',  // ✅ مصاحف قرآنية
      fallbackTracks: []
    },

    // ===== مصطفى إسماعيل (مصاحف) =====
    {
      id: 'mustafa-ismail',
      name: 'الشيخ مصطفى إسماعيل',
      letter: 'م',
      archiveId: 'mustafa-izzzzzzzzzsmaeil',  // ✅ مصاحف
      fallbackTracks: []
    }

    // ملاحظة: باقي الشيوخ مش عندهم مكتبات ابتهالات على Archive.org
  ];

  var cachedSheikhs = null;

  function buildFileUrl(archiveId, filePath) {
    return 'https://archive.org/download/' + archiveId + '/' +
      filePath.split('/').map(encodeURIComponent).join('/');
  }

  function extractTitle(fileName) {
    var parts = fileName.split('/');
    var base = parts[parts.length - 1] || fileName;
    return base
      .replace(/\.mp3$/i, '')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function fetchSheikhTracks(sheikhDef) {
    var archiveId = sheikhDef.archiveId;
    if (!archiveId) return sheikhDef.fallbackTracks || [];

    try {
      var res = await fetch('https://archive.org/metadata/' + archiveId);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      if (!data || !Array.isArray(data.files)) throw new Error('no files');

      // فلترة الملفات حسب اسم الشيخ (للمكتبات المشتركة)
      var sheikhNameFilter = sheikhDef.id === 'bahtimi' ? 'البهتيمي' : null;

      var tracks = data.files
        .filter(function (f) {
          if (!f.name || !f.name.toLowerCase().endsWith('.mp3')) return false;
          // لو مكتبة مشتركة، فلتر باسم الشيخ
          if (sheikhNameFilter && f.name.indexOf(sheikhNameFilter) === -1) {
            return false;
          }
          return true;
        })
        .map(function (f) {
          return {
            title: extractTitle(f.name),
            url: buildFileUrl(archiveId, f.name)
          };
        });

      return tracks.length ? tracks : (sheikhDef.fallbackTracks || []);
    } catch (err) {
      console.warn('Ibtihalat fetch error for ' + sheikhDef.name + ':', err);
      return sheikhDef.fallbackTracks || [];
    }
  }

  async function refresh() {
    var result = [];
    for (var i = 0; i < SHEIKHS_DEF.length; i++) {
      var def = SHEIKHS_DEF[i];
      var tracks = await fetchSheikhTracks(def);
      result.push({
        id: def.id,
        name: def.name,
        letter: def.letter,
        tracks: tracks
      });
    }
    cachedSheikhs = result;
    return result;
  }

  function getAll() {
    if (cachedSheikhs) return cachedSheikhs;
    return SHEIKHS_DEF.map(function (def) {
      return {
        id: def.id,
        name: def.name,
        letter: def.letter,
        tracks: def.fallbackTracks || []
      };
    });
  }

  return {
    getAll: getAll,
    refresh: refresh
  };
})();