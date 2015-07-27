export default function({ app, express, Thread, Media }) {
  var Route = express.Router()

  // => /media
  // API: create media file
  Route.post('/', (req, res, next) => {
    if (!res.locals.user) 
      return next(new Error('signin required'))
    if (!req.files.media) 
      return next(new Error('404'))

    var file = req.files.media

    media.create({
      name: file.name,
      type: file.mimetype,
      src: file.path,
      url: file.path.substr(file.path.lastIndexOf('/uploads')),
      user: res.locals.user._id,
      size: file.size
    }).then(baby => {
      res.json({
        stat: 'ok',
        file: baby
      })
    }).catch(next)
  })

  // => /media/:media
  // TODO: 这里还要控制一个如果保存在云上的话，要重定向到云，或者从云上拿下来返回
  Route.get('/:media', (req, res, next) => {
    if (!req.params.media) 
      return next(new Error('404'))

    media.findByIdAsync(req.params.media)
      .then(done)
      .catch(next)

    function done(file) {
      if (!file) 
        return next(new Error('404'))

      var isPublicFile = (file.status && file.status === 'public') || (file.stat && file.stat === 'public')
      if (!isPublicFile) 
        return next(new Error('抱歉，此文件不公开...'))

      media.countDownload(file)
        .then(() => {
          res.download(file.src, file.name)
        })
        .catch(next)
    }
  })

  return Route
}
