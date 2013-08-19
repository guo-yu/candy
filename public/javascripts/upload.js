candy.ctrlers['upload'] = function(target, cb) {

    var removeImg = function(target) {
        $(target).parents('.single-upload').fadeOut(500, function() {
            $(this).remove()
        })
    };

    $(target).fileupload({
        dataType: 'json',
        add: function(e, data) {

            data.context = $('<div class="single-upload fn-clear"><span class="file-name">' + data.files[0].name + '</span><a class="upload-now" href="javascript:void(0);">现在上传</a><a class="delete-single" href="javascript:void(0);">取消</a></div>').appendTo($('#upload-file-list')).click(function(e) {

                var target = e.target;

                if (target.className == 'upload-now') {

                    $('#progress .bar').css('width', '0%');

                    $(target).next('a.delete-single').remove();

                    data.submit();

                } else if (target.className == 'delete-single') {
                    removeImg(target);
                } else if (target.className == 'uploaded-img') {
                    $('#cke_46_textInput').val($(target).attr('src'))
                } else {
                    return false;
                }

                e.stopPropagation();

            });
        },
        progressall: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css('width', progress + '%');
        },
        done: function(e, data) {
            if (data.result.stat == 'ok') {
                data.context.find('.upload-now').replaceWith($('<span class="upload-success" data-url="' + data.result.url + '"/>').text('上传成功'));
                data.context.find('.file-name').replaceWith($('<img class="uploaded-img" src="' + data.result.url + '" style="max-width:200px;"/>'));
                cb(data.result.url);
            } else {
                alert(data.result.msg)
            }
        }
    });

}