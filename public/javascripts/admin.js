candy.ctrlers['admin'] = {
    setting: function($scope, Store) {
        $scope.update = function() {
            Store.setting.save({
                setting: $scope.setting
            }, function(result) {
                $scope.setting = result;
            })
        }
    },
    board: function($scope, Store) {
        $scope.btns = {
            new: {
                icon: 'icon-ok',
                text: '确认新建'
            }
        }
        $scope.add = function() {
            $scope.btns.new.icon = 'icon-spin icon-spinner'
            $scope.btns.new.text = '请稍等...'
            Store.board.save({
                action: 'new',
                board: $scope.board.new
            }, function(result) {
                if (result.stat == 'ok') {
                    $scope.btns.new.icon = 'icon-smile'
                    $scope.btns.new.text = '已经成功新建'
                    setTimeout(function(){
                        window.location.reload()
                    },800);
                }
            })
        }
    },
    user: function($scope, Store) {
        $scope.update = function() {
            Store.setting.save({
                setting: $scope.setting
            }, function(result) {
                $scope.setting = result;
            })
        }
    }
}