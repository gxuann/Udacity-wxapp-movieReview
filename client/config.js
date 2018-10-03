/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://rdazgryz.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 拉取用户信息
    user: `${host}/weapp/user`,

    // 拉取电影信息
    hotMovies: `${host}/weapp/hotMovies`,

    // 拉去电影详情
    moviesDetail: `${host}/weapp/moviesDetail/`,

    // 拉去热门电影列表
    moviesList: `${host}/weapp/moviesList`,

    // 拉去电影评价列表
    commentsListItem: `${host}/weapp/commentsListItem`,

    // 提交电影评价
    addComment: `${host}/weapp/addComment`,

    // 获取电影评价
    getComment: `${host}/weapp/getComment`,

    // 收藏电影
    setCollect: `${host}/weapp/addCollect`,

    // 查询是否收藏
    noCollect: `${host}/weapp/noCollect`,

    // 查询是否评论 
    noaCollect: `${host}/weapp/noaCollect`,

    // 取消收藏
    cancCollect: `${host}/weapp/cancCollect`,

    // 电影收藏列表
    getCollectList: `${host}/weapp/getCollectList`,

    // 影评详情
    getCommDetails: `${host}/weapp/getCommDetails`,

    // 电影评价列表
    getComments: `${host}/weapp/getComments`,

    // 电影评价列表
    getUserComments: `${host}/weapp/getUserComments`,

    // 已发布列表
    getUserReported: `${host}/weapp/getUserReported`,
    // 上传接口
    uploadUrl: `${host}/weapp/upload`,

  }
};

module.exports = config;
