// pages/revocationVideoPhoto/revocationVideoPhoto.js
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
        that.setData({
          imgUrl: res.tempImagePath,
          mark: true
        });
        console.log(that)
        // 上传正面免冠照片
        wx.uploadFile({
          url: app.globalData.apiUrl + 'alarm/alarmPeopleUpload',
          filePath: that.data.imgUrl,
          header: { "content-Type": "application/x-www-form-urlencoded" },
          method: 'POST',
          name: 'file',
          formData: {
            alarm_people_openid: that.data.openid
          },
          success: function (res) {
            console.log(res);
            setTimeout(function () {
              wx.hideLoading();
            }, 1000)
            that.setData({
              mark: false
            })
            var datas = JSON.parse(res.data);
            console.log(datas);
            if (datas.code == 200) {
              wx.redirectTo({
                url: '../revocationPhoto/revocationPhoto',
              })
            }
            else if (datas.code == 300) {
              wx.showModal({
                content: datas.desc,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {

                  }
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