// pages/myPolice/myPolice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myPoliceinfor:[
      // {
      //   'time':'2019-01-01 12:30:30',
      //   'alarmPeople':'李照亮',
      //   'victimPeople':'慕容丽丽'
      // },
      // {
      //   'time': '2019-01-01 12:30:30',
      //   'alarmPeople': '李照亮',
      //   'victimPeople': '慕容丽丽'
      // },
      // {
      //   'time': '2019-01-01 12:30:30',
      //   'alarmPeople': '李照亮',
      //   'victimPeople': '慕容丽丽'
      // }
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
        console.log(that.data.openid)
        // 请求报警数据
        wx.request({
          url: app.globalData.apiUrl + 'alarm/queryAlarmList.do',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            alarm_people_openid: that.data.openid
          },
          success: function (res) {
            console.log(that.data.openid)
            console.log(res);
            if (res.data.code == '200') {
              var data = res.data.data;
              console.log(data);
              
              var array = [];
              for (var index in data) {
                var obj = data[index];
                console.log(obj)
                switch (obj.alarm_status) {
                  case 1:
                    that.setData({
                      policeStatus: '已报警',
                      policeImg: 'https://wap.cintel.com.cn/anti_theft/images/orangeIcon.png',
                      colorss: 'orange'
                    })
                    break;
                  case 2:
                    that.setData({
                      policeStatus: '已撤销',
                      policeImg: 'https://wap.cintel.com.cn/anti_theft/images/greenIcon.png',
                      colorss: 'green',
                    })
                    break;
                }
                var ins = {
                  "time": obj.alarm_time, 
                  'alarmPeople': obj.alarm_people_name,
                  'victimPeople': obj.owner_name,
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
             
              console.log(that.data.myPoliceinfor)
              setTimeout(function () {
                wx.hideLoading();
              }, 100)
              // 是否有记录
              if (res.data.data.length == 0) {
                that.setData({
                  'list': false
                })
                console.log(that.data.list)
              } else {
                setTimeout(function () {
                  that.setData({
                    'list': true
                  })
                }, 500)
                
                console.log('hahah' + that.data.list)
              }
            }
          }
        })
      }
    })
    console.log(app.globalData.apiUrl + 'alarm/queryAlarmList.do')
    
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
    // wx.setStorage({
    //   key: 'currentInfor',
    //   data: that.setData.currentInfor,
    // })
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