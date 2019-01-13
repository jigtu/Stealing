//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'https://www.wxjingtu.top/image/banna1.png',
      'https://www.wxjingtu.top/image/banna2.png',
      'https://www.wxjingtu.top/image/banna3.png',
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,
    articleList: [{
      'title': '什么是手机金盾?',
      'logo': 'https://www.wxjingtu.top/image/article1.png',
      'describe': '手机金盾是公安部推出的打击手机被盗抢骗案件的便民应用，方便群众报警、查询验证被盗抢手机等。',
      'url': '../article1/article1'
    }, {
        'title': '如何使用手机金盾？',
      'logo': 'https://www.wxjingtu.top/image/article4.png',
      'describe': '手机金盾具备“我要报警”、“被盗抢手机查询”、“申诉”、“撤销报警”等功能。',
      'url': '../article4/article4'
    }, {
      'title': '手机被盗/抢/骗后咋办？',
      'logo': 'https://www.wxjingtu.top/image/article2.png',
      'describe': '第一时间通过本应用或者110报警，并尽量详细的提供手机设备信息（如IMEI码，手机品牌型号等）帮助民警找回或返还。',
      'url': '../article2/article2'
    }, {
      'title': ' 什么是手机IMEI码?如何获取?',
      'logo': 'https://www.wxjingtu.top/image/article3.png',
      'describe': 'IMEI码是手机唯一识别码，在拨号盘拨打*#06#或者打开“设置-关于本机-IMEI”可看到IMEI码。',
      'url': '../article3/article3'
    }],
    mesList:[
      {
        'num':'1.',
        'con':'本小程序报警功能目前只受理手机被盗、被抢、被骗案件，其他类型案件请直接到派出所或拨打110报警。'
      },
      {
        'num': '2.',
        'con':'虚假报警将承担相关法律责任，请报警人如实提供报警信息。'
      },
    ],
    mark: false,
    checkmain: false,
  },
  onPullDownRefresh: function () {
    console.log('--------下拉刷新-------')
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
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
        // console.log(that.data.openid)
      }
    })
  },
  // 我要报警
  police: function (e) {
    var that = this;
    that.setData({
      mark:true
    })
    
  },
  // 查看详细文章
  detailInfor:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.index)
    var targetIndex = e.currentTarget.dataset.index;
    var url = that.data.articleList[targetIndex].url;
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  },
  // 切换选中条款
  changecheck: function () {
    var that = this;
    console.log(this.data)
    if (this.data.checkmain == true) {
      that.setData({
        checkmain: false
      })
    } else {
      that.setData({
        checkmain: true
      })
    }
  },
  // 我要报警
  callPolice:function(){
    var that = this;
    if (that.data.checkmain){
      wx.navigateTo({
        url:'../policeVideo/policeVideo'
      })
      that.setData({
        mark: false,
        checkmain: false
      })
    }
  },
  closeTip:function(){
    var that= this;
    that.setData({
      mark:false,
      checkmain: false
    })
  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    var that = this;
    that.setData({
      mark: false,
      checkmain: false
    })
  },
})
