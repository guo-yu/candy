
// global ctrlers
var candy = angular.module('candy', ['store'])

.controller('search', function($scope, Store) {
    $scope.fetch = function() {
        console.log($scope.search.keyword)
    }
})

.controller('boards', function($scope, Store) {
    $scope.open = false;
    $scope.arrow = 'icon-circle-arrow-down';
    $scope.list = function() {
        if (!$scope.open) {
            if (!$scope.boards) {
                $scope.arrow = 'icon-spinner icon-spin';
                Store.board.get({}, function(result) {
                    if (result.stat !== 'ok') return false;
                    $scope.boards = result.boards;
                    $scope.open = true;
                    $scope.arrow = 'icon-circle-arrow-up';
                });
            } else {
                $scope.open = true;
                $scope.arrow = 'icon-circle-arrow-up';
            }
        } else {
            $scope.open = false;
            $scope.arrow = 'icon-circle-arrow-down';
        }
    }
});