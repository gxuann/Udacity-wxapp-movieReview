// pages/user/index.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    liststoremv: [],
    curNav: 0,
    curNav2: 0
  },
  // 展示收藏
  clickShowT: function () {
    this.setData({
      curNav: 1,
      curNav2: 0
    })
    this.getCollectList()
  },
  // 展示发布
  clickShowG: function () {
    this.setData({
      curNav2: 1,
      curNav: 1,
    })
    this.getCollectList2()
  },
  // 不展示收藏
  clickShowF: function () {
    this.setData({
      curNav2: 0,
      curNav: 0
    })
  },
  // 不展示发布
  clickShowH: function () {
    this.setData({
      curNav2: 0,
      curNav: 0,
    })
  },
  onPullDownRefresh() {
    if (this.data.curNav) {
      this.getCollectList(() => {
        wx.stopPullDownRefresh()
      })
    }
    if (this.data.curNav2) {
      this.getCollectList2(() => {
        wx.stopPullDownRefresh()
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  topDetail: function (e) {

    let getId = parseInt(e.target.dataset.index)
    let getMovieID = parseInt(e.target.dataset.id)
    let getTitle = e.target.dataset.title
    if (!getTitle) {
      wx.showToast({
        icon: 'none',
        title: '请点击电影海报进入评论详情页',
      })

      return
    }
    let getImage = e.target.dataset.image

    let comment = this.data.liststoremv[getId]
    let getCommentHead = comment.avatar
    let getCommentName = comment.username
    let getCommentContent = comment.content
    let getCommentOpenId = comment.user
    let getCmt = comment.cmt
    let getVideo = encodeURIComponent(comment.video)

    wx.navigateTo({
      url: `/pages/comment-detail/index?id=${getMovieID}&title=${getTitle}&image=${getImage}&avatar=${getCommentHead}&username=${getCommentName}&content=${getCommentContent}&openId=${getCommentOpenId}&cmt=${getCmt}&video=${getVideo}`,
    })
  },

  getCollectList(callback) {
    wx.showLoading({
      title: '加载中...',
    })
    qcloud.request({
      url: config.service.getCollectList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            liststoremv: data.data,
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.hideLoading()

        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      },
      complete: () => {
        typeof callback === 'function' && callback()
      }
    })
  },
  getCollectList2(callback) {
    wx.showLoading({
      title: '加载中...',
    })

    qcloud.request({
      url: config.service.getUserReported,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            liststoremv: data.data,
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.hideLoading()

        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      },
      complete: () => {
        typeof callback === 'function' && callback()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },
})