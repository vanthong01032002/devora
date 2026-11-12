/* ============================================================
   TEKORA ADMIN — Kiểm tra SEO trực tiếp trong form Tin tức
   Chấm 17 điều kiện theo mẫu NASANI, cập nhật ngay khi gõ:
   từ khóa chính / SEO title / SEO description / slug / nội dung
   TinyMCE. So khớp từ khóa không phân biệt hoa thường; URL so
   theo dạng slugify bỏ dấu tiếng Việt.
   ============================================================ */
(function () {
  'use strict';

  var listEl = document.getElementById('seoCheckList');
  var kwInput = document.getElementById('seoKeywordMain');
  if (!listEl || !kwInput) return;

  var scoreEl = document.getElementById('seoCheckScore');
  var items = {};
  listEl.querySelectorAll('[data-key]').forEach(function (li) {
    items[li.getAttribute('data-key')] = li;
  });

  function byId(id) { return document.getElementById(id); }
  function val(id) { var el = byId(id); return el ? (el.value || '') : ''; }

  // Slugify bỏ dấu tiếng Việt — cùng thuật toán với toSlug() trong form
  function slugify(str) {
    return (str || '').toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  }

  function stripHtml(html) {
    var div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function countWords(text) {
    if (!text) return 0;
    var m = text.match(/\S+/g);
    return m ? m.length : 0;
  }

  function countOccurrences(haystack, needle) {
    if (!needle) return 0;
    var count = 0, idx = 0;
    while ((idx = haystack.indexOf(needle, idx)) !== -1) {
      count++;
      idx += needle.length;
    }
    return count;
  }

  // Slug chứa cụm từ khóa (đã slugify) theo từng phần tử ngăn bởi "-"
  function slugContainsKw(slug, kwSlug) {
    if (!kwSlug || !slug) return false;
    var parts = slug.split('-'), kparts = kwSlug.split('-');
    if (kparts.length > parts.length) return false;
    for (var i = 0; i + kparts.length <= parts.length; i++) {
      var ok = true;
      for (var j = 0; j < kparts.length; j++) {
        if (parts[i + j] !== kparts[j]) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }

  function getContentHtml() {
    if (window.tinymce && tinymce.get('blogContent')) {
      return tinymce.get('blogContent').getContent() || '';
    }
    return val('blogContent');
  }

  function evaluate() {
    var kw = (kwInput.value || '').trim();
    var kwL = kw.toLowerCase();
    var kwSlug = slugify(kw);
    var seoTitle = val('seoTitle');
    var seoTitleL = seoTitle.toLowerCase();
    var seoDesc = val('seoDesc');
    var seoDescL = seoDesc.toLowerCase();
    var slug = val('slugInput');

    var html = getContentHtml();
    var text = stripHtml(html);
    var textL = text.toLowerCase();
    var totalWords = countWords(text);
    var kwWords = kw ? countWords(kw) : 0;
    var kwCount = kwL ? countOccurrences(textL, kwL) : 0;

    var doc = document.createElement('div');
    doc.innerHTML = html || '';

    var passed = 0;
    function apply(key, pass, text) {
      var li = items[key];
      if (!li) return;
      li.classList.toggle('is-pass', !!pass);
      li.classList.toggle('is-fail', !pass);
      var icon = li.querySelector('.seo-check__icon');
      if (icon) icon.textContent = pass ? '✓' : '✕';
      if (typeof text === 'string') {
        var label = li.querySelector('.seo-check__text');
        if (label) label.textContent = text;
      }
      if (pass) passed++;
    }

    // 1. Đặt từ khoá tập trung
    apply('kw-set', kw.length > 0);

    // 2. Từ khóa trong tiêu đề SEO
    apply('kw-in-title', !!kwL && seoTitleL.indexOf(kwL) !== -1);

    // 3. Từ khóa gần đầu tiêu đề SEO (vị trí bắt đầu <= 30% độ dài)
    var idxTitle = kwL ? seoTitleL.indexOf(kwL) : -1;
    apply('kw-title-start', idxTitle !== -1 && seoTitle.length > 0 && (idxTitle / seoTitle.length) <= 0.30);

    // 4. Độ dài tiêu đề SEO: đạt 40–70 ký tự
    var tl = seoTitle.length;
    apply('title-len', tl >= 40 && tl <= 70,
      (tl >= 40 && tl <= 70)
        ? 'Tiêu đề ' + tl + ' ký tự. Đạt độ dài chuẩn (40–70 ký tự)'
        : 'Tiêu đề ' + tl + ' ký tự ' + (tl > 70 ? '(dài)' : '(ngắn)') + '. Cố gắng có được 70 ký tự');

    // 5. Từ khóa trong mô tả meta
    apply('kw-in-desc', !!kwL && seoDescL.indexOf(kwL) !== -1);

    // 6. Độ dài mô tả meta: đạt khi đúng 160 ký tự (chuẩn cố định)
    var dl = seoDesc.length;
    apply('desc-len', dl === 160,
      dl === 160
        ? 'Mô tả meta SEO có 160 ký tự. Đạt đúng chuẩn 160 ký tự'
        : 'Mô tả meta SEO có ' + dl + ' ký tự (ngắn). Cố gắng thành 160 ký tự');

    // 7. Từ khóa trong URL
    apply('kw-in-url', slugContainsKw(slug, kwSlug));

    // 8. Độ dài URL (theo slug): đạt khi <= 75 ký tự
    apply('url-len', slug.length > 0 && slug.length <= 75,
      slug.length > 75
        ? 'Url có ' + slug.length + ' ký tự (dài). Hãy xem xét rút ngắn nó.'
        : 'Url có ' + slug.length + ' ký tự. Độ dài phù hợp.');

    // 9. Từ khóa ở đầu nội dung (10% đầu theo ký tự)
    var headText = textL.slice(0, Math.ceil(textL.length * 0.10));
    apply('kw-at-start', !!kwL && headText.indexOf(kwL) !== -1);

    // 10. Từ khóa trong nội dung
    apply('kw-in-content', kwCount >= 1);

    // 11. Độ dài nội dung 600–2500 từ
    apply('content-len', totalWords >= 600 && totalWords <= 2500,
      'Nội dung phải dài 600-2500 từ (hiện tại: ' + totalWords + ' từ).');

    // 12. Liên kết nội bộ
    // Lưu ý: TinyMCE tương đối hoá URL theo trang admin (vd "/thiet-ke-website"
    // thành "../../../../thiet-ke-website") nên link tương đối vẫn tính là nội bộ.
    var hasInternal = false;
    doc.querySelectorAll('a[href]').forEach(function (a) {
      var href = (a.getAttribute('href') || '').trim();
      if (!href || href.charAt(0) === '#') return;
      if (href.charAt(0) === '/') { hasInternal = true; return; }
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        if (window.location.hostname && href.indexOf(window.location.hostname) !== -1) hasInternal = true;
      } else {
        hasInternal = true; // đường dẫn tương đối -> cùng website
      }
    });
    apply('internal-link', hasInternal);

    // 13. Từ khóa trong tiêu đề phụ H2/H3/H4
    var headOk = false;
    if (kwL) {
      doc.querySelectorAll('h2, h3, h4').forEach(function (h) {
        if ((h.textContent || '').toLowerCase().indexOf(kwL) !== -1) headOk = true;
      });
    }
    apply('kw-in-heading', headOk);

    // 14. Từ khóa trong alt của hình ảnh
    var altOk = false;
    if (kwL) {
      doc.querySelectorAll('img[alt]').forEach(function (im) {
        if ((im.getAttribute('alt') || '').toLowerCase().indexOf(kwL) !== -1) altOk = true;
      });
    }
    apply('kw-in-alt', altOk);

    // 15. Mật độ từ khóa: đạt 0.5%–1.5%
    var density = (kwCount > 0 && totalWords > 0 && kwWords > 0)
      ? (kwCount * kwWords / totalWords * 100) : 0;
    apply('kw-density', density >= 0.5 && density <= 1.5,
      'Mật độ từ khóa là ' + density.toFixed(2) + '%. Nhắm đến khoảng 1% Mật độ từ khóa.');

    // 16. Đoạn văn ngắn: >= 3 đoạn <p>, không đoạn nào quá 150 từ
    var ps = doc.querySelectorAll('p');
    var paraOk = ps.length >= 3;
    if (paraOk) {
      ps.forEach(function (p) {
        if (countWords((p.textContent || '').replace(/\s+/g, ' ').trim()) > 150) paraOk = false;
      });
    }
    apply('short-paras', paraOk);

    // 17. Có hình ảnh trong nội dung
    apply('has-image', doc.querySelectorAll('img').length >= 1);

    if (scoreEl) scoreEl.textContent = 'Đạt ' + passed + '/17 điều kiện';
  }

  // Lắng nghe gõ trên các trường văn bản
  ['seoKeywordMain', 'seoTitle', 'seoDesc', 'slugInput', 'titleInput'].forEach(function (id) {
    var el = byId(id);
    if (el) el.addEventListener('input', evaluate);
  });

  // Hook vào TinyMCE (editor khởi tạo bất đồng bộ nên thử lại vài lần)
  function hookEditor() {
    if (window.tinymce && tinymce.get('blogContent')) {
      tinymce.get('blogContent').on('input keyup change SetContent', evaluate);
      return true;
    }
    return false;
  }
  if (!hookEditor()) {
    var tries = 0;
    var iv = setInterval(function () {
      if (hookEditor() || ++tries > 30) clearInterval(iv);
    }, 400);
  }

  // Dự phòng: chấm lại định kỳ để bắt mọi thay đổi (dán nội dung, set content...)
  setInterval(evaluate, 1500);
  evaluate();
})();
