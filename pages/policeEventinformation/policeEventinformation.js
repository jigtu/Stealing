// pages/policeEventinformation/policeEventinformation.js
const app = getApp();
var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    policeConType:10,
    eventDate:'',
    regionCall:'',
    eventTimearray: ['00','01', '02', '03', '04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    eventTimeindex: 0,
    eventPlace:'',
    otherTextarea:'',
    checkmain:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad: function (options) {
    var that = this;
    var time = util.formatTime(new Date());  
    console.log(time)
    that.setData({
      'endTime': time
    })
    console.log(that.data.endTime)
    console.log(app.globalData.checkmain)
    if (app.globalData.checkmain){
      that.setData({
        checkmain: true,
      })
      wx.getStorage({
        key: 'policeInfor',
        success: function (res) {
          that.setData({
            losterName: res.data.people_name,
            losterIdcard: res.data.people_idCard
          })
        }
      })
    }
    
    console.log(that)
    // 获取policeType
    wx.getStorage({
      key: 'policeInfor',
      success: function (res) {
        that.setData({
          policeType: res.data.policeType
        })
      }
    })
    // 获取案件信息
    wx.getStorage({
      key: 'caseInfor',
      success: function (res) {
        var str = res.data.find_case_time;
        var eventDate = str.split(" ")[0];
        var eventTime = parseInt(str.split(" ")[1]);
        console.log(str)
        that.setData({
          policeConType: res.data.alarm_type,
          losterName: res.data.owner_name,
          losterIdcard: res.data.owner_card_id,
          eventDate: eventDate,
          eventTimeindex: eventTime,
          eventPlace:res.data.find_case_place,
          otherTextarea:res.data.find_case_place_replenish,
          caseType: res.data.caseType,
          find_case_longitude: res.data.find_case_longitude,
          find_case_latitude: res.data.find_case_latitude,
          alarm_longitude: res.data.alarm_longitude,
          alarm_latitude: res.data.alarm_latitude,
          
        })
        console.log(that.data.losterName)
        switch (res.data.alarm_type) {
          case "1":
            that.setData({
              type1: true,
              type2: false,
              type3: false
            });
            break;
          case "2":
            that.setData({
              type1: false,
              type2: true,
              type3: false
            });
            break;
          case "3":
            that.setData({
              type1: false,
              type2: false,
              type3: true
            });
            break;
        }
      }
    })
    // 获取phoneType
    wx.getStorage({
      key: 'phoneInfor',
      success: function (res) {
        that.setData({
          phoneType: res.data.phoneType
        })
      }
    })
    // 获取定位经纬度
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res)
        that.setData({
          alarm_longitude: res.longitude,
          alarm_latitude: res.latitude
        })
        wx.request({ // ②百度地图API，将微信获得的经纬度传给百度，获得城市等信息
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=GzpEL9HxYMYaRl8qUKH0UWeZC2EvnYgH&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
          data: {},
          header: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          success: function (res) {
            console.log(res)
            var regionCall = res.data.result.addressComponent.province + res.data.result.addressComponent.city + res.data.result.addressComponent.district
            that.setData({
              'regionCall': regionCall 
            })
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      }
    })
  },
  // 发案地点跳转地图页面
  goMap:function(e){
    var that = this;
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time = that.data.eventDate + ' ' + eventTime;
    that.setData({
      caseInfor: {
        alarm_type: that.data.policeConType,
        owner_name: that.data.losterName,
        owner_card_id: that.data.losterIdcard,
        find_case_time: find_case_time,
        find_case_place: that.data.eventPlace,
        alarm_place: that.data.regionCall,
        find_case_place_replenish: that.data.otherTextarea,
        caseType: true,
        find_case_longitude: that.data.find_case_longitude,
        find_case_latitude: that.data.find_case_latitude,
        alarm_longitude: that.data.alarm_longitude,
        alarm_latitude: that.data.alarm_latitude
      }
    })
    wx.setStorageSync('caseInfor', that.data.caseInfor)
    wx.navigateTo({
      url:'../map/map'
    })
  },
  // 报警事由
  typeChange: function (e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({
      policeConType: e.detail.value
    })
  },
  // 是否为同一人
  checkPeople: function () {
    var that = this;
    if (this.data.checkmain == true) {
      that.setData({
        checkmain: false,
        losterName: '',
        losterIdcard: '',
      })
      app.globalData.checkmain = false;
    } else {
      that.setData({
        checkmain: true
      })
      app.globalData.checkmain = true;
      wx.getStorage({
        key: 'policeInfor',
        success: function (res) {
          that.setData({
            losterName: res.data.people_name,
            losterIdcard: res.data.people_idCard
          })
        }
      })
    }
  },
  // 受害人姓名
  losterName: function (e) {
    this.setData({
      losterName: e.detail.value
    })
  },
  // 受害人身份证
  losterIdcard: function (e) {
    this.setData({
      losterIdcard: e.detail.value
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

  // 其他信息
  otherTextarea: function (e) {
    this.setData({
      otherTextarea: e.detail.value
    })
  },
  // 跳转报警人信息
  policeStep:function(){
    var that = this;
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time =that.data.eventDate + ' ' + eventTime;
    // 判断三个是否全部都选择过
    if (that.data.policeType == true){
      // 必填项是否为空
      if (that.data.policeConType == '' || that.data.losterName == '' || that.data.losterIdcard == '' || that.data.eventDate == '' || that.data.eventPlace == '') {
        wx.showToast({
          title: '请把本页必填的信息填写完整！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else {
        if (that.data.otherTextarea == undefined){
          that.setData({
            otherTextarea:'无'
          })
        }
        that.setData({
          caseInfor: {
            alarm_type: that.data.policeConType,
            owner_name: that.data.losterName,
            owner_card_id: that.data.losterIdcard,
            find_case_time: find_case_time,
            find_case_place: that.data.eventPlace,
            alarm_place: that.data.regionCall,
            find_case_place_replenish: that.data.otherTextarea,
            caseType: true,
            find_case_longitude: that.data.find_case_longitude,
            find_case_latitude: that.data.find_case_latitude,
            alarm_longitude: that.data.alarm_longitude,
            alarm_latitude: that.data.alarm_latitude
            
          }
        })
        wx.setStorageSync('caseInfor', that.data.caseInfor)
        wx.redirectTo({
          url: '../policeMyinformation/policeMyinformation',
        })
      }
    }
    else{
      this.setData({
        disabled: true
      })
    }
  },
  // 跳转设备信息
  phoneStep: function () {
    var that = this;
    console.log(that)
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time = that.data.eventDate + ' ' + eventTime;
    // 判断三个是否全部都选择过
    if (that.data.policeType == true && that.data.caseType == true) {
      // 必填项是否为空
      if (that.data.policeConType == '' || that.data.losterName == '' || that.data.losterIdcard == '' || that.data.eventDate == '' || that.data.eventPlace == '') {
        wx.showToast({
          title: '请把本页必填的信息填写完整！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else {
        that.setData({
          caseInfor: {
            alarm_type: that.data.policeConType,
            owner_name: that.data.losterName,
            owner_card_id: that.data.losterIdcard,
            find_case_time: find_case_time,
            find_case_place: that.data.eventPlace,
            alarm_place: that.data.regionCall,
            find_case_place_replenish: that.data.otherTextarea,
            caseType: true,
            find_case_longitude: that.data.find_case_longitude,
            find_case_latitude: that.data.find_case_latitude,
            alarm_longitude: that.data.alarm_longitude,
            alarm_latitude: that.data.alarm_latitude
          }
        })
        wx.setStorageSync('caseInfor', that.data.caseInfor)
        wx.redirectTo({
          url: '../policePhoneinfor/policePhoneinfor',
        })
      }
    }
    else{
      this.setData({
        disabled: true
      })
    }
  },
  // 下一步
  losterInforStep:function(e){
    var that = this;
    console.log(that)
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time = that.data.eventDate + ' ' + eventTime;
    // 必填项是否为空
    console.log(that.data.policeType + that.data.losterName + that.data.losterIdcard + that.data.eventDate + that.data.eventPlace)
    if (that.data.policeConType == undefined || that.data.losterName == '' || that.data.losterIdcard == '' || that.data.eventDate == '' || that.data.eventPlace == ''){
      wx.showToast({
        title: '请把本页必填的信息填写完整！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else{
      console.log(that.data.eventPlace)
      console.log(that.data.otherTextarea)
      that.setData({
        caseInfor: {
          alarm_type: that.data.policeConType,
          owner_name: that.data.losterName,
          owner_card_id: that.data.losterIdcard,
          find_case_time: find_case_time,
          find_case_place: that.data.eventPlace,
          alarm_place: that.data.regionCall,
          find_case_place_replenish: that.data.otherTextarea,
          caseType: true,
          find_case_longitude: that.data.find_case_longitude,
          find_case_latitude: that.data.find_case_latitude,
          alarm_longitude: that.data.alarm_longitude,
          alarm_latitude: that.data.alarm_latitude
        }
      })
      wx.setStorageSync('caseInfor', that.data.caseInfor)
      wx.redirectTo({
        url: '../policePhoneinfor/policePhoneinfor',
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
  
  }
})
