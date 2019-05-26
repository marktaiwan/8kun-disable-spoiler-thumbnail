/*
  8chan disable spoiler thumbnail
  Version 1.0.2
*/
(function ($) {
'use strict';

function unspoilerThumbnail(postImage) {
  if (postImage.src.endsWith(`/static/assets/${window.board_name}/spoiler.png`)
    || postImage.src.endsWith('/static/spoiler.png')) {
    const fileURL = postImage.closest('div.file').querySelector('.fileinfo>a[title]').href;
    if (fileURL === undefined || fileURL.indexOf('/file_store/') == -1) return;

    const spoilerImg = postImage.src;
    const thumbURL = fileURL.replace('/file_store/', '$&thumb/').replace((/(webm|mp4)$/), 'jpg');

    postImage.onerror = () => postImage.src = spoilerImg;
    postImage.onload = () => {
      const multifile = postImage.closest('.multifile');

      postImage.style.width = `${postImage.naturalWidth}px`;
      postImage.style.height = `${postImage.naturalHeight}px`;

      if (multifile) {
        multifile.style.width = `${postImage.naturalWidth + 40}px`;
      }
    };

    postImage.src = thumbURL;
  }
}

if (active_page == 'thread' || active_page == 'index') {
  if (localStorage.disable_image_spoiler === undefined) {
    localStorage.disable_image_spoiler = 'true';
  }
  if (window.Options && Options.get_tab('general')) {
    Options.extend_tab('general', '<label id="disable-spoiler"><input type="checkbox"> Disable image spoiler where possible</label>');

    document.querySelector('#disable-spoiler>input').addEventListener('change', () => {
      localStorage.disable_image_spoiler = (localStorage.disable_image_spoiler === 'true') ? 'false' : 'true';
    });
    if (localStorage.disable_image_spoiler === 'true') {
      document.querySelector('#disable-spoiler>input').setAttribute('checked', true);
    }
  }
  if (localStorage.disable_image_spoiler === 'true') {
    document.querySelectorAll('.post-image').forEach(unspoilerThumbnail);
    $(document).on('new_post', function (e, post) {
      post.querySelectorAll('.post-image').forEach(unspoilerThumbnail);
    });
  }
}

})(window.jQuery);
