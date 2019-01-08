// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mineConList: [{
      'title': '我的报警',
      'logo': 'https://wap.cintel.com.cn/anti_theft/images/myPolice.png',
      'oherIcon': 'https://wap.cintel.com.cn/anti_theft/images/oherIcon.png',
      'logoWidth':'myPolice'
    },
    //  {
    //   'title': ' 我的报备',
    //   'logo': 'https://wap.cintel.com.cn/anti_theft/images/myReport.png',
    //   'oherIcon': 'https://wap.cintel.com.cn/anti_theft/images/oherIcon.png',
    //   'logoWidth': 'myReport'
    // },
    {
      'title': ' 我的申诉',
      'logo': 'https://wap.cintel.com.cn/anti_theft/images/myaAppeal.png',
      'oherIcon': 'https://wap.cintel.com.cn/anti_theft/images/oherIcon.png',
      'logoWidth': 'myaAppeal'
    }, 
    // {
    //   'title': '我的查询',
    //   'logo': 'https://wap.cintel.com.cn/anti_theft/images/mySearch.png',
    //   'oherIcon': 'https://wap.cintel.com.cn/anti_theft/images/oherIcon.png',
    //   'logoWidth': 'mySearch'
    // }
    
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(this)
    if (this.data.hasUserInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  
  },
  // 获取个人信息
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 点击我的列表
  choiseindex: function (e) {
    console.log(e.currentTarget.dataset.index)
    var targetIndex = e.currentTarget.dataset.index;
    if (targetIndex == 0) {
      wx.navigateTo({
        url: '../myPolice/myPolice',
      })
    }
    // else if (targetIndex == 1){
    //   wx.navigateTo({
    //     url: '../myReport/myReport',
    //   })
    // }
   
    else if (targetIndex == 1) {
      wx.navigateTo({
        url: '../appeal/list',
      })
    }
    else if (targetIndex == 3) {
      wx.navigateTo({
        url: '../mySearch/mySearch',
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