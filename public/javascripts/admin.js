candy.controller('adminSetting', function($scope, Store) {
    $scope.btns = {
        edit: {
            icon: 'icon-ok',
            text: '确认编辑'
        }
    }
    $scope.update = function() {
        $scope.btns.edit.icon = 'icon-spin icon-spinner'
        $scope.btns.edit.text = '请稍等...'
        Store.setting.save({
            setting: $scope.setting
        }, function(result) {
            if (result.stat === 'error') return alert('没有编辑成功，请稍后再试')
            $scope.btns.edit.icon = 'icon-smile'
            $scope.btns.edit.text = '已经成功编辑'
            $scope.setting = result;
        })
    }
});

candy.controller('adminBoard', function($scope, Store) {
    $scope.btns = {
        new: {
            icon: 'icon-ok',
            text: '确认新建'
        }
    };
    $scope.add = function() {
        $scope.btns.new.icon = 'icon-spin icon-spinner'
        $scope.btns.new.text = '请稍等...'
        Store.board.save({
            board: $scope.board.new
        }, function(result) {
            if (result.stat !== 'ok') return alert(result.error.toString());
            $scope.btns.new.icon = 'icon-smile'
            $scope.btns.new.text = '已经成功新建'
            setTimeout(function() {
                window.location.reload()
            }, 500);
        })
    }
});
