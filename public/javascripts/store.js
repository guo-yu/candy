angular.module('store', ['ngResource']).factory('Store', function($resource) {
    return {
        user: $resource('/user', {}),
        board: $resource('/board', {}),
        thread: $resource('/thread', {}),
        setting: $resource('/setting', {})
    }
});
