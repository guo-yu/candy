![logo](http://ww1.sinaimg.cn/large/61ff0de3gw1e7d9luh49bj201201bdfm.jpg) Candy ![](https://badge.fury.io/js/candy.png)
---

a micro bbs system based on duoshuo.com apis

### How to install

````
$ npm install candy
````

### Bite a litter

#### Sample code

````javascript
var candy = require('candy').server;

var myCandy = new candy.server({
    name: 'My candy BBS', // 站点名称
    url: 'http://abc.com', // 站点url
    desc: 'some desc', // 站点描述
    duoshuo: { 
        short_name: 'xxx', // 多说 short_name
        secret: 'xxx' // 多说 secret
    }
});

myCandy.run(9999);
````

### Pull Request Welcome !

- fork this repo
- feel free to add your feature or emoticons
- make sure your feature are fully tested!
- send me a PR, and enjoy !

### Candy demo site

- [Teslaer: tesla电动车中国爱好者社区](http://teslaer.com)