candy.ctrlers['thread'] = {
    editor: function() {
        window.editor = new Editor();
        window.editor.render();
    },
    new: function($scope, Store) {
        $scope.create = function() {
            var thread = $scope.thread;
            if (thread && thread.name) {
                thread['content'] = window.editor.codemirror.getValue();
                if (thread.content) {
                    Store.thread.save({
                        action: 'new',
                        thread: $scope.thread
                    }, function(result) {
                        if (result.stat == 'ok') {
                            alert('话题新建成功');
                            window.location = './' + result.thread._id;
                        } else {
                            alert('数据库出现错误，请查看控制台');
                            console.log(result.error)
                        }
                    })
                } else {
                    alert('写点什么再提交吧')
                }
            } else {
                alert('写点什么再提交吧')
            }
        }
    }
}

jQuery(document).ready(function($) {
    candy.ctrlers.thread.editor();
});