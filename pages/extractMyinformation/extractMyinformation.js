// pages/extractMyinformation/extractMyinformation.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgarr: [],
    policeTel: '',
    mark: false,
    // markimg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取openid
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      }
    })
    // 获取照片
    wx.getStorage({
      key: 'verify',
      success: function (res) {
        that.setData({
          'imgarr[0]': res.data.alarm_people_photo,
          'imgarr[1]': res.data.frontPhoto,
          'imgarr[2]': res.data.backPhoto,
          extract_name: res.data.people_name,
          extract_idCard: res.data.people_idCard
        })
      }
    })
  },
  // 提取人姓名
  extractUser: function (e) {
    this.setData({
      extract_name: e.detail.value
    })
  },
  // 提取人身份证号
  extractIdcard: function (e) {
    this.setData({
      extract_idCard: e.detail.value
    })
  },
  // 下一步
  extractStep: function (e) {
    var that = this;
    console.log(that)
    that.setData({
      mark: true
    });
    wx.showLoading({
      title: '信息提交中',
      mask: true
    });
    if (that.data.extract_name == '' || that.data.extract_idCard == '') {
      wx.showToast({
        title: '请把本页信息填写完整！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    // else if (!myreg.test(that.data.policeTel)){
    //   wx.showToast({
    //     title: '手机号有误！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // }
    else {
      wx.request({
        url: app.globalData.apiUrl +'alarm/extractVerificationCode',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          alarm_people_openid: that.data.openid,
          people_name: that.data.extract_name,
          people_idCard: that.data.extract_idCard
        },
        success: function (res) {
          console.log(res);
          console.log('alarm_people_openid--------' + that.data.openid + 'people_name--------' + that.data.extract_name+
            'people_idCard--------' + that.data.extract_idCard)
          that.setData({
            mark: false
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 200)
          if (res.data.code == '200') {
            wx.showModal({
              content: res.data.desc,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.removeStorage({
                    key: 'verify',
                    success: function (res) {
                      console.log(res.data)
                    }
                  }) 
                   // 恢复身份证照片默认设置
                  app.globalData.backUpload = false;
                  app.globalData.frontUpload = false;
                  app.globalData.backFlag = false;
                  app.globalData.frontFlag = false;
                  app.globalData.backPhoto = '../../public/backPhoto.png';
                  app.globalData.frontPhoto = '../../public/frontPhoto.png';
                  app.globalData.back = '1';
                  app.globalData.front = '1';
                  wx.redirectTo({
                    url: '../myPolice/myPolice'
                  })
                }
              }
            })
          }
          else if (res.data.code == 300) {
            wx.showModal({
              content: res.data.desc,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        }
      })
    }
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

  },

})