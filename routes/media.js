module.exports = function(deps) {

  var ctrlers = deps.ctrlers;
  var express = deps.express;

  var Media = express.Router();
  var media = ctrlers.media;

  // => /media
  // API: create media file
  Media.post('/', function(req, res, next) {
    if (!res.locals.user) return next(new Error('signin required'));
    if (!req.files.media) return next(new Error('404'));
    var file = req.files.media;
    // console.log(file);
    media.create({
      name: file.name,
      type: file.mimetype,
      src: file.path,
      url: file.path.substr(file.path.lastIndexOf('/uploads')),
      user: res.locals.user._id,
      size: file.size
    }, function(err, baby) {
      if (err) return next(err);
      res.json({
        stat: 'ok',
        file: baby
      });
    });
  });

  // => /media/:media
  // TODO: 这里还要控制一个如果保存在云上的话，要重定向到云，或者从云上拿下来返回
  Media.get('/:media', function(req, res, next){
    if (!req.params.media) return next(new Error('404'));
    media.findById(req.params.media, function(err, file) {
      if (err) return next(err);
      if (!file) return next(new Error('404'));
      if (file.stat == 'public') {
        media.countDownload(file, function(err, f) {
          if (err) return next(err);
          res.download(file.src, file.name);
        });
      } else {
        // 这里要扩充判断逻辑
        // 比如需要注册分享，需要分享等等
        if (!res.locals.user) return next(new Error('403'));
        media.countDownload(file, function(err, f) {
          if (err) return next(err);
          res.download(file.src);
        });
      }
    });
  });

  return Media;

}