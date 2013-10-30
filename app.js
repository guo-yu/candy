var Candy = require('./server');

new Candy({
    name: 'Candy', // 站点名称
    url: 'http://candy.com', // 站点url
    desc: 'some desc', // 站点描述,
    database: {
        name: 'candy'
    },
    duoshuo: { 
        short_name: 'candydemo', // 多说 short_name
        secret: '055834753bf452f248602e26221a8345' // 多说 secret
    }
}).run();