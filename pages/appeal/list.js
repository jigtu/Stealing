// pages/myaAppeal/myaAppea.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAppealinfor: [
      // {
      //   'name':'苹果 Iphone 7 Plus',
      //   'reason':'李照亮',
      //   'time':'2019-01-01 12:30:30'
      // },
      // {
      //   'name': '苹果 Iphone 7 Plus',
      //   'reason': '李照亮',
      //   'time': '2019-01-01 12:30:30'
      // },
      // {
      //   'name': '苹果 Iphone 7 Plus',
      //   'reason': '李照亮',
      //   'time': '2019-01-01 12:30:30'
      // }
    ],
    list:true
   },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
       
        // 请求申诉数据
        wx.request({
          url: app.globalData.apiUrl+'appeal/queryAppealList.do',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            openid: that.data.openid
          },
          success: function (res) {
     
            if (res.data.code == '200') {
              var data = res.data.data;
              console.log(data);
              var array = [];
              for (var index in data) {
                var obj = data[index];
                if (obj.appeal_cause == 1) {
                  that.setData({
                    appeal_cause: '收到盗抢手机提示短信'
                  })
                }
                else if (obj.appeal_cause == 2) {
                  that.setData({
                    appeal_cause: '不能使用微信、支付宝'
                  })
                }
                else if (obj.appeal_cause == 3) {
                  that.setData({
                    appeal_cause: '其他'
                  })
                }
                var ins = {
                  "name": obj.cellphone_features,
                  'reason': obj.appeal_cause,
                  'time': obj.appeal_time
                }
                array[index] = ins;
              }
              that.setData({
                myAppealinfor: array
              });
              wx.hideLoading();
              // 是否有记录
              if (res.data.data.length == 0) {
                that.setData({
                  'list': false
                })
                console.log(that.data.list)
              } else {
                that.setData({
                  'list': true
                })
               
              }
            }
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