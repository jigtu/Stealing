// pages/revocationVideo/revocationVideo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mark: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
  
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      }
    })
    wx.getStorage({
      key: 'policeDetail',
      success: function (res) {
        that.setData({
          id: res.data.id
        })
        console.log(that.data.id)
      }
    })
  },
  
  takeView: function (e) {
    var that = this;
    console.log(that)
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 3,
      compressed:true,
      camera: 'front',
      success: function (res) {
        that.setData({
          src: res.tempFilePath,
          mark: true
        })
        wx.showLoading({
          title: '正在动态验证',
          mask: true
        })
        app.globalData.video = res.tempFilePath;
        console.log(app.globalData.video)
        console.log(that.data.id)
        // 上传视频
        wx.uploadFile({
          url: app.globalData.apiUrl + 'alarm/backoutPeopleUpload',
          method: 'POST',
          filePath: app.globalData.video,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          formData: {
            alarm_people_openid: that.data.openid,
            alarm_id:that.data.id
          },
          success: function (res) {
            console.log(res)
            setTimeout(function () {
              wx.hideLoading();
            }, 1000)
            that.setData({
              mark: false
            })
            var datas = JSON.parse(res.data);
            console.log(datas)
            if (datas.code == 200) {
              console.log(datas)
              app.globalData.alarm_people_photo = app.globalData.imgUrl + datas.data.photoPath
              wx.hideLoading();
              wx.showModal({
                content: '动态验证成功，请拍摄身份证',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../revocationPhoto/revocationPhoto',
                    })
                  }
                }
              })
            }
            else if (datas.code == 300) {
              wx.showModal({
                content: datas.desc + ',请重新拍摄!',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log("用户点击了确认")
                  }
                }
              })
            }
          },
          fail: function (r) {
            console.log(r)
          },
          complete: function (c) {
            
          }
        })
      }
    })
  },

  upload: function () {

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
    console.log('--------下拉刷新-------')
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
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