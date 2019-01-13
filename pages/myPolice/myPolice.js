// pages/myPolice/myPolice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myPoliceinfor:[
    ],
    list:true,
    mark:false,
    scrollTop: 100
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        
        var openid=that.data.openid
        // 请求报警数据
        wx.request({
          url: app.globalData.apiUrl + 'alarm/queryAlarmList?openid='+openid,
          method: 'GET',
          header: {'content-type': 'application/json'},
          data: {},
          success: function (res) {
            console.log(that.data.openid)
           
            if (res.data.code == 200) {
              var data = res.data.data;
              console.log(data);
              
              var array = [];
              for (var index in data) {
                var obj = data[index];
                console.log(obj)
                switch (obj.alarmStatus) {
                  case 1:
                    that.setData({
                      policeStatus: '已报警',
                      policeImg: 'https://www.wxjingtu.top/image/orangeIcon.png',
                      colorss: 'orange'
                    })
                    break;
                  case 2:
                    that.setData({
                      policeStatus: '已撤销',
                      policeImg:   'https://www.wxjingtu.top/image/greenIcon.png',
                      colorss: 'green',
                    })
                    break;
                }
                var ins = {
                  "time": obj.alarmTime, 
                  'alarmPeople': obj.alarmPeopleName,
                  'victimPeople': obj.ownerName,
                  'policeId':obj.id,
                  'type': that.data.policeStatus,
                  'policeImg':that.data.policeImg,
                  'colorss': that.data.colorss

                }
                array[index] = ins;
              }
              that.setData({
                myPoliceinfor: array,
                policeInfor: data,
              });
            
              setTimeout(function () {
                wx.hideLoading();
              }, 100)
              // 是否有记录
              if (res.data.data.length == 0) {
                that.setData({
                  'list': false
                })
                
              } else {
                setTimeout(function () {
                  that.setData({
                    'list': true
                  })
                }, 500)
                             
              }
            }
          }
        })
      }
    })
 },
  
  // 点击我的列表
  choiseindex: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.index)
    var targetIndex = e.currentTarget.dataset.index;
    console.log(that.data.policeInfor)
    that.setData({
      currentInfor: that.data.policeInfor[targetIndex]
    })
    let currentInfor = JSON.stringify(that.data.currentInfor);
    wx.navigateTo({
      url: '../policeDetail/policeDetail?currentInfor=' + currentInfor,
    })
    console.log(that.data.currentInfor)
  },
  // 点击使用提取码
  useCode:function(e){
    wx.redirectTo({
      url: '../extractVideo/extractVideo',
    })
  },
  // 身份证号
  victimIdcard:function(e){
    this.setData({
      victimIdcard:e.detail.value
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