// pages/policePhoneinfor/policePhoneinfor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenamearray: ['Iphone', '华为', 'OPPO', 'vivo', '三星','其他'],
    phonenameindex: 0,
    phoneTimearray: ['2013', '2014', '2015', '2016', '2017', '2018'],
    phoneTimeindex: 0,
    phonename:'',
    otherShow:false,
    contentmark:false,
    mark:false,
    code: false,
    markTip: false,
    Selectdropdown: true,
    Selectdropdown2: true,
    success:false

  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    console.log(that)
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      }
    })
    //获取报警事由
    wx.getStorage({
      key: 'caseInfor',
      success: function (res) {
        that.setData({
          alarm_type: res.data.alarm_type
        })
        console.log(that.data.alarm_type)
      }
    })
    if (that.data.alarm_type == 1) {
      that.setData({
        alarm_typeCon: '被盗'
      })
    }
    else if (that.data.alarm_type == 2) {
      that.setData({
        alarm_typeCon: '被抢'
      })
    }
    else if (that.data.alarm_type == 3) {
      that.setData({
        alarm_typeCon: '被骗'
      })
    }
    // 获取policeType
    wx.getStorage({
      key: 'policeInfor',
      success: function (res) {
        that.setData({
          policeType: res.data.policeType
        })
      }
    })
    // caseType
    wx.getStorage({
      key: 'caseInfor',
      success: function (res) {
        that.setData({
          caseType: res.data.caseType
        })
      }
    })
    // 获取缓存数据
    wx.getStorage({
      key: 'phoneInfor',
      success: function (res) {  
        // var str = res.data.lost_phone_purchasingDate;
        // var phoneTime = str.split("-")[0];  
        // console.log(phoneTime) 
        that.setData({
          losterTel: res.data.lost_phone_number,
          secondlosterTel: res.data.lost_phone_number,
          phonename: res.data.lost_phone_brand,
          phoneSize:res.data.lost_phone_model,
          phoneTime: res.data.lost_phone_purchasingDate,
          IMEI1: res.data.IMEI1,
          IMEI2: res.data.IMEI2,
          bindNumber: res.data.lost_phone_serialNumber,
          otherTextarea: res.data.lost_otherFeatures,
          phoneType: res.data.phoneType,
          phonenameindex: res.data.phonenameindex,
          phoneTimeindex: res.data.phoneTimeindex
        })
        // console.log(res.data.phonenameindex)
        // console.log(res.data.phoneTimeindex)
        // console.log(res.data.phoneType)
        
        
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
    console.log(that.data.Selectdropdown)
    if (e.detail.value ==5){ 
      that.setData({
        phonename:'输入其他品牌',
        otherShow:true,
        phonename: that.data.otherPhoneName
      })
    }else{
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
      Selectdropdown2: true
    })
  },
  //手机品牌取消选择
  Cancelthechoice2: function (e) {
    this.setData({
      Selectdropdown2: true
    })
  },
  //点击手机品牌input事件
  Choosecomplaint2: function (e) {
    this.setData({
      Selectdropdown2: false
    })
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
  // 其他信息
  otherTextarea: function (e) {
    this.setData({
      otherTextarea: e.detail.value
    })
  },
  // 回访电话
  callbackTel: function (e) {
    this.setData({
      callbackTel: e.detail.value
    })
  },
  // 跳转报警人信息
  policeStep: function () {
    var that = this;
    if (that.data.policeType == true && that.data.caseType == true) {
      var that = this;
      console.log(that)
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;  //手机正则式
      if (that.data.losterTel == '' || that.data.secondlosterTel == '') {
        wx.showToast({
          title: '请把本页必填的信息填写完整！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else if (!myreg.test(that.data.losterTel) || !myreg.test(that.data.secondlosterTel)) { //验证手机号
        wx.showToast({
          title: '手机号有误，请重新输入',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else if (that.data.losterTel != that.data.secondlosterTel) {
        wx.showToast({
          title: '两次输入的手机号不一致，请重新输入',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else {
        if (that.data.otherShow) {
          var phonename = that.data.otherPhoneName;
        } else {
          var phonenameindex = that.data.phonenameindex;
          var phonename = that.data.phonenamearray[phonenameindex];
        }
        var phoneTimeindex = that.data.phoneTimeindex;
        var phoneTime = that.data.phoneTimearray[phoneTimeindex];
        if (that.data.IMEI1 == undefined || that.data.IMEI1 == '') {
          that.data.IMEI1 = '无'
        }
        if (that.data.IMEI2 == undefined || that.data.IMEI2 == '') {
          that.data.IMEI2 = '无'
        }
        if (that.data.bindNumber == undefined || that.data.bindNumber == '') {
          that.data.bindNumber = '无'
        }
        // 缓存手机信息
        that.setData({
          phoneInfor: {
            lost_phone_number: that.data.losterTel,
            lost_phone_brand: phonename,
            lost_phone_model: that.data.phoneSize,
            lost_phone_purchasingDate: phoneTime,
            IMEI1: that.data.IMEI1,
            IMEI2: that.data.IMEI2,
            lost_phone_serialNumber: that.data.bindNumber,
            lost_otherFeatures: that.data.otherTextarea,
            phoneType: true,
            phonenameindex: that.data.phonenameindex,
            phoneTimeindex: that.data.phoneTimeindex
          },
          contentmark: true
        })
        wx.setStorageSync('phoneInfor', that.data.phoneInfor);
        wx.redirectTo({
          url: '../policeMyinformation/policeMyinformation',
        })
      }    
    }else{
      this.setData({
        disabled: true
      })
    }   
    
  },
  // 跳转案件信息
  caseStep:function(){
    var that = this;
    console.log(that)
    if (that.data.policeType == true && that.data.caseType == true) {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;  //手机正则式
      if (that.data.losterTel == '' || that.data.secondlosterTel == '') {
        wx.showToast({
          title: '请把本页必填的信息填写完整！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else if (!myreg.test(that.data.losterTel) || !myreg.test(that.data.secondlosterTel)) { //验证手机号
        wx.showToast({
          title: '手机号有误，请重新输入',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else if (that.data.losterTel != that.data.secondlosterTel) {
        wx.showToast({
          title: '两次输入的手机号不一致，请重新输入',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else {
        if (that.data.otherShow) {
          var phonename = that.data.otherPhoneName
        } else {
          var phonenameindex = that.data.phonenameindex;
          var phonename = that.data.phonenamearray[phonenameindex];
        }
        var phoneTimeindex = that.data.phoneTimeindex;
        var phoneTime = that.data.phoneTimearray[phoneTimeindex];
        if (that.data.IMEI1 == undefined) {
          that.data.IMEI1 = '无'
        }
        if (that.data.IMEI2 == undefined) {
          that.data.IMEI2 = '无'
        }
        if (that.data.bindNumber == undefined) {
          that.data.bindNumber = '无'
        }
        // 缓存手机信息
        that.setData({
          phoneInfor: {
            lost_phone_number: that.data.losterTel,
            lost_phone_brand: phonename,
            lost_phone_model: that.data.phoneSize,
            lost_phone_purchasingDate: phoneTime,
            IMEI1: that.data.IMEI1,
            IMEI2: that.data.IMEI2,
            lost_phone_serialNumber: that.data.bindNumber,
            lost_otherFeatures: that.data.otherTextarea,
            phoneType: true,
            phonenameindex: that.data.phonenameindex,
            phoneTimeindex: that.data.phoneTimeindex
          },
          contentmark: true
        })
        wx.setStorageSync('phoneInfor', that.data.phoneInfor)
        wx.redirectTo({
          url: '../policeEventinformation/policeEventinformation',
        })
        console.log(that.data.phonenameindex)
      }
    }
    else{
      this.setData({
        disabled: true
      })
    }
  },
  // 关闭联系方式
  imghide:function(){
    var that = this;
    that.setData({
      contentmark:false,
      success:false      
    })
  },
  //提交信息
  phoneStep:function(e){
    var that = this;
    console.log(that)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;  //手机正则式
    if (that.data.losterTel == undefined || that.data.losterTel ==''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else if (!myreg.test(that.data.losterTel) || !myreg.test(that.data.secondlosterTel)) { //验证手机号
      wx.showToast({
        title: '手机号有误，请重新输入',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else if (that.data.losterTel != that.data.secondlosterTel){
      wx.showToast({
        title: '两次输入的手机号不一致，请重新输入',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else{
      if (that.data.otherShow) {
        var phonename = that.data.otherPhoneName
      } else {
        var phonenameindex = that.data.phonenameindex;
        var phonename = that.data.phonenamearray[phonenameindex];
      }
      var phoneTimeindex = that.data.phoneTimeindex;
      var phoneTime = that.data.phoneTimearray[phoneTimeindex];
      if (that.data.IMEI1 == undefined) {
        that.data.IMEI1 = '无'
      }
      if (that.data.IMEI2 == undefined) {
        that.data.IMEI2 = '无'
      }
      if (that.data.bindNumber == undefined) {
        that.data.bindNumber = '无'
      }
      if (that.data.phoneSize == undefined) {
        that.data.phoneSize = '无'
      }
      if (that.data.otherTextarea == undefined){
        that.data.otherTextarea ='无'
      }
      // 缓存手机信息
      that.setData({
        phoneInfor: {
          lost_phone_number: that.data.losterTel,
          lost_phone_brand: phonename,
          lost_phone_model: that.data.phoneSize,
          lost_phone_purchasingDate: phoneTime,
          IMEI1: that.data.IMEI1,
          IMEI2: that.data.IMEI2,
          lost_phone_serialNumber: that.data.bindNumber,
          lost_otherFeatures: that.data.otherTextarea,
          phoneType:true,
          phonenameindex: that.data.phonenameindex,
          phoneTimeindex: that.data.phoneTimeindex
        },
        contentmark: true,
        success:true
      })
      wx.setStorageSync('phoneInfor', that.data.phoneInfor)
    }
  },
  // 点击确认
  phoneSure: function (e) {
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;  //手机正则式
    that.setData({
      mark:true,
      
    });
    wx.showLoading({
      title: '信息提交中',
      mask: true
    });
    if (that.data.callbackTel ==''){
      wx.showToast({
        title: '请填写受害人联系方式',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else if (!myreg.test(that.data.callbackTel)){
      wx.showToast({
        title: '手机号有误，请重新输入',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else{
      // 获取报警人信息
      wx.getStorage({
        key: 'policeInfor',
        success: function (res) {
          that.setData({
            people_name: res.data.people_name,
            people_idCard: res.data.people_idCard,
            alarm_people_phone: res.data.alarm_people_phone,
          })
        },
      })
      // 获取案件信息
      wx.getStorage({
        key: 'caseInfor',
        success: function (res) {
          that.setData({
            alarm_type: res.data.alarm_type,
            owner_name: res.data.owner_name,
            owner_card_id: res.data.owner_card_id,
            find_case_time: res.data.find_case_time,
            find_case_place: res.data.find_case_place,
            find_case_longitude: res.data.find_case_longitude,
            find_case_latitude: res.data.find_case_latitude,
            alarm_place: res.data.alarm_place,
            alarm_longitude: res.data.alarm_longitude,
            alarm_latitude: res.data.alarm_latitude,

            find_case_place_replenish: res.data.find_case_place_replenish,
            
          })
        },
      })
      // 获取设备信息
      wx.getStorage({
        key: 'phoneInfor',
        success: function(res) {
          that.setData({
            lost_phone_number: res.data.lost_phone_number,
            lost_phone_brand: res.data.lost_phone_brand,
            lost_phone_model: res.data.lost_phone_model,
            lost_phone_purchasingDate: res.data.lost_phone_purchasingDate,
            IMEI1: res.data.IMEI1,
            IMEI2: res.data.IMEI2,
            lost_phone_serialNumber: res.data.lost_phone_serialNumber
          })
        },
      })
      setTimeout(res,500)
      function res (){
        // var str = that.data.find_case_place;
        // var str2 = str.toString();
        // var find_Case_place2 = str2.replace(/,/g, '');
        // console.log(str)
        // console.log(str2)
        // console.log(find_Case_place2)

        wx.request({
          url: app.globalData.apiUrl + 'alarm/addCaseInfo',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            alarm_people_openid: that.data.openid,
            alarm_people_name: that.data.people_name,
            alarm_people_idCard: that.data.people_idCard,
            alarm_people_phone: that.data.alarm_people_phone,
            is_lost: 0,
            alarm_type: that.data.alarm_type,
            owner_name: that.data.owner_name,
            owner_card_id: that.data.owner_card_id,
            find_case_time: that.data.find_case_time,
            find_case_place: that.data.find_case_place,
            find_case_longitude: that.data.find_case_longitude,
            find_case_latitude: that.data.find_case_latitude,
            find_case_place_replenish: that.data.find_case_place_replenish,
            alarm_place: that.data.alarm_place,
            alarm_longitude: that.data.alarm_longitude,
            alarm_latitude: that.data.alarm_latitude,
            lost_phone_number: that.data.lost_phone_number,
            lost_phone_brand: that.data.lost_phone_brand,
            lost_phone_model: that.data.lost_phone_model,
            lost_phone_purchasingDate: that.data.lost_phone_purchasingDate,
            IMEI1: that.data.IMEI1,
            IMEI2: that.data.IMEI2,
            lost_phone_serialNumber: that.data.lost_phone_serialNumber,
            lost_otherFeatures: that.data.otherTextarea,
            contact_number: that.data.callbackTel
          },
          success: function (res) {
            console.log(res);
            that.setData({
              markTip: false,
              mark:false
            });
            setTimeout(function () {
              wx.hideLoading();
            }, 1000)
            if (res.data.code == '200') {
             
              wx.showModal({
                content: '报警成功，请保持手机畅通',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    // 清除报警缓存
                    app.globalData.checkmain = false;
                    wx.removeStorage({
                      key: 'verify',
                      success: function (res) {
                        console.log(res.data)
                      }
                    })
                    wx.removeStorage({
                      key: 'policeInfor',
                      success: function (res) {
                        console.log(res.data)
                      }
                    })
                    wx.removeStorage({
                      key: 'caseInfor',
                      success: function (res) {
                        console.log(res.data)
                      }
                    })
                    wx.removeStorage({
                      key: 'phoneInfor',
                      success: function (res) {
                        console.log(res.data)
                      }
                    })    
                    wx.switchTab({
                      url: '../index/index'
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
            } else if (res.data.code == 400) {
              wx.showModal({
                content: res.data.desc,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }
                }
              })
            }
          },
          fail:function(res){
            console.log(res)
            that.setData({
              markTip: false,
              mark: false
            });
            wx.showModal({
              content: '提交失败，请重试',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        })
      }
      console.log(that.data.openid+'----'+that.data.people_name
        + '------' + that.data.people_idCard + '------------' + that.data.alarm_people_phone + '------is_lost' + 0 + '------alarm_type' + that.data.alarm_type +'------owner_name'+that.data.owner_name+
        '------owner_card_id'+that.data.owner_card_id+
        '------find_case_time'+that.data.find_case_time+
        '------find_case_place' + that.data.find_case_place+
        '------find_case_longitude'+ that.data.find_case_longitude+
        '------find_case_latitude'+ that.data.find_case_latitude+
        '------find_case_place_replenish'+ that.data.find_case_place_replenish+
        '------alarm_place'+that.data.alarm_place+
        '------alarm_longitude'+ that.data.alarm_longitude+
        '------alarm_latitude'+that.data.alarm_latitude+
        '------lost_phone_number'+ that.data.lost_phone_number+
        '------lost_phone_brand'+that.data.lost_phone_brand+
        '------lost_phone_model'+that.data.lost_phone_model+
        '------lost_phone_purchasingDate'+that.data.lost_phone_purchasingDate+
        '------IMEI1'+that.data.IMEI1+
        '------IMEI2'+ that.data.IMEI2+
        '------lost_phone_serialNumber'+ that.data.lost_phone_serialNumber+
        '------lost_otherFeatures'+that.data.otherTextarea+
        '------contact_number' + that.data.callbackTel)
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
    }, 500)
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