candy.ctrlers['admin'] = {
    setting: function($scope, Store) {
        $scope.update = function() {
            Store.setting.save({
                setting: $scope.setting
            }, function(result) {
                $scope.setting = result;
            })
        }
    }
}