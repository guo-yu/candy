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
                    Store.thread.common.save({
                        action: 'new',
                        thread: $scope.thread
                    }, function(result) {
                        if (result.stat == 'ok') {
                            alert('话题新建成功');
                            window.location = '/thread/' + result.thread._id;
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
    },
    edit: function($scope, Store) {
        var content = angular.element('#edit textarea').text();
        if (content && window.editor) {
            window.editor.codemirror.setValue(content);
        }
        $scope.update = function() {
            $scope.thread['content'] = window.editor.codemirror.getValue();
            Store.thread.single.save({
                tid: $scope.thread.id,
                action: 'update',
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
            Store.thread.single.remove({
                action: 'remove',
                tid: id
            },function(result){
                if (result.stat == 'ok') {
                    alert('您已成功删除此帖');
                    window.location = '/';
                } else {
                    alert('出现错误，请查看控制台');
                    console.log(result.error)
                }
            })
        }
    }
}

jQuery(document).ready(function($) {
    candy.ctrlers.thread.editor();
});