// pages/replenishEventinfor/replenishEventinfor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventDate: '',
    eventPlace: ['', '', ''],
    regionCall: '',
    eventTimearray: ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    eventTimeindex: 0,
    mark:false
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
    // 获取信息
    wx.getStorage({
      key: 'policeDetail',
      success: function (res) {
        console.log(res)
        var str = res.data.find_case_time;
        var eventDate = str.split(" ")[0];
        var eventTime = parseInt(str.split(" ")[1]) - 1;
        that.setData({
          losterTel: res.data.lost_phone_number,
          secondlosterTel: res.data.lost_phone_number,
          phonename: res.data.lost_phone_brand,
          phoneSize: res.data.lost_phone_model,
          phoneTime: res.data.lost_phone_purchasingDate,
          IMEI1: res.data.IMEI1,
          IMEI2: res.data.IMEI2,
          bindNumber: res.data.lost_phone_serialNumber,
          phonenameindex: res.data.phonenameindex,
          phoneTimeindex: res.data.phoneTimeindex,
          id: res.data.id,
          eventDate: eventDate,
          eventTimeindex: eventTime,
          eventPlace: res.data.find_case_place,
          otherTextarea: res.data.find_case_place_replenish,
          find_case_longitude: res.data.find_case_longitude,
          find_case_latitude: res.data.find_case_latitude,
          callbackTel: res.data.contact_number
        })
        console.log(that.data.eventPlace)
      }
    }) 
  },
  // 发案时间
  eventDate: function (e) {
    this.setData({
      eventDate: e.detail.value
    })
  },
  eventTimeChange: function (e) {
    this.setData({
      eventTimeindex: e.detail.value
    })
    console.log(this.data.eventTimeindex)
  },
  // 发案地点跳转地图页面
  goMap: function (e) {
    var that = this;
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time = that.data.eventDate + ' ' + eventTime;
    that.setData({
      policeDetail: {
        alarm_people_openid: that.data.openid,
        id: that.data.id,
        lost_phone_number: that.data.losterTel,
        lost_phone_brand: that.data.phonename,
        lost_phone_model: that.data.phoneSize,
        lost_phone_purchasingDate: that.data.phoneTime,
        lost_phone_serialNumber: that.data.bindNumber,
        IMEI1: that.data.IMEI1,
        IMEI2: that.data.IMEI2,
        find_case_time: find_case_time,
        find_case_place: that.data.eventPlace,
        find_case_longitude: that.data.find_case_longitude,
        find_case_latitude: that.data.find_case_latitude,
        find_case_place_replenish: that.data.otherTextarea,
        contact_number: that.data.callbackTel
      }
    })
    wx.setStorageSync('policeDetail', that.data.policeDetail)
    wx.navigateTo({
      url: '../replenishMap/replenishMap'
    })
  },
  callbackTel:function(e){
    this.setData({
      callbackTel:e.detail.value
    })
  },
  // 其他信息
  otherTextarea: function (e) {
    this.setData({
      otherTextarea: e.detail.value
    })
  },
  replenishStep:function(e){
    var that = this;
    that.setData({
      mark:true
    })
  },
  // 确定
  replenishSure: function (e) {
    var that = this;
    console.log(that)
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time = that.data.eventDate + ' ' + eventTime;
    if (that.data.otherTextarea == undefined || that.data.otherTextarea == '') {
      that.data.otherTextarea = '无'
    }
    wx.request({
      url: app.globalData.apiUrl + 'alarm/updateCaseInformation',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        alarm_people_openid: that.data.openid,
        alarm_id: that.data.id,
        lost_phone_number: that.data.losterTel,
        lost_phone_brand: that.data.phonename,
        lost_phone_model: that.data.phoneSize,
        lost_phone_purchasingDate: that.data.phoneTime,
        lost_phone_serialNumber: that.data.bindNumber,
        IMEI1: that.data.IMEI1,
        IMEI2: that.data.IMEI2,
        find_case_time: find_case_time,
        find_case_place: that.data.eventPlace,
        find_case_longitude: that.data.find_case_longitude,
        find_case_latitude: that.data.find_case_latitude,
        find_case_place_replenish: that.data.otherTextarea,        
        contact_number: that.data.callbackTel
      },
      success: function (res) {
        console.log(res);
        that.setData({

        });
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
        if (res.data.code == '200') {
          wx.showModal({
            content: '信息填写完成',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.redirectTo({
                  url: '../myPolice/myPolice',
                })
              }
            }
          })
        }
        else if (res.data.code == '300') {
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
    console.log('alarm_people_openid=' + that.data.openid + '----' + 'alarm_id=' + that.data.id + '------lost_phone_number=' + that.data.losterTel + '------lost_phone_brand=' + that.data.phonename + '------lost_phone_purchasingDate=' + that.data.phoneTime + '------contact_number=' + that.data.callbackTel + '------lost_phone_model=' + that.data.phoneSize + '------lost_phone_serialNumber=' + that.data.bindNumber + '------IMEI1=' + that.data.IMEI1 + '------IMEI2=' + that.data.IMEI2 + '------find_case_place=' + that.data.eventPlace + 'find_case_time=' + find_case_time + '------find_case_longitude=' + that.data.find_case_longitude + '------find_case_latitude=' + that.data.find_case_latitude + '------find_case_place_replenish=' + that.data.otherTextarea)
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