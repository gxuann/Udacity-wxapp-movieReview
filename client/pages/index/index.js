// pages/user/user.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    getComment: null,
    gethotmovie: {}
  },
  onPullDownRefresh() {
    this.getMovieLists(() => {
      wx.stopPullDownRefresh()
    })
  },
  tabbarHot() {
    wx.navigateTo({
      url: '/pages/hot/index',
    })
  },
  tabbarUser() {
    wx.navigateTo({
      url: '/pages/user/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieLists()
  },
  topDetail() {
    let getMovieId = this.data.gethotmovie.id
    let getMovieTitle = this.data.gethotmovie.title
    let getMovieImage = this.data.gethotmovie.image

    let getListComm = this.data.getComment
    let getCommentHead = getListComm.avatar
    let getCommentName = getListComm.username
    let getCommentContent = getListComm.content
    let getCommentOpenId = this.data.userInfo.openId
    let getCmt = getListComm.cmt
    let getVideo = getListComm.video
    if (!!getListComm) {
      if (getMovieId) {
        wx.navigateTo({
          url: `/pages/top-detail/top-detail?id=${getMovieId}&title=${getMovieTitle}&image=${getMovieImage}&avatar=${getCommentHead}&username=${getCommentName}&content=${getCommentContent}&openId=${getCommentOpenId}&cmt=${getCmt}&video=${getVideo}`,
        })

      } else {
        wx.showToast({
          title: '页面失效',
        })
      }
    } else {
      console.log(getListComm)
    }
  },
  hometap() {
    let getMovieId = this.data.gethotmovie.id
    let getMovieTitle = this.data.gethotmovie.title
    let getMovieCategory = this.data.gethotmovie.category
    let getMovieImage = this.data.gethotmovie.image
    let getMovieDescription = this.data.gethotmovie.description
    wx.navigateTo({
      url: `/pages/movie-detail/index?id=${getMovieId}&title=${getMovieTitle}&category=${getMovieCategory}&image=${getMovieImage}&description=${getMovieDescription}`,
    })
  },
  getComment(id) {
    qcloud.request({
      url: config.service.getComment,
      data: {
        comment_id: id
      },
      success: result2 => {
        if (!result2.data.code) {
          this.setData({
            getComment: result2.data.data
          })
        }
      },
      fail: result2 => {
        wx.showToast({
          title: '评论数据加载失败',
        })
      }
    })
  },
  getMovieLists(callback) {
    wx.showLoading({
      title: '数据加载中',
    })
    qcloud.request({
      url: config.service.hotMovies,
      success: result => {
        wx.hideLoading()
        if (!result.data.code && !!result.data.data) {
          this.setData({
            gethotmovie: result.data.data[0]
          })
          this.getComment(result.data.data[0].id)

        } else {
          wx.showToast({
            title: '热门电影加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
        })
        console.log(result)
      },
      complete: () => {
        typeof callback === 'function' && callback()
      }
    })
  },
  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        this.getMovieLists()
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

})