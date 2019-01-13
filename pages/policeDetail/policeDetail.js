// pages/policeDetail/policeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    policeDetail:[],
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(that)
    let item = JSON.parse(options.currentInfor);
    this.setData({ currentInfor: item });
    var obj = that.data.currentInfor;
    that.setData({
      status: obj.alarm_status
    })
    console.log(obj)
    var phonenameindex;
    var phoneTimeindex;
    // 判断手机品牌
    switch (obj.lost_phone_brand) {
      case 'iphone':
        phonenameindex = 0;
        break;
      case '华为':
        phonenameindex = 1;
        break;
      case 'oppo':
        phonenameindex = 2;
        break;
      case 'vivo':
        phonenameindex = 3;
        break;
      case '三星':
        phonenameindex = 4;
        break;
      case '其他':
        phonenameindex = 5;
        break;
    }
    // 判断购买时间
    switch (obj.lost_phone_purchasingDate) {
      case '2013-01-01':
        phoneTimeindex = 0;
        break;
      case '2014-01-01':
        phoneTimeindex = 1;
        break;
      case '2015-01-01':
        phoneTimeindex = 2;
        break;
      case '2016-01-01':
        phoneTimeindex = 3;
        break;
      case '2017-01-01':
        phoneTimeindex = 4;
        break;
      case '2018-01-01':
        phoneTimeindex = 5;
        break;
    }
    that.setData({
      policeDetail:{
        'alarm_time': obj.alarm_time,
        'alarm_people_name': obj.alarm_people_name,
        'owner_name': obj.owner_name,
        "alarm_type": obj.alarm_type,
        'lost_phone_brand': obj.lost_phone_brand,
        'lost_phone_number': obj.lost_phone_number,
        "imei1": obj.imei1,
        'imei2': obj.imei2,
        'lost_phone_serialNumber': obj.lost_phone_serialNumber,
        'lost_phone_model': obj.lost_phone_model,
        "find_case_time": obj.find_case_time,
        'find_case_place': obj.find_case_place,
        'find_case_place_replenish': obj.find_case_place_replenish, 
        'find_case_longitude': obj.find_case_longitude,
        'find_case_latitude': obj.find_case_latitude,
        'lost_phone_purchasingDate': obj.lost_phone_purchasingDate,
        'contact_number': obj.contact_number,
        'id': obj.id,
        'phonenameindex': phonenameindex,
        'phoneTimeindex': phoneTimeindex
      }   
    })
    wx.setStorageSync('policeDetail', that.data.policeDetail) 
    console.log(obj.alarm_type) 
    // 判断报警事由
    if (obj.alarm_type == 1){
      that.setData({
        'alarm_type':'被盗'
      })
    } else if (obj.alarm_type == 2){
      that.setData({
        'alarm_type': '被抢'
      })
    } else if (obj.alarm_type == 3) {
      that.setData({
        'alarm_type': '被骗'
      })
    };
    // 判断报警状态
    switch (obj.alarm_status) {
      case 1:
        that.setData({
          alarm_status :'报警成功'
        })
        break;
      case 2:
        that.setData({
          alarm_status: '撤销成功'
        })
        break;
    }
    if(obj.alarm_status == 2){
      that.setData({
        disabled:true
      })
      
    }
    console.log(that.data.alarm_type)
  },
  // 撤销报警
  revocationStep:function(e){
    var that = this;
    if (that.data.status ==2){
      this.setData({
        disabled: true
      })
      
    }else{
      wx.redirectTo({
        url: '../revocationVideo/revocationVideo'
      })
    }
    
  },
  // 补全信息
  completeInfor:function(){
    var that = this;
    if (that.data.status == 2) {
      this.setData({
        disabled: true
      })

    } else {
      wx.navigateTo({
        url: '../replenishInfor/replenishInfor',
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