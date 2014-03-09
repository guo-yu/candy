![Candy](./public/logo.jpg) ![](https://badge.fury.io/js/candy.png)
---

基于多说社交评论的社会化论坛系统，采用 Node.js/Mongodb 构建

- [Getcandy.org: 全新Candy官方社区](http://getcandy.org)
- [Candy introduction in English](https://github.com/turingou/candy/blob/master/README.en.md)

![screenshot](http://ww2.sinaimg.cn/large/61ff0de3gw1e7gysyptnkj20wf0nj0wu.jpg)

### 如何安装
````
$ npm install candy
````

### 尝试使用 Candy
我们推荐，把 Candy 当做一个普通模块来看待，通过 `npm install candy` 安装后，在模块外部新建一个启动脚本的方式运行candy的服务，这样，你就可以方便的通过这个命令再次更新candy的主程序，而不影响原有配置，达到无缝升级的目的。

#### 如何开始
我们来试试看用这种方式启动 candy，仓库里有一份为你准备好的启动服务脚本，我们可以把他复制到candy的父目录，然后运行这个文件以启动服务。
````
$ mkdir candy && cd candy
$ npm install candy
$ cp node_modules/candy/app.sample.js ./app.js
$ vi app.js
````
#### 配置启动脚本
打开 `app.js` 这个文件，我们可以看到如下配置：

````javascript
var Candy = require('candy');

new Candy({
    // 站点名称
    name: 'Mycandy',
    // 站点介绍
    desc: 'some desc',
    // 站点永久链接（线上环境使用）
    url: 'http://abc.com',
    // 可选：当设置为production时，站点首页会被指向到上方设置的url
    env: 'production', 
    // 数据库配置
    database: {
        // 数据库名
        name: 'mycandyDB',
        // 可选：数据库地址，默认为Localhost
        host: 'http://abc.com',
        // 可选：默认为27017
        port: 23333,
        // 可选：填入数据库用户名密码等设置
        options: {
            // 请查看moogoose文档
        }
    },
    // 多说配置
    duoshuo: { 
        // 你的多说 [short_name]
        short_name: 'xxx',
        // 你的多说 [secret]
        secret: 'xxx'
    }
});

myCandy.run(9999); // 在特定端口启动服务
````
由于默认启动脚本中已经配置了用于测试的多说站点，所以我们可以直接启动服务，
使用 `node app.js` 方式直接启动服务

````
$ node app.js // 或者使用 forever, pm2 之类的守护程序来启动永久服务
````
使用 `pm2` 或者 `forever` 等守护程序保持服务的持久化：

````
$ forever start app.js // 或者 pm2 start app.js -i max
````
#### 升级 Candy
在Candy启动脚本的同级目录，运行 `$ npm install candy` 会自动安装最新版本的 Candy 程序

#### 定制属于你自己的 candy

- 1. 找到 `/public` 文件夹，这个文件夹中的文件都是静态资源文件，你可以先把 `logo.png` 换成自己的，然后慢慢修改样式表
- 2. 访问网站，使用一个社交网络账户登录，第一个登录的账户会被跳转到 `/admin` 管理后台。
- 3. 点击我的#{site.name}，会自动同步该用户的社交网络信息。
- 2. 再次访问 `/admin` 管理面板，如果你要修改默认配置的站点名称，或者描述的话
    - 新增一个板块
    - 开始新建帖子吧
    - 探索一下这个小程序，然后给我提个bug或者建议 ~

### Candy 特色

- 响应式设计，移动优先
- 极其容易安装
- 存在云上的评论（不用担心评论丢失）
- 用户可以关注自己感兴趣的板块或，帖子，或者其他用户（正在编码）
- 丰富的界面和良好的用户体验

### Demo 网站

- [Candy 官方社区](http://getcandy.org)

### 截图

#### 首页
![](http://ww2.sinaimg.cn/large/61ff0de3gw1e7gyt8g45pj20wf0njwid.jpg)

#### 管理面板
![](http://ww4.sinaimg.cn/large/61ff0de3jw1e7fos2mr2wj20ur0oln18.jpg)

#### 附件上传界面
![](http://ww2.sinaimg.cn/large/61ff0de3gw1e81cdo3ibij20vs0p4djx.jpg)

### 欢迎提交 Pull Request !

- fork 这个仓库
- 添加自己想要的功能，在不破坏基本结构的情况下
- 确保自己添加的功能已经经过 人工/单元 测试!
- 然后给我提交 Pull Request 就行啦!

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