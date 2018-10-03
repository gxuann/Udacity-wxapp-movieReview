/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
// router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
// router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
// router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
// router.post('/message', controllers.message.post)

// get 拉去一条热门电影信息
router.get('/hotMovies', validationMiddleware, controllers.getHotMovie.hotMovie)

// get 拉去一条电影详情信息
router.get('/moviesDetail/:id', validationMiddleware,controllers.getHotMovie.movieDetail)

// get 拉去所有电影信息
router.get('/moviesList', validationMiddleware, controllers.getHotMovie.moviesList)

// get 拉去一条电影得所有评论
router.get('/commentsListItem', validationMiddleware, controllers.getHotMovie.commentsListItem)

// post 拉去一条电影评论
router.post('/addComment', validationMiddleware, controllers.comment.addComment)

// get 拉去一条电影得随意一条评论
router.get('/getComment', validationMiddleware, controllers.getHotMovie.getComment)

// post 收藏影评
router.post('/addCollect', validationMiddleware, controllers.comment.addCollect)

// get 收藏影评
router.get('/getCollectList', validationMiddleware, controllers.comment.getColls)

// get 影评评价详情
router.get('/getUserComments', validationMiddleware, controllers.comment.getUserComs)

// get 拉去一条电影影评详情
router.get('/getCommDetails', validationMiddleware, controllers.getHotMovie.getComment)

// get 拉取已发布列表
router.get('/getUserReported', validationMiddleware, controllers.comment.getUserReported)

// noCollect
// 查询是否收藏
router.get('/noCollect', validationMiddleware, controllers.comment.noCollect)

// noaCollect
// 查询是否评论过
router.get('/noaCollect', validationMiddleware, controllers.comment.noaCollect)

// cancCollect
// 取消收藏
router.get('/cancCollect', validationMiddleware, controllers.comment.cancCollect)


module.exports = router
