![logo](http://ww1.sinaimg.cn/large/61ff0de3gw1e7d9luh49bj201201bdfm.jpg) Candy ![](https://badge.fury.io/js/candy.png)
---

a micro bbs system based on duoshuo.com apis [(Candy 中文说明文档)](https://github.com/turingou/candy/blob/master/README_zh-cn.md)

[Candy 官方社区](http://candy.menkr.com)

![screenshot](http://ww2.sinaimg.cn/large/61ff0de3gw1e7gysyptnkj20wf0nj0wu.jpg)

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
$ npm install // install dependencies
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

### Candy features

- mobile first
- easy to install and config
- comments on the cloud
- follow tags/boards supported
- sexy and friendly user-interface

### Candy demos

- [Candy 官方社区](http://candy.menkr.com)
- [Teslaer: tesla电动车中国爱好者社区](http://teslaer.com) (now building...)

### Screenshots

#### Home screen
![](http://ww2.sinaimg.cn/large/61ff0de3gw1e7gyt8g45pj20wf0njwid.jpg)

#### Admin panel
![](http://ww4.sinaimg.cn/large/61ff0de3jw1e7fos2mr2wj20ur0oln18.jpg)

#### Attachments uploads
![](http://ww2.sinaimg.cn/large/61ff0de3gw1e81cdo3ibij20vs0p4djx.jpg)

### Pull Request Welcome !

- fork this repo
- feel free to add your feature
- make sure your feature are fully tested!
- send me a PR, and enjoy !

### MIT license
Copyright (c) 2013 turing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.