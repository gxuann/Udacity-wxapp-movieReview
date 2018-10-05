// pages/comment-list/index.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: null,
    comments: [],
    details: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.view) {
      this.getCommentsListItem(options.id)
    }
    if (!!options.view) {
      this.getCommentsList(options.id)
    }
  },
  getMovie(index) {
    // 评论内容
    let comment = this.data.comments[index]
    // 电影详情
    let detail = this.data.details

    let getMovieId = comment.movie_id
    let getMovieTitle = detail.title
    let getMovieImage = detail.image
    let getCommentHead = comment.avatar
    let getCommentName = comment.username
    let getCommentContent = comment.content
    let getCommentOpenId = comment.user
    let getCmt = comment.cmt
    let getVideo = encodeURIComponent(comment.video)
    wx.navigateTo({
      url: `/pages/comment-detail/index?id=${getMovieId}&title=${getMovieTitle}&image=${getMovieImage}&avatar=${getCommentHead}&username=${getCommentName}&content=${getCommentContent}&openId=${getCommentOpenId}&cmt=${getCmt}&video=${getVideo}`,
    })
  },
  // 播放声音
  replay: function (e) {
    let comments = this.data.comments
    let getIndex = parseInt(e.target.dataset.index)
    innerAudioContext.autoplay = true
    let getName = e.target.dataset.name
    if (getName === "replay") {
      innerAudioContext.src = this.data.comments[getIndex].video
      innerAudioContext.play()
    }
  },
  replayx(e) {
    let comments = this.data.comments
    let getIndex = parseInt(e.target.dataset.index)
    innerAudioContext.autoplay = true
    let getName = e.target.dataset.name
    innerAudioContext.src = this.data.comments[getIndex].video,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  gotoDetail: function (e) {
    let comments = this.data.comments
    let getIndex = parseInt(e.target.dataset.index)
    // 判断选择区域
    let getName = e.target.dataset.name
    if (getName === "play") {
      this.replayx(e)
      return
    }

    if (isNaN(getIndex)) return
    let id = comments[getIndex].movie_id
    // 先获取电影
    qcloud.request({
      url: config.service.moviesDetail + id,
      success: result => {

        let data = result.data
        let commentsx = data.data
        if (!data.code && !!data.data) {
          this.setData({
            details: commentsx,
          })
          this.getMovie(getIndex)
        } else {
          wx.showToast({
            title: '拉取失败，请重试'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '访问失败'
        })
      }
    })
  },
  getCommentsList(id) {
    qcloud.request({
      url: config.service.getUserComments,
      data: {
        moviesId: id
      },
      success: result => {

        let data = result.data
        let comments = data.data
        if (!data.code && !!data.data) {
          this.setData({
            comments: comments,
          })
        } else {
          wx.showToast({
            title: '跳转失败'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.showToast({
          title: '页面跳转失败'
        })
      }
    })
  },
  getCommentsListItem(id) {
    wx.showLoading({
      title: '评论数据加载中...',
    })
    qcloud.request({
      url: config.service.commentsListItem,
      data: {
        comment_id: id
      },
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            comments: result.data.data
          })
        } else {
          wx.showToast({
            title: '评论数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '评论数据加载失败',
        })
      }
    })
  }
})