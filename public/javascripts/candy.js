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
        list: function($scope,Store) {
            var drop = function() {
                
            }
            $scope.ls = function() {
                Store.board.get({
                    action: 'ls'
                }, function(result) {
                    if (result.stat == 'ok') {
                        $scope.boards = result.boards;
                    };
                });
            }
        }
    }
}