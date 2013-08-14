![logo](http://ww1.sinaimg.cn/large/61ff0de3gw1e7d9luh49bj201201bdfm.jpg) Candy ![](https://badge.fury.io/js/candy.png)
---

基于多说社交评论的简易论坛

[Candy 官方社区](http://candy.menkr.com)

![screenshot](http://ww2.sinaimg.cn/large/61ff0de3gw1e7gysyptnkj20wf0nj0wu.jpg)

### 如何安装

````
$ npm install candy
````

### 尝试一下

#### 启动默认服务

仓库里有一份为你准备好的启动服务脚本

````
$ git clone https://github.com/turingou/candy.git
$ cd candy
$ vi server.js // 编辑配置
$ node server.js
````
也可以通过NPM来安装

````
$ npm install candy
$ cd node_modules/candy
$ vi server.js // 编辑配置
$ node server.js
````

#### 通过 require 来启动服务

````javascript
var Candy = require('candy');

var myCandy = new Candy.server({
    name: 'My candy BBS', // 站点名称
    url: 'http://abc.com', // 站点永久链接（线上环境使用）
    desc: 'some desc', // 站点介绍
    database: {
        name: 'mycandyDB' // 数据库名称
    },
    duoshuo: { 
        short_name: 'xxx', // 你的多说 [short_name]
        secret: 'xxx' // 你的多说 [secret]
    }
});

myCandy.run(9999); // 在特定端口启动服务
````
然后保存为一个js文件，比如 `candy.js`.

````
$ node candy.js // 或者使用 forever 之类的守护程序来启动永久服务
````

#### 定制属于你自己的 candy

- 1. 找到 `/public` 文件夹，这个文件夹中的文件都是静态资源文件，你可以先把 `logo.png` 换成自己的，然后慢慢修改样式表
- 2. 访问网站，使用一个社交网络账户登录，第一个登录的账户会被跳转到 `/admin` 管理后台。
- 3. 点击我的#{site.name}，会自动同步该用户的社交网络信息。
- 2. 再次访问 `/admin` 管理面板，如果你要修改默认配置的站点名称，或者描述的话
    - 新增一个板块
    - 开始新建帖子吧
    - 探索一下这个小程序，然后给我提个bug或者建议 ~

### 特点

- 响应式设计，移动优先
- 极其容易安装
- 存在云上的评论（不用担心评论丢失）
- 用户可以关注自己感兴趣的板块或，帖子，或者其他用户（正在编码）
- 丰富的界面和良好的用户体验

### Demo 网站

- [Candy 官方社区](http://candy.menkr.com)
- [Teslaer: tesla电动车中国爱好者社区](http://teslaer.com) (now building...)

### 截图

#### 首页
![](http://ww2.sinaimg.cn/large/61ff0de3gw1e7gyt8g45pj20wf0njwid.jpg)

#### 管理面板
![](http://ww4.sinaimg.cn/large/61ff0de3jw1e7fos2mr2wj20ur0oln18.jpg)

### 欢迎提交 Pull Request !

- fork 这个仓库
- 添加自己想要的功能，在不破坏基本结构的情况下
- 确保自己添加的功能已经经过 人工/单元 测试!
- 然后给我提交 Pull Request 就行啦!