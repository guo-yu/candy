window.candy = angular.module('candy', ['store']);

// global ctrlers
candy['ctrlers'] = {
    search: function($scope,Store) {
        $scope.fetch = function() {
            console.log('changed')
            console.log($scope.search.keyword)
        }
    },
    board: {
        ls: function($scope,Store) {
            $scope.ls = function() {
                Store.board.get({
                    action: 'ls'
                }, function(result) {
                    console.log(result);
                });
            }
        }
    }
}