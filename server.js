var Server = require('./app').server;

new Server({
    name: 'Candy', // 站点名称
    url: 'http://candy.com', // 站点url
    desc: 'some desc', // 站点描述
    duoshuo: { 
        short_name: 'teslaer', // 多说 short_name
        secret: '8c05de0601753a9d384645c1136a97ba' // 多说 secret
    }
}).run();