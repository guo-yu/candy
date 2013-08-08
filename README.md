![logo](http://ww1.sinaimg.cn/large/61ff0de3gw1e7d9luh49bj201201bdfm.jpg) Candy ![](https://badge.fury.io/js/candy.png)
---

a micro bbs system based on duoshuo.com apis

![screenshot](http://ww3.sinaimg.cn/large/61ff0de3jw1e7fov9mphrj20ur0olwin.jpg)

### How to install

````
$ npm install candy
````

### Bite a litter

#### Start a candy server by defalut 

I've prepare a script for you: 

````
$ git clone https://github.com/turingou/candy.git
$ cd candy
$ vi server.js // edit configs
$ node server.js
````
or by NPM

````
$ npm install candy
$ cd node_modules/candy
$ vi server.js // edit configs
$ node server.js
````

#### Start a candy server by `require`

````javascript
var Candy = require('candy');

var myCandy = new Candy.server({
    name: 'My candy BBS', // site name
    url: 'http://abc.com', // site URL
    desc: 'some desc', // site description
    database: {
        name: 'mycandyDB' // database name
    },
    duoshuo: { 
        short_name: 'xxx', // your duoshuo.com [short_name]
        secret: 'xxx' // your duoshuo.com [secret]
    }
});

myCandy.run(9999);
````
then save it to `candy.js`.

````
$ node candy.js // or forever start candy.js
````

#### Make your custom candy

- 1. find `/public` folder and change `logo.png` to yours
- 2. visit `/admin` panel to edit configs (site name , desc , etc.)
    - add boards or edit defalut borard desc.
    - write a thread and try to post it
    - explore and enjoy ~

### Pull Request Welcome !

- fork this repo
- feel free to add your feature
- make sure your feature are fully tested!
- send me a PR, and enjoy !

### Candy demos

- [Teslaer: tesla电动车中国爱好者社区](http://teslaer.com) (now building...)

### Candy features

- mobile first
- easy to install and config
- comments on the cloud
- follow tags/boards supported
- sexy and friendly user-interface

### Screenshots

#### Admin panel
![](http://ww4.sinaimg.cn/large/61ff0de3jw1e7fos2mr2wj20ur0oln18.jpg)