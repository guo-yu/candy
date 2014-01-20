window.candy = angular.module('candy', ['store']);

// global ctrlers
candy['ctrlers'] = {
    search: function($scope, Store) {
        $scope.fetch = function() {
            console.log('changed')
            console.log($scope.search.keyword)
        }
    },
    board: {
        list: function($scope, Store) {
            $scope.open = false;
            $scope.arrow = 'icon-circle-arrow-down';
            $scope.ls = function() {
                if (!$scope.open) {
                    if (!$scope.boards) {
                        $scope.arrow = 'icon-spinner icon-spin';
                        Store.board.get({}, function(result) {
                            if (result.stat == 'ok') {
                                $scope.boards = result.boards;
                                $scope.open = true;
                                $scope.arrow = 'icon-circle-arrow-up';
                            };
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
        }
    }
}