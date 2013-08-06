// 定义这个数据仓库
var store = angular.module('store', ['ngResource']).factory('Store', function($resource) {
  return {
    // define user api
    user: $resource('/user/:id', {id:'@uid'}),
    // define article api
    article : $resource('/article/:id', {id:'@aid'}),
    // define jsonp api
    remote : $resource('/remoteData/:id', {id:'@rid'},{
      jsonp :{
        method:'JSONP',
        params:{
          yourKey: 'yourValue'
        }
      }
    })
  }
})