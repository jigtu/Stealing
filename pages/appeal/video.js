const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
  // 点击启动摄像头按钮事件(拍摄视频)
  takeView: function (e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 3,
      compressed: true,
      camera: 'front',
      success: function (res) {
        wx.showLoading({
          title: '正在动态验证',
          mask: true
        })
        var videoImage = res.tempFilePath;
        // 上传视频
        wx.uploadFile({
          url: app.globalData.apiUrl + 'appeal/appealPeopleUpload.do',
          method: 'POST',
          filePath: videoImage,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          formData: {
            openid: that.data.openid
          },
          success: function (res) {
            wx.hideLoading();
            var datas = JSON.parse(res.data);
            console.log(datas);
            if (datas.code == 200) {
              app.globalData.appealVideoImg = app.globalData.imgUrl + datas.data.photoPath;
              wx.showModal({
                content: '动态验证成功，请拍摄身份证',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../appeal/Photo',
                    })
                  }
                }
              })
            }
            else if (datas.code == 300) {
              wx.showModal({
                content: '动态验证失败,请重新拍摄!',
                showCancel: false,
                success: function (res) {
                }
              })
            }
          },
          fail: function (r) {
            console.log(r)
          }
        })
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