![logo](http://ww1.sinaimg.cn/large/61ff0de3gw1e7d9d8rngij201e01ejr5.jpg) Candy ![](https://badge.fury.io/js/candy.png)
---

a micro bbs system based on duoshuo.com apis

### How to install

````
$ npm install candy
````

### Bite a litter

#### Sample code

````
var candy = require('candy');

// 在9998端口启用服务

var server = new candy.server(
{
    port: 9998,
    name: xxx, // 站点名称
    url: 'http://abc.com', // 站点url
    desc: 'some desc', // 站点描述
    duoshuo: { 
        short_name: 'xxx', // 多说 short_name
        secret: 'xxx' // 多说 secret
    }
}, {
    
});
````

### Pull Request Welcome !

- fork this repo
- feel free to add your feature or emoticons
- make sure your feature are fully tested!
- send me a PR, and enjoy !

### Demos

- [Teslaer: tesla电动车中国爱好者社区](http://teslaer.com)