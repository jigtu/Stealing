// pages/queryOne/queryOne.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yourIMEI:'',
    openid:'',
    queryImgFlag:false
  },
  /**
  * 生命周期函数--监听页面加载
  */
 
  onLoad: function (options) {
    var that = this;
    console.log(that)
    // 上传IMEI码照片
    if (app.globalData.queryImg){
      that.setData({
        queryImgFlag:true,
        queryImg: app.globalData.queryImg
      })
      console.log('上传IMEI照片')
      wx.uploadFile({
        url: app.globalData.apiUrl + 'blacklist/distinguishImei',
        filePath: app.globalData.queryImg,
        header: { "Authorization": "APPCODE 923a855fc1964b60a959cf2d119b4d42", "Content-Type": "application/json charset=UTF-8" },
        method: 'POST',
        name: 'file',
        formData: {
          open_id: that.data.openid
        },
        success: function (res) {
          console.log(res);
          var datas = JSON.parse(res.data);
          console.log(datas);
          if (datas.code == 200) {
            console.log(datas.data);
            that.setData({
              yourIMEI: datas.data
            })
            console.log(that.data.yourIMEI)
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
    
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
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
            var address = res.data.result.addressComponent.province + res.data.result.addressComponent.city + res.data.result.addressComponent.district
            console.log(address)
            that.setData({
              'address': address
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
  // 点击照相机
  queryPhoto:function(){
    wx.redirectTo({
      url: '../queryPhoto1/queryPhoto1',
    })
  },
  // 删除照片
  imeidelete:function(){
    var that = this;
    that.setData({
      queryImgFlag:false,
      queryImg:''
    })
    app.globalData.queryImg =''
  },
  
  // 点击重拍
  rePhoto:function(e){
    var that = this;
    that.setData({
      scanCamera: 1,
      imgurl:''
    })
  },
  // imei号
  yourIMEI:function(e){
    this.setData({
      yourIMEI:e.detail.value
    })
  },
  // 查询
  search:function(e){
    var that = this;
    console.log(e)
    wx.request({
      url: app.globalData.apiUrl + 'blacklist/available',
      data: {
        openid:that.data.openid,
        imei : that.data.yourIMEI,
        address: that.data.address,
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          console.log(res);
          that.setData({
            scanCamera: 0,
            imgurl: ' ',
            yourIMEI:''
          })
          wx.showModal({
            content: "此设备目前无嫌疑",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  yourIMEI:''
                })
                wx.switchTab({
                  url: '../index/index',
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
      },
      fail: function (r) {
        console.log(r)
      }
    })
    console.log('openid:' + that.data.openid +
      'imei :' + that.data.yourIMEI +
      'address:' + that.data.address +
      'longitude:' + that.data.longitude +
      'latitude: ' + that.data.latitude)
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
    var that = this;
    that.setData({
      queryImgFlag: false,
      queryImg: ' ',
      yourIMEI: ''
    })
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