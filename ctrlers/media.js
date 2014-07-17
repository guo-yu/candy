module.exports = mediaCtrler;

function mediaCtrler(models, Ctrler) {
  var Media = new Ctrler(models.media);
  var media = models.media;
  Media.read = function(id, callback) {
    media.findById(id).populate('threads').populate('user').exec(callback);
  };
  // 需要使用inc修改
  Media.countDownload = function(file, callback) {
    if (file.count) {
      file.count.download ++;
    } else {
      file.download ++;
    }
    return file.save(callback);
  };
  return Media;
}
