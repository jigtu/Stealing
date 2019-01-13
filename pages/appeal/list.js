// pages/myaAppeal/myaAppea.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAppealin:[],
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
         var openid=that.data.openid
        // 请求申诉数据
        wx.request({
          url: app.globalData.apiUrl+'appeal/queryAppealList?openid='+openid,
          method: 'GET',
          header: {'content-type': 'application/json'},
          data: {},
          success: function (res) {
            if (res.data.code == 200) {
              var data = res.data;
              var array = [];
              for (var index in data) {
                var obj = data[index];
                if (obj.appealCause == 1) {
                  that.setData({
                    appealCause: '收到盗抢手机提示短信'
                  })
                }
                else if (obj.appeal_cause == 2) {
                  that.setData({
                    appeal_cause: '不能使用微信、支付宝'
                  })
                }
                else if (obj.appealCause == 3) {
                  that.setData({
                    appeal_cause: '其他'
                  })
                }
                var ins = {
                  "name": obj.cellphoneFeatures,
                  'reason': obj.appealCause,
                  'time': obj.appealTime
                }
                array[index] = ins;
              }
              that.setData({
                myAppealinfor: array
              });
              wx.hideLoading();
              // 是否有记录
              if (res.data.length == 0) {
                that.setData({
                  'list': false
                })
                
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