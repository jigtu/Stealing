//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that= this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function (res) {
        var code = res.code;
        var appid = 'wxd1c1064008bd564b'; //填写微信小程序appid  
        var secret = '535054b19e7d7e223fc5b8db29ada405'; //填写微信小程序secret  
        //调用request请求api转换登录凭证  
        wx.request({
          url: 'https://www.wxjingtu.top/token/jingtu/mini_token?code='+ code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var openid = res.data.data //返回openid
            wx.setStorage({
              key: 'openid',
              data: openid
            })
            console.log('openid为' + openid);
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })


          console.log(res)
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)  
        console.log(res.model ) 
        if (res.model == 'iPhone X') {
          that.globalData.isIpx = true;
        }
      }
    })  
    
  },
  
  onHide:function(){
    //console.log(this)
  },
  // 获取当前位置
  getLocationInfo: function (cb) {
    var that = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          that.globalData.locationInfo = res;
          cb(that.globalData.locationInfo)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  // 创建缓存

  // 全局
  globalData: {
    userInfo: null,
    apiUrl: 'https://www.wxjingtu.top/apps/api/',
    imgUrl: ' https://www.wxjingtu.top/image/',
    video:'',
    openid:'',
    alarm_people_photo:'',
    checkmain:false,
    isIpx:false,
    queryImg:''
  }
})
