// pages/replenishInfor/replenishInfor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventDate: '',
    phonenamearray: ['Iphone', '华为', 'OPPO', 'vivo', '三星', '其他'],
    phonenameindex: 0,
    phoneTimearray: ['2013', '2014', '2015', '2016', '2017', '2018'],
    phoneTimeindex: 0,
    phonename: '',
    otherShow: false,
    Selectdropdown: true,
    Selectdropdown2: true,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    // 获取手机信息
    wx.getStorage({
      key: 'policeDetail',
      success: function (res) {
        console.log(res)
        var str = res.data.lost_phone_purchasingDate;
        var phoneTime = str.split("-")[0];
        
        console.log(phoneTime)
        that.setData({
          losterTel: res.data.lost_phone_number,
          // secondlosterTel: res.data.lost_phone_number,
          phonename: res.data.lost_phone_brand,
          phoneSize: res.data.lost_phone_model,
          phoneTime: res.data.lost_phone_purchasingDate,
          IMEI1: res.data.imei1,
          IMEI2: res.data.imei2,
          bindNumber: res.data.lost_phone_serialNumber,
          phonenameindex: res.data.phonenameindex,
          phoneTimeindex: res.data.phoneTimeindex,
          contact_number: res.data.contact_number,
          id:res.data.id,
          find_case_time: res.data.find_case_time,
          find_case_place: res.data.find_case_place,
          find_case_place_replenish: res.data.find_case_place_replenish,
          find_case_longitude: res.data.find_case_longitude,
          find_case_latitude: res.data.find_case_latitude
        })
        console.log(res.data.phonenameindex)
        console.log(res.data.phoneTimeindex)
      }
    }) 
  },
  // 丢失手机号
  losterTel: function (e) {
    this.setData({
      losterTel: e.detail.value
    })
  },
  // 确认手机号
  secondlosterTel: function (e) {
    this.setData({
      secondlosterTel: e.detail.value
    })
  },
  // 手机型号
  phoneSize: function (e) {
    this.setData({
      phoneSize: e.detail.value
    })
  },
  // 手机品牌
  phonenameChange: function (e) {
    var that = this;
    this.setData({
      phonenameindex: e.detail.value,
      Selectdropdown: true
    })
    if (e.detail.value == 5) {
      that.setData({
        phonename: '输入其他品牌',
        otherShow: true,
        phonename: that.data.otherPhoneName
      })
    } else {
      var phonenameindex = that.data.phonenameindex;
      that.setData({
        otherShow: false,
        phonename: that.data.phonenamearray[phonenameindex]
      })
    }
  },
  //手机品牌取消选择
  Cancelthechoice: function (e) {
    this.setData({
      Selectdropdown: true
    })
  },
  //点击手机品牌input事件
  Choosecomplaint: function (e) {
    this.setData({
      Selectdropdown: false
    })
    console.log(this.data.Selectdropdown)
  },
  otherPhoneName: function (e) {
    var that = this;
    this.setData({
      otherPhoneName: e.detail.value
    })
  },
  // 购买时间
  phonetimeChange: function (e) {
    var that = this;
    this.setData({
      phoneTimeindex: e.detail.value,
      Selectdropdown2:true
    })
  },
  //购买时间取消选择
  Cancelthechoice2: function (e) {
    this.setData({
      Selectdropdown2: true
    })
  },
  //点击购买时间input事件
  Choosecomplaint2: function (e) {
    this.setData({
      Selectdropdown2: false
    })
    console.log(this.data.Selectdropdown2)
  },
  // 手机IMEI
  bindIMEI1: function (e) {
    this.setData({
      IMEI1: e.detail.value
    })
  },
  // 手机IMEI2
  bindIMEI2: function (e) {
    this.setData({
      IMEI2: e.detail.value
    })
  },
  // 手机序列号
  bindNumber: function (e) {
    this.setData({
      bindNumber: e.detail.value
    })
  },

  // 下一步
  losterInforStep: function (e) {  
    var that = this;
    console.log(that)
    // 必填项是否为空
      if (that.data.otherShow) {
        var phonename = that.data.otherPhoneName;
      } else {
        var phonenameindex = that.data.phonenameindex;
        var phonename = that.data.phonenamearray[phonenameindex];
      }
      var phoneTimeindex = that.data.phoneTimeindex;
      var phoneTime = that.data.phoneTimearray[phoneTimeindex];
      if (that.data.IMEI1 == 'undefined' || that.data.IMEI1 == '') {
        that.data.IMEI1 = '无'
      }
      if (that.data.IMEI2 == 'undefined' || that.data.IMEI2 == '') {
        that.data.IMEI2 = '无'
      }
      if (that.data.bindNumber == 'undefined' || that.data.bindNumber == '') {
        that.data.bindNumber = '无'
      }
      if (that.data.phoneSize == 'undefined' || that.data.phoneSize == ''){
        that.data.phoneSize = '无'
      }
      that.setData({
        policeDetail: {
          'lost_phone_brand': that.data.phonename,
          'lost_phone_number': that.data.losterTel,
          "IMEI1": that.data.IMEI1,
          'IMEI2': that.data.IMEI2,
          'lost_phone_serialNumber': that.data.bindNumber,
          'lost_phone_model': that.data.phoneSize,
          "find_case_time": that.data.find_case_time,
          'find_case_place': that.data.find_case_place,
          'find_case_place_replenish': that.data.find_case_place_replenish,
          'find_case_longitude': that.data.find_case_longitude,
          'find_case_latitude': that.data.find_case_latitude,
          'lost_phone_purchasingDate': that.data.phoneTime,
          'contact_number': that.data.contact_number,
          'id': that.data.id,
          'phonenameindex': that.data.phonenameindex,
          'phoneTimeindex': that.data.phoneTimeindex
        }
      })
      wx.setStorageSync('policeDetail', that.data.policeDetail)      
      wx.redirectTo({
        url: '../replenishEventinfor/replenishEventinfor',
      })
      console.log(that.data.policeDetail) 
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
function setType(value) {

}