[![Candy](./public/logo.jpg)](http://getcandy.org)
---
![](https://badge.fury.io/js/candy.png)

[Candy](http://getcandy.org) 是基于多说社交评论的社会化论坛系统，采用 Node.js/Mongodb 构建。营造简洁、实用、具有人情味的下一代论坛系统，是 Candy 的设计目标。

![screenshot@0.1.7](http://ww3.sinaimg.cn/large/61ff0de3gw1eecbmchccdj20zq0nwtcu.jpg)

### 安装 Candy

你可以选择两种方式安装 Candy，将 Candy 视为一个 NPM 模块，在外部使用启动脚本启动。或者将整个仓库复制到本地直接运行启动文件。
这两种方式各有各的好处，如果你是个谨慎的使用者，并不希望频繁升级 Candy 核心文件，我推荐你采用第二种方式安装。
> 在尝试下面两种安装方式前，您首先需要安装Node.js和MongoDB到本地

1.将 Candy 仓库复制到本地并运行启动脚本
```
$ git clone https://github.com/turingou/candy.git
$ cd candy
$ npm install
$ node app.js
```

2.将 Candy 视为 NPM 模块安装，在外部使用启动脚本启动，我已经为你准备了一个现成的启动脚本：
````
$ mkdir candy && cd candy
$ npm install candy
$ cp node_modules/candy/app.sample.js ./app.js
$ node app.js
````
无论你以何种方式启动，你将在默认的端口看到一个全新的 Candy 正在静候你的初次访问。现在，使用浏览器访问 [localhost:3000](http://localhost:3000) 你将能看到一个全新的 Candy Demo。

### 升级 Candy

无论你使用何种方式安装 Candy，都可以使用 NPM 或 Git 方便地进行升级。升级操作通常需要在 Candy 的安装目录进行，我们架设你的安装目录是 `/www/candy`，让我们将 Candy 升级到最新版本吧：

如果你使用 Git clone Candy：
```
$ cd /www/candy
$ git pull
```

如果你使用 NPM 安装 Candy，采用这种方法升级可能会导致你在 `/www/candy/node_modules/candy/node_modules` 文件夹下的自定义主题被覆盖，所以应确保在升级之前，备份你的自定义主题。
```
$ cd /www/candy
$ npm install candy@latest
```

### 配置 Candy

配置 Candy 是一条必经之路，没有一个主题或者配置清单可以适应所有的使用环境。因此，在将你的论坛搭建上生产环境服务器之前，确保通读这份配置指引。

#### 管理员用户
第一个登录的用户会是 Candy 的管理员用户，确保你使用正确的社交网络账户登录 Candy，就可以开始自定义论坛了。
你可以在登录后的右侧菜单找到进入 管理面板 的入口，或者访问 [localhost:3000/admin](http://localhost:3000/admin) 进入管理面板。

#### 启动脚本 `app.js`

配置脚本负责启动你的 Candy 论坛。这意味着在变更某些配置之后，你可能需要重新启动配置脚本。这个文件通常是 `app.js`。

#### 配置文件 `configs.json`

配置文件是启动脚本使用的初始配置，Candy 使用一个 `json` 文件当做配置文件。这个文件里规定了论坛初始化时的名字，简介，永久链接，运行环境，数据库信息等等内容。

如果你采用直接 clone 仓库的方式安装 Candy，配置文件为 `./configs.json`，当然，你也可以将 Candy 视为 NPM 模块安装。这样的话，你可以在启动文件中传入配置参数，这里的配置参数与配置文件中的参数名称、规则相同。

这是配置文件 `configs.json` 的范例：
````javascript
{
  "name": 'Candy',
  "port": 3000,
  "desc": 'some description for your very new Candy forum',
  "public": "./public",
  "uploads": "./public/uploads",
  "views": "./node_modules/candy-theme-flat",
  "database": {
    "name": 'candy'
  },
  "session": {
    "store": true
  },
  "duoshuo": {
    "short_name": 'xxx',
    "secret": 'xxx'
  }
});
````
让我们来看看配置文件 `configs.json` 中的具体参数

##### configs#name [String] 站点名称
##### configs#desc [String] 站点介绍
##### configs#port [Number] 运行端口 (默认为 3000)
##### configs#public [String] 静态资源目录 (默认为 `./public`)
##### configs#uploads [String] 附件上传目录 (默认为 `./public/uploads`)
##### configs#views [String] 默认主题目录 (默认为 `./node_modules/candy-theme-flat`)
##### configs#url [String] 站点永久链接
这是一个以 http 或 https 开头的 URL，这个 URL 只有在你将站点的运行环境设定为 `production` 时才会变成站点的根。

##### configs#env [String] 站点运行环境 `development`(默认) 或 `production`
这个键指定了 Candy 的运行环境，当设定为 `production` 时将启动生产环境缓存策略，日志方案和压缩方案，并使用指定的 `configs#url` 作为站点根。

##### configs#database [Object] 数据库信息
Candy 采用 Mongodb 构建。这是储存论坛数据库信息的对象。包括
- database.name [String] 数据库名称（必要）
- database.host [String] 数据库地址
- database.port [Number] 数据库运行端口
- database.options [Object] 数据库配置选项（参见 [moogoose 文档](http://mongoosejs.com/docs/connections.html)）

##### configs#session [Object] session 持久化相关信息
- session.store [Boolean] 是否使用 Conenct-Mongo 做 session 持久化 (默认为 `false`)

##### configs#duoshuo [Object] 多说相关信息
Candy 基于多说社交评论构建，因此，你需要提供一个多说 `short_name` 和相应的 `secret`

- duoshuo.short_name [String] 多说 `short_name` (必要)
- duoshuo.secret [String] 多说 `secret`（必要）

### Candy 主题系统

Candy 构建于 Theme 主题系统之上。这意味着你可以编写 NPM 模块，作为 Candy 的主题，并发布到 NPM，使所有使用 Candy 的用户受益。

- 所有主题遵守一套命名约定，必须采用 `candy-theme-xxx` 的命名规则进行命名，并发布到 NPM。
- 所有主题都必须按照一定规范书写 `package.json` 可以参照 Candy 的默认主题 [candy-theme-flat](https://github.com/turingou/candy-theme-flat) 书写你的主题描述文件。
- 所有主题的静态资源文件夹都推荐放置于主题文件夹下的 `static` 目录。
- 所有主题模块均应位于 './node_modules' 文件夹内，小心升级模块时造成的文件覆盖。

### 欢迎提交 Pull Request

Candy 仍未达到我们期望的完善程度，欢迎一起来完善这个有趣的社会化论坛实验。

- Fork Candy
- 在不破坏基本结构的情况下，添加功能。
- 确保自己添加的功能经过 人工 或者 单元测试
- 发起 Pull Request

### MIT license
Copyright (c) 2013 turing &lt;o.u.turing@gmail.com&gt;

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
