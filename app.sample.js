var candy = require('candy');

candy({
    "name": "Candy",
    "port": 3000,
    "desc": "简单优雅的次世代论坛",
    "views": "./node_modules/candy-theme-flat",
    "public": "./public",
    "uploads": "./public/uploads",
    "database": {
        "name": "candy"
    },
    "session": {
        "store": true
    },
    "duoshuo": {
        "short_name": "candydemo",
        "secret": "055834753bf452f248602e26221a8345"
    }
})