// pages/policeVideo/policeVideo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mark: false,
    num: 0,
    prompt: true,
    checkmain: false,
    mesList: [
      {
        'num': '1.',
        'con': '请勿购买涉嫌被盗抢的手机。'
      },
      {
        'num': '2.',
        'con': '虚假申诉将承担法律责任, 被盗、被抢、被骗手机将被依法扣押。'
      },
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res)
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      }
    })
  },


  // 切换选中条款
  changecheck: function () {
    var that = this;
    console.log(this.data)
    if (this.data.checkmain == true) {
      that.setData({
        checkmain: false
      })
    } else {
      that.setData({
        checkmain: true
      })
    }
  },
  //点击X点击事件
  closeTip() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //点击我要申诉按钮事件
  callPolice() {
    var that = this;
    if (that.data.checkmain) {
      wx.navigateTo({
        url: '../appeal/video',
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
* 生命周期函数--监听页面隐藏
*/
  onHide: function () {
    var that = this;
    that.setData({
      checkmain: false
    })
  }
})