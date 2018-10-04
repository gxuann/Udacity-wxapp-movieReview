// pages/hot/index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listhotmovie: []
  },
  onPullDownRefresh() {
    this.getMoviesList(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoviesList()
  },
  getMoviesList(callback) {
    wx.showLoading({
      title: '热门数据加载中...',
    })
    qcloud.request({
      url: config.service.moviesList,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            listhotmovie: result.data.data
          })
        } else {
          wx.showToast({
            title: '数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
        })
      },
      complete: () => {
        typeof callback === 'function' && callback()
        wx.showToast({
          title: '数据加载成功',
        })
      }

    })
  },
})