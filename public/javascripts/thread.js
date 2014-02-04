var uploader = function(dom, thread) {
    $(dom).fileupload({
        url: '/upload',
        dataType: 'json',
        done: function(e, data) {
            if (data.result.stat != 'ok') return alert(data.result.error);
            var file = data.result.file;
            thread.media.push(file._id);
            $('#files').append([
                "<li class='list-group-item single-file'>",
                "<a target='_blank' href='",
                file.url,
                "'>",
                file.name,
                '</a>',
                "</li>"
            ].join('\n'));
        },
        progressall: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').text(progress + '%')
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
}

candy.controller('threadCreator', function($scope, Store) {
    $scope.thread = {};
    $scope.thread['media'] = [];
    $scope.create = function() {
        var thread = $scope.thread;
        if (!thread || !thread.name) return alert('写点什么再提交吧');
        thread['content'] = window.editor.codemirror.getValue();
        if (!thread.content) return alert('写点什么再提交吧');
        Store.thread.save({
            thread: $scope.thread
        }, function(result) {
            if (result.stat == 'ok') {
                alert('话题新建成功');
                window.location = '/thread/' + result.thread._id;
            } else {
                alert('数据库出现错误，请查看控制台');
                console.log(result.error);
            }
        });
    };
    uploader('#fileupload', $scope.thread);
});

candy.controller('threadEditor', function($scope, Store) {
    $scope.thread = {};
    $scope.thread['media'] = [];
    var content = angular.element('#edit textarea').text();
    if (content && window.editor) window.editor.codemirror.setValue(content);
    $scope.update = function() {
        $scope.thread['content'] = window.editor.codemirror.getValue();
        Store.thread.put({
            id: $scope.thread.id,
            thread: $scope.thread
        }, function(result) {
            if (result.stat == 'ok') {
                alert('话题更新成功');
                window.location = '/thread/' + $scope.thread.id;
            } else {
                alert('出现错误，请查看控制台');
                console.log(result.error)
            }
        })
    };
    $scope.remove = function(id) {
        Store.thread.remove({
            id: id
        }, function(result) {
            if (result.stat == 'ok') {
                alert('您已成功删除此帖');
                window.location = '/';
            } else {
                alert('出现错误，请稍后再试');
                console.log(result.error)
            }
        })
    };
    uploader('#fileupload', $scope.thread);
});

jQuery(document).ready(function($) {
    window.editor = new Editor();
    window.editor.render();
});
