// pages/revocationTakeFrontPhoto/revocationTakeFrontPhoto.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    mark: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      }
    })
  },
  // 拍照
  takePhoto() {
    var that = this;
    wx.showLoading({
      title: '照片上传中',
      mask: true
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        app.globalData.frontPhoto = res.tempImagePath
        console.log(app.globalData.frontPhoto)
        that.setData({
          imgUrl: res.tempImagePath,
          mark: true
        });
        console.log(that)
        wx.redirectTo({
          url: '../revocationPhoto/revocationPhoto?frontFlag=true',
        })
        app.globalData.frontFlag = true;

      }
    })
  },
  error(e) {
    console.log(e.detail)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
