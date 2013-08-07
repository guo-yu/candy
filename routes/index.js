// index page
module.exports = function(req, res){
  res.render('index',{
    boards: [{
        url: 'demo',
        title: 'demo board',
        desc: 'sqwsqwsqwsqwsqwsqwsqws',
        banner: 'http://abc.com/123',
        threads: [{
            title: 'sqwsqwsqwssqws sqwsqwsqw',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        },{
            title: '123',
            content: 'sqwsqwsqwssqws sqwsqwsqw sqsqws sqwsqws sqwsqws'
        }]
    }]
  });
};