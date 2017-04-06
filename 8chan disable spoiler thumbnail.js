/*
    8chan disable spoiler thumbnail
    Version 1.0
*/
(function ($) {
    'use strict';
    function unspoilerThumbnail() {
        var $file = $(this);

        if ($file.attr('src') == `/static/assets/${window.board_name}/spoiler.png` ||
            $file.attr('src') == '/static/spoiler.png') {

            var spoilerImg = this.src;
            var fileURL = $file.parent().parent().find('.fileinfo>a[title]').first().prop('href');
            if (fileURL === undefined || fileURL.indexOf('/file_store/') == -1) return;
            var str = fileURL.split('/file_store/');

            if (str[1].endsWith('webm')) {
                str[1] = str[1].substring(0 , str[1].lastIndexOf('webm')) + 'jpg';
            }
            if (str[1].endsWith('mp4')) {
                str[1] = str[1].substring(0 , str[1].lastIndexOf('mp4')) + 'jpg';
            }

            var thumbURL = str[0] + '/file_store/thumb/' + str[1];

            this.onerror = function () {
                $file.prop('src', spoilerImg);
            };

            this.onload = function () {
                    $file.css({
                        'width': $file.prop('naturalWidth'),
                        'height': $file.prop('naturalHeight')
                    });
                    $file.parent().parent('.multifile').css('width', ($file.prop('naturalWidth') + 40) + 'px');
            }
            this.src = thumbURL;
        }
    }
    if (active_page == 'thread' || active_page == 'index') {
        if (window.Options && Options.get_tab('general')) {
            Options.extend_tab('general', '<label id="disable-spoiler"><input type="checkbox">' + _(' Disable image spoiler where possible') + '</label>');

            $('#disable-spoiler>input').on('change', function() {
                localStorage.disable_image_spoiler = (localStorage.disable_image_spoiler === 'true') ? 'false' : 'true';
            });
            if (localStorage.disable_image_spoiler === 'true') {
                $('#disable-spoiler>input').attr('checked','checked');
            }
        }
        if (localStorage.disable_image_spoiler === 'true') {
            $(document).ready(function () {
                $('.post-image').each(unspoilerThumbnail);
            });
            $(document).on('new_post', function (e, post) {
                $(post).find('.post-image').each(unspoilerThumbnail);
            });
        }
    }

})(window.jQuery)
