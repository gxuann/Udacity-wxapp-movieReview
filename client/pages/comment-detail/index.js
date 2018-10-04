// pages/comment-detail/index.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    userInfo: null,
    checkEx: -1,
    checkOk: 0,
  },
  // 播放声音
  replay: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.comment.video,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  cancCollect() {
    let comment = this.data.comment
    wx.showLoading({
      title: '正在取消收藏...'
    })
    qcloud.request({
      url: config.service.cancCollect,
      data: {
        moviesId: comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.showToast({
            icon: 'none',
            title: '取消成功'
          })
          this.setData({
            checkEx: -1,
            checkOk: 0,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '取消失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '取消失败'
        })
      }
    })
  },
  noCollect() {
    let comment = this.data.comment
    let checkEx = this.data.checkEx
    if (!(checkEx === -1) && !checkEx) {
      wx.showLoading({
        title: '请等待...'
      })
      qcloud.request({
        url: config.service.setCollect,
        login: true,
        method: 'POST',
        data: {
          title: comment.title,
          image: comment.image,
          cmt: comment.cmt,
          video: comment.video,
          content: comment.content,
          movie_id: comment.id,
        },
        success: result => {
          wx.hideLoading()

          let data = result.data

          if (!data.code) {
            wx.showToast({
              title: '收藏成功'
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏失败'
            })
          }
        },
        fail: (error) => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '收藏失败'
          })
        }
      })
      this.setData({
        checkOk: 1,
      })

    } else {
      // 显示成收藏,
      this.setData({
        checkOk: 1,
      })
    }
  },
  setCollect() {
    let comment = this.data.comment
    wx.showLoading({
      title: '请等待...'
    })
    qcloud.request({
      url: config.service.noCollect,
      data: {
        moviesId: comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            checkEx: data.data,
          })
          this.noCollect()
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据获取失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '数据获取失败'
        })
      }
    })
  },
  writeComment() {
    let commentType = ""
    let comment = this.data.comment
    let mvdeailId = comment.id
    let mvdeailTitle = comment.title
    let mvdeailImage = comment.image
    let openId = comment.openId
    let curPageOpenId = this.data.userInfo.openId
    let mvdeailVideo = ""
    if (openId !== curPageOpenId) {
      wx.showActionSheet({
        itemList: ["文字", "音频"],
        success: (res) => {
          if (!res.cannel) {
            if (res.tapIndex == 0) {
              commentType = "wz"
            } else {
              commentType = "yp"
            }
            wx.navigateTo({
              url: `/pages/add-comment/index?id=${mvdeailId}&title=${mvdeailTitle}&image=${mvdeailImage}&video=${mvdeailVideo}&cmt=${commentType}`,
            })
          }
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let comment = {
      id: options.id,
      title: options.title,
      image: options.image,
      avatar: options.avatar,
      username: options.username,
      content: options.content,
      openId: options.openId,
      cmt: options.cmt,
      video: decodeURIComponent(options.video),
    }
    this.setData({
      checkEx: -1,
      checkOk: 0,
    })
    if (Object.keys(options).length > 3) {
      this.setData({
        comment: comment
      })
    } else {
      console.log(options.id)
      this.getCommDetails(options.id)
    }
  },
  getCommDetails(id) {
    wx.showLoading({
      title: '数据加载中',
    })
    qcloud.request({
      url: config.service.getCommDetails,
      data: {
        comment_id: id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            comment: data.data,
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
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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