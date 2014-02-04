angular.module('store', ['ngResource']).factory('Store', function($resource) {
    return {
        user: $resource('/user', {}),
        board: $resource('/board', {}),
        thread: $resource('/thread/:id', {
            id: '@id'
        }, {
            put: {
                method: 'PUT'
            }
        }),
        setting: $resource('/setting', {})
    }
});