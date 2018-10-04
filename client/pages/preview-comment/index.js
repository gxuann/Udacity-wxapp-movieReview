// pages/preview-comment/index.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    comment: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let comment = {
      id: options.id,
      title: options.title,
      image: options.image,
      recomments: options.erecomments,
      video: decodeURIComponent(options.video),
      cmt: options.cmt
    }
    this.setData({
      comment: comment
    })
  },
  // 播放声音
  replay: function (e) {
    let comment = this.data.comment
    innerAudioContext.autoplay = true
    let getName = e.target.dataset.name
    if (getName === "play") {
      innerAudioContext.src = comment.video,
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
      return
    }
  },
  reEditCom() {
    wx.navigateBack()
  },
  addComment() {
    let content = this.data.comment
    if (content.cmt === "yp") {
      this.putVideo()
    } else {
      this.postComm()
    }
  },
  postComm(commvideo) {
    let content = this.data.comment
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'POST',
      data: {
        video: decodeURIComponent(commvideo),
        content: content.recomments,
        movie_id: content.id,
        cmt: content.cmt
      },
      success: result => {
        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '发表评论成功'
          })
          wx.navigateTo({
            url: `/pages/comment-list/index?id=${this.data.comment.id}&view=${1}`,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      },
      fail: (error) => {
        console.log("error:")
        console.log(error)

        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
      }
    })
  },
  putVideo() {
    let comment = this.data.comment

    wx.showLoading({
      title: '正在上传录音'
    })
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: comment.video,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: (res) => {
        let response = JSON.parse(res.data);
        if (response.code === 0) {
          wx.showToast({
            icon: 'none',
            title: '上传成功'
          })
          this.postComm(encodeURIComponent(response.data.imgUrl))
        } else {
          console.log(response);
          wx.showToast({
            icon: 'none',
            title: '上传失败！！请重试。。'
          })
        }
        wx.hideLoading()
      },
      fail: (res) => {
        console.log('fail', res);
        wx.hideLoading()
      },
      complete: () => {
        wx.hideLoading();
      },
    });

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