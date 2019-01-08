// pages/policePhoto/policePhoto.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IDCarddisplay: true,
    Positivedisplay: 0,
    mark: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      verify: {
        alarm_people_photo: '',
        backPhoto: '',
        frontPhoto: ''
      },
      policeInfor: {
        people_name: '',
        people_idCard: '',
        alarm_people_phone: '',
        policeType: false
      },
      caseInfor: {
        alarm_type: '',
        owner_name: '',
        owner_card_id: '',
        find_case_time: '',
        find_case_place: '',
        alarm_place: '',
        find_case_place_replenish: '',
        find_case_longitude:'',
        find_case_latitude:'',
        alarm_longitude:'',
        alarm_latitude:'',
        caseType: false
      },
      phoneInfor: {
        lost_phone_number: '',
        lost_phone_brand: '',
        lost_phone_model: '',
        lost_phone_purchasingDate: '',
        IMEI1: '',
        IMEI2: '',
        lost_phone_serialNumber: '',
        lost_otherFeatures: '',
        phoneType: false,
        phonenameindex: 0,
        phoneTimeindex: 0
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      }
    })  
  },
  // 拍摄身份证正反面
  takePhoto: function (e) {
    var that = this;
    var justbackindex = e.currentTarget.dataset.cardshot;
    wx.showLoading({
      title: '照片上传中',
      mask: true
    });
    that.setData({
      mark: true
    })
    const ctx = wx.createCameraContext();
    // 旋转照片
    var animation = wx.createAnimation({
      duration: 0,
      transformOrigin: '50% 28%'
    });
    var animation2 = wx.createAnimation({
      duration: 0,
      transformOrigin: '50% 28%'
    });
    animation.rotate(-90).step();
    animation2.rotate(-90).step();
    if (justbackindex == 1) { //人像面
      ctx.takePhoto({
        quality: 'low',
        success: (res) => {
          var PositiveImage = res.tempImagePath;
          that.setData({
            Positivedisplay: 0,
            IDCarddisplay: true,
            IDCardimage1: PositiveImage,
            animationData: animation.export()
          })
          console.log(that.data.IDCardimage1)
          wx.uploadFile({
            url: app.globalData.apiUrl + 'alarm/idCardFrontUpload.do',
            filePath: PositiveImage,
            header: { "content-Type": "application/x-www-form-urlencoded"},
            method: 'POST',
            name: 'file',
            formData: {
              alarm_people_openid: that.data.openid
            },
            success: function (res) {
              console.log(res)
              var datas = JSON.parse(res.data);
              wx.hideLoading();
              that.setData({
                mark:false
              })
              if (datas.code == "200") {
                that.setData({
                  back: 2,
                })
                if (that.data.back == 2 && that.data.front == 2) {
                  that.setData({
                    next: true
                  })
                }
              }
              else if (datas.code == "300") {
                wx.showModal({
                  content: datas.desc,
                  showCancel: false,
                  success: function (res) {
                    that.setData({
                      back: 3
                    })
                  }
                })
              }

            },
            fail: function (r) {
              that.setData({
                back: 3,
                mark: false
              })
            }
          })
        }
      })
    } else { //国徽面
      ctx.takePhoto({
        quality: 'low',
        success: (res) => {
          var OthersideImage = res.tempImagePath;
          that.setData({
            Positivedisplay: 0,
            IDCarddisplay: true,
            IDCardimage2: OthersideImage,
            animationData2: animation2.export()
          })
          wx.uploadFile({
            url: app.globalData.apiUrl + 'alarm/idCardBackUpload.do',
            filePath: OthersideImage,
            header: { "content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            name: 'file',
            formData: {
              alarm_people_openid: that.data.openid
            },
            success: function (res) {
              wx.hideLoading();
              that.setData({
                mark: false
              })
              var datas = JSON.parse(res.data);
              console.log(datas);
              if (datas.code == "200") {
                that.setData({
                  front: 2,
                })
                if (that.data.back == 2 && that.data.front == 2) {
                  that.setData({
                    next: true
                  })
                }
              }
              else if (datas.code == "300") {
                wx.showModal({
                  content: datas.desc,
                  showCancel: false,
                  success: function (res) {
                    that.setData({
                      front: 3
                    })
                  }
                })
              }
            },
            fail: function (r) {
              that.setData({
                front: 3,
                mark:false
              })
            }
          })
        }
      })
    }
  },
  //身份认证点击下一步
  startAttestation: function () {
    var that = this;
    if (that.data.next == true) {
      wx.showLoading({
        title: '正在识别身份证',
        mask: true
      });
      that.setData({
        mark:true
      })
      wx.request({
        url: app.globalData.apiUrl + 'alarm/alarmOcrDiscern.do',
        data: {
          alarm_people_openid: that.data.openid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (res) {
          if (res.data.code == '200') {
            wx.hideLoading();
            that.setData({
              mark:false,
              Complainant: 1,
              IDCarddisplay: false,
              verify: {
                alarm_people_photo: app.globalData.alarm_people_photo,
                backPhoto: that.data.IDCardimage1,
                frontPhoto: that.data.IDCardimage2
              },
              policeInfor: {
                people_name: res.data.data.people_name,
                people_idCard: res.data.data.people_idCard,
                alarm_people_phone: '',
                policeType: false,
                checkmain: false
              },
              caseInfor: {
                alarm_type: '',
                owner_name: '',
                owner_card_id: '',
                find_case_time: '',
                find_case_place: '',
                find_case_longitude: '',
                find_case_latitude: '',
                alarm_place: '',
                alarm_longitude: '',
                alarm_latitude: '',
                find_case_place_replenish: '',
                caseType: false
              },
              phoneInfor: {
                lost_phone_number: '',
                lost_phone_brand: '',
                lost_phone_model: '',
                lost_phone_purchasingDate: '',
                IMEI1: '',
                IMEI2: '',
                lost_phone_serialNumber: '',
                lost_otherFeatures: '',
                phoneType: false,
                phonenameindex: 0,
                phoneTimeindex: 0
              },
            })
            wx.setStorageSync('verify', that.data.verify)
            wx.setStorageSync('policeInfor', that.data.policeInfor)
            wx.setStorageSync('caseInfor', that.data.caseInfor)
            wx.setStorageSync('phoneInfor', that.data.phoneInfor)
            wx.redirectTo({
              url: '../policeMyinformation/policeMyinformation',
            })

          }
          else if (res.data.code == 300) {
            wx.showModal({
              content: res.data.desc,
              showCancel: false,
              success: function (res) {
                console.log(res)
              }
            })
          }
        }
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  //点击拍摄按钮显示拍摄身份证
  takeBackPhoto: function (e) {
    var that = this;
    var evalue = e.currentTarget.dataset.photo;
    that.setData({
      Positivedisplay: evalue,
      IDCarddisplay: false
    })
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