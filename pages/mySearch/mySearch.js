// pages/mySearch/mySearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mySearchinfor: [
      {
        'name': 'dh3392929292929292',
        'time': '2019-01-01 12:30:30',
        'result': '截止2018-2-2 14:30:30,未查询到涉嫌盗抢信息',
        'status':'设备正常'
      },
      {
        'name': 'dh3392929292929292',
        'reason': '李照亮',
        'time': '2019-01-01 12:30:30',
        'result': '截止2018-2-2 14:30:30,未查询到涉嫌盗抢信息',
        'status':'涉嫌盗抢'
      },
      {
        'name': 'dh3392929292929292',
        'reason': '李照亮',
        'time': '2019-01-01 12:30:30',
        'result': '截止2018-2-2 14:30:30,未查询到涉嫌盗抢信息',
        'status': '涉嫌盗抢'
      }
    ],
    list: false
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
    // 请求我的查询数据
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
          var array = [data.length];
          for (var index in data) {
            var obj = data[index];
            var ins = {
              "name": obj.alarm_time,
              'result': obj.alarm_people_name,
              'time': obj.owner_name,
              "status": obj.alarm_time,
            }
            array[index] = ins;
          }
          that.setData({
            myPoliceinfor: array,
            policeInfor: data
          });
          console.log(that)
          console.log(that.data.myPoliceinfor)

          // 是否有记录
          if (that.data.myAppealinfor.length == 0) {
            that.setData({
              'list': true
            })
          } else {
            that.setData({
              'list': false
            })
          }
        }
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