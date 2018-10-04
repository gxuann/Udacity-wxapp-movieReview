// pages/movie-detail/index.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvdetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!!options.id) {
      this.getMovieDetails(options.id)

    } else {
      wx.navigateBack()
    }
  },
  getMovieDetails(id) {
    wx.showLoading({
      title: '数据加载中',
    })
    qcloud.request({
      url: config.service.moviesDetail + id,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            mvdetail: data.data,
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
  // 展示影评列表
  toCommentList() {
    let mvdeailId = this.data.mvdetail.id
    wx.navigateTo({
      url: `/pages/comment-list/index?id=${mvdeailId}`,
    })
  },

  toAddComment() {
    let commentType = ""
    let mvdetail = this.data.mvdetail
    let mvdeailId = mvdetail.id
    let mvdeailTitle = mvdetail.title
    let mvdeailImage = mvdetail.image
    let mvdeailVideo = ""
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
  },

  addComment() {
    let mvdetail = this.data.mvdetail
    let mvdeailId = mvdetail.id
    qcloud.request({
      url: config.service.noaCollect,
      data: {
        moviesId: mvdeailId
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          if (!data.data) {
            console.log("没有评价过")
            this.toAddComment()
          } else {
            console.log("已经评论过了！")
            setTimeout(() => {
              wx.showToast({
                icon: 'none',
                title: '你已经评论过这个影片了，跳转到评论列表中…',
              })
            }, 2000)
            this.toCommentList()
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据查询失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '数据查询失败'
        })
      }
    })
  },
})