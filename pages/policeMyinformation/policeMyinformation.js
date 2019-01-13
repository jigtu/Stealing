// pages/policeMyinformation/policeMyinformation.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgarr: [],
    policeTel:'',
    checkmain: false,
    // mark: false,
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
        })
      }
    })
    // 获取姓名\身份证
    wx.getStorage({
      key: 'policeInfor',
      success: function (res) {
        that.setData({
          people_name: res.data.people_name,
          people_idCard: res.data.people_idCard,
          policeTel: res.data.alarm_people_phone
        })
      }
    })
    // 获取caseType
    wx.getStorage({
      key: 'caseInfor',
      success: function (res) {
        that.setData({
          caseType:res.data.caseType
        })      
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
    wx.getStorage({
      key: 'policeInfor',
      success: function (res) {
        that.setData({
          policeType: res.data.policeType
        })
      }
    })
  },
  // 报警人姓名
  policeUser: function (e) {
    this.setData({
      people_name: e.detail.value
    })
  },
  // 报警人身份证号
  policeIdcard: function (e) {
    this.setData({
      people_idCard: e.detail.value
    })
  },

  // 报警人电话
  policeTel: function (e) {
    this.setData({
      policeTel: e.detail.value
    })
  },
  
  // 跳转设备信息
  phoneStep: function () {
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.policeType == true && that.data.caseType == true && that.data.phoneType == true) {
      if (that.data.people_name == '' || that.data.people_idCard == '' || that.data.policeTel == '') {
        wx.showToast({
          title: '请把本页信息填写完整！',
          icon: 'none',
          duration: 1500
        })
        return false;
      } 
      else {
        if (that.data.checkmain == true){
          that.setData({
            caseInfor: {
              owner_name: that.data.people_name,
              owner_card_id: that.data.people_idCard
            }
          })
          wx.setStorageSync('caseInfor', that.data.caseInfor)
        }
        that.setData({
          policeInfor: {
            people_name: that.data.people_name,
            people_idCard: that.data.people_idCard,
            alarm_people_phone: that.data.policeTel,
            policeType: true
          }
        })
        wx.setStorageSync('policeInfor', that.data.policeInfor)
        wx.redirectTo({
          url: "../policePhoneinfor/policePhoneinfor"
        })

      }
    }
    else{
      this.setData({
        disabled: true
      })
    }
  }, 
  // 跳转案件信息
  caseStep: function (e) {
    var that = this;
    console.log(that)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.policeType == true && that.data.caseType == true) {
      console.log(3333)
      if (that.data.people_name == '' || that.data.people_idCard == '' || that.data.policeTel == '') {
        wx.showToast({
          title: '请把本页信息填写完整！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      else {
        if (that.data.checkmain == true) {
          that.setData({
            caseInfor: {
              owner_name: that.data.people_name,
              owner_card_id: that.data.people_idCard
            }
          })
          wx.setStorageSync('caseInfor', that.data.caseInfor)
        }
        that.setData({
          policeInfor: {
            people_name: that.data.people_name,
            people_idCard: that.data.people_idCard,
            alarm_people_phone: that.data.policeTel,
            policeType: true
          }
        })
        wx.setStorageSync('policeInfor', that.data.policeInfor)
        wx.redirectTo({
          url: "../policeEventinformation/policeEventinformation"
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
  userinforStep: function (e) {
    var that = this;
    console.log(that.data.checkmain)
    console.log(that)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.people_name == '' || that.data.people_idCard == '' ||that.data.policeTel ==''){
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
      // 报警人和受害人为同一人
      if (that.data.checkmain == true) {
        console.log(that)
        that.setData({
          caseInfor: {
            owner_name: that.data.people_name,
            owner_card_id: that.data.people_idCard,
            find_case_time:''
          }
        })
        wx.setStorageSync('caseInfor', that.data.caseInfor)
      }
      that.setData({
        policeInfor: {
          people_name: that.data.people_name,
          people_idCard: that.data.people_idCard,
          alarm_people_phone: that.data.policeTel,
          policeType:true,
          checkmain: that.data.checkmain
        }
      })
      wx.setStorageSync('policeInfor', that.data.policeInfor)
      wx.redirectTo({
        url: "../policeEventinformation/policeEventinformation"
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