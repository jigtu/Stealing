// pages/queryPhoto/queryPhoto.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 拍照
  photoBtn:function(){
    var that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        that.setData({
          imgUrl: res.tempImagePath,
          photoType:1
        });
        console.log(that);
      
      }
    })
  },
  // 重拍
  rePhoto:function(){
    var that = this;
    that.setData({
      imgUrl: '',
      photoType: 2
    });
  },
  // 确定
  photook:function(){
    var that = this;
    app.globalData.queryImg =that.data.imgUrl;
    console.log(app.globalData.queryImg)
    wx.switchTab({
      url: '../query/query',
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    // that.setData({
    //   imgUrl:'',
    //   photoType: 2

    // })
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