// pages/revocationMyinformation/revocationMyinformation.js
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
          people_name: res.data.people_name,
          people_idCard: res.data.people_idCard
        })
      }
    })
    // 获取定位经纬度
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
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
  // 撤销人姓名
  policeUser: function (e) {
    this.setData({
      people_name: e.detail.value
    })
  },
  // 撤销人身份证号
  policeIdcard: function (e) {
    this.setData({
      people_idCard: e.detail.value
    })
  },

  // 撤销人电话
  policeTel: function (e) {
    this.setData({
      policeTel: e.detail.value
    })
  },
  // 撤销原因
  reason: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },

  // 下一步
  userinforStep: function (e) {
    var that = this;
    console.log(that)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    that.setData({
      mark: true
    });
    wx.showLoading({
      title: '信息提交中',
      mask: true
    });
    if (that.data.people_name == '' || that.data.people_idCard == '' || that.data.policeTel == '') {
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
        url: app.globalData.apiUrl + 'alarm/backoutPeopleInfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          alarm_people_openid: that.data.openid,
          backout_people_name: that.data.people_name,
          backout_people_idCard: that.data.people_idCard,
          backout_phone: that.data.policeTel,
          backout_reson: that.data.reason,
          backout_place: that.data.regionCall,
          backout_place_longitude: that.data.longitude,
          backout_place_latitude: that.data.latitude
        },
        success: function (res) {
          console.log(res);
          console.log('alarm_people_openid--------'+that.data.openid+
            'backout_people_name--------'+ that.data.people_name,
            'backout_people_idCard--------'+that.data.people_idCard+
            'backout_phone--------'+ that.data.policeTel+
            'backout_reson--------'+ that.data.reason+
            'backout_place--------'+that.data.regionCall+
            'backout_place_longitude--------'+that.data.longitude+
            'backout_place_latitude--------'+ that.data.latitude)
          that.setData({
            mark: false
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 1000)
          if (res.data.code == '200') {
            wx.showModal({
              content: '撤销成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.removeStorage({
                    key: 'verify',
                    success: function (res) {
                      console.log(res.data)
                    }
                  })  
                  console.log('用户点击确定')
                  app.globalData.backUpload = false;
                  app.globalData.frontUpload = false;
                  app.globalData.backFlag= false;
                  app.globalData.frontFlag=false;
                  app.globalData.backPhoto = '../../public/backPhoto.png';
                  app.globalData.frontPhoto='../../public/frontPhoto.png';
                  app.globalData.back='1';
                  app.globalData.front='1';
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