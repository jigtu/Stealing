// pages/queryPhoto/queryPhoto.js
const app = getApp();
var innerAspectRadio = 1;
var qualityWidth = 1080;
var imageWidth = 750;
var imageHeight =0;
var canvasW = 750;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    photoType: '',
    innerAspectRadio: innerAspectRadio,
    canvasW: canvasW,
    imageWidth: imageWidth,
    imageHeight:imageHeight,
    takephoto: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowWidth)
        that.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight
        })
      },
    })
  },  
  // 拍照
  photoBtn: function () {
    var that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        that.setData({
          takephoto: true,
          photoType: 1,
          imageSrc: res.tempImagePath
        })
        console.log('111'+that.data.imageSrc)
        var imageSrc = res.tempImagePath;
        wx.getImageInfo({
          src: imageSrc,
          success: function success(res) {
            console.log('222'+that.data.imageSrc)
            // 计算比例
            innerAspectRadio = res.width / res.height;
            imageWidth =res.width;
            imageHeight = res.height ;
            console.log(imageHeight)
            that.setData({
              imageWidth: imageWidth
            })
            //画布画照片
            const ctx = wx.createCanvasContext('myCanvas')
            ctx.drawImage(imageSrc, 0, 0);
            // 截取需要的部分
            ctx.draw(false, () => {
              console.log('333'+that.data.imageSrc)
              var canvasW = imageWidth;
              var canvasH = imageHeight * 0.1;
              var canvasL = 0;
              var canvasT = imageHeight *0.35;
              wx.canvasToTempFilePath({
                x: canvasL,
                y: canvasT,
                width: imageWidth,
                height: canvasH,
                quality: 1,
                canvasId: 'myCanvas',
                success: function (res) {
                  console.log('444'+that.data.imageSrc)
                  wx.hideLoading()
                  // 成功获得地址的地方
                  console.log(res.tempFilePath)
                  that.setData({
                    imgUrl: res.tempFilePath
                  });
                },
                fail: function (res) {
                  console.log(res);
                },
                complete:function(res){
                  console.log(res)
                }
              })  
            })
          }
        })
      }
    })
  },
  // 重拍
  rePhoto: function () {
    var that = this;
    that.setData({
      imgUrl: '',
      photoType: 2,
      takephoto: false
    });
  },
  // 确定
  photook: function () {
    var that = this;
    
    app.globalData.queryImg = that.data.imgUrl;
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