// pages/policeVideo/policeVideo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Complainant:0,
    Initialcomplaint: 0,
    imgarr:[],
    next:false,
    appealReasonarray: ['收到盗抢手机提示闪信、短信', '其他'],
    appealReasonindex: '',
    mesList: [
      {
        'num': '1.',
        'con': '拨号盘拨打*#06#;'
      },
      {
        'num': '2.',
        'con': '设置-关于手机-手机串号(IMEI)'
      }
    ],
    region: ['', '', ''],
    regionoften: ['', '', ''],
    AppealList: {},
    addTwoImg: false,
    Selectdropdown: true,
    Selectdropdown2: true,
    Selectdropdown3: true,
    Selectdropdown4: true,
    maskShow: false,
    mark: false,
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
        console.log(that.data.openid)
      }
    })
    console.log(app.globalData.appealVideoImg);

    // 获取身份证信息
    wx.getStorage({
      key: 'appealInfo',
      success: function (res) {
         console.log(res);
         that.setData({
           "imgarr[0]":app.globalData.appealVideoImg,
           "imgarr[1]": res.data.IDCardFront, 
           "imgarr[2]": res.data.IDCardafter, 
           people_name: res.data.apppeople_name, 
           people_idCard: res.data.apppeople_idCard, 
         })
      }
    })
  },

 
  // 申诉人姓名
   AppealUser: function (e) {
    this.setData({
      peopleName: e.detail.value
    })
  },
  // 申诉人身份证号
  AppealIdcard: function (e) {
    this.setData({
      peopleIdCard: e.detail.value
    })
  },
  // 申诉人电话
  AppealTel: function (e) {
    this.setData({
      AppealTelphone: e.detail.value
    })
  },
  //申诉人常住地
  AppealplaceChange: function (e) {
    this.data.AppealList.appeal_usual_addr = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      regionoften: e.detail.value,
      Selectdropdown2: true
    })
  },
  //常住地取消选择
  Cancelthechoice2: function (e) {
    this.setData({
      Selectdropdown2: true
    })
  },
  //点击申诉input事件
  Choosecomplaint2: function (e) {
    this.setData({
      Selectdropdown2: false
    })
  },
  // 申诉人信息点击下一步
  userinforStep: function (e) {
    var that = this
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var Idcradreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (that.data.people_idCard){
      that.data.peopleIdCard = that.data.people_idCard
    }
    if (that.data.people_name){
      that.data.peopleName = that.data.people_name;
    }
    
    if (!that.data.peopleName) {
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!that.data.peopleIdCard){
      wx.showToast({
        title: '请输入身份证号！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!that.data.AppealTelphone){
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return;
    }else if (!that.data.AppealList.appeal_usual_addr) {
      wx.showToast({
        title: '请选择常住地！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!myreg.test(that.data.AppealTelphone)) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!Idcradreg.test(that.data.peopleIdCard)) {
      wx.showToast({
        title: '身份证不正确',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      that.setData({
        Complainant: 2,
        Initialcomplaint: 1,
      })
      wx.setNavigationBarTitle({
        title: '申诉信息',
      })
      //获取定位经纬度
      wx.getLocation({
        type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          //  longitude 经度
          // latitude 纬度
          that.data.AppealList.appeal_longitude = res.longitude;
          that.data.AppealList.appeal_latitude = res.latitude;
       
          wx.request({ // ②百度地图API，将微信获得的经纬度传给百度，获得城市等信息
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=GzpEL9HxYMYaRl8qUKH0UWeZC2EvnYgH&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
            data: {},
            header: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            success: function (res) {
              // 拼接城市名和区名
              var address = res.data.result.addressComponent.city + res.data.result.addressComponent.district;
              that.data.AppealList.appeal_addr = address;
            },
            fail: function () {
              // fail
            }
          })
        }
      })
     
    }
  },
  // 申诉原因
  appealReasonChange: function (e) {
    var that = this;
    //取到下拉选择原因
    this.data.AppealList.appeal_cause = that.data.appealReasonarray[e.detail.value];
    this.setData({
      appealReasonindex: e.detail.value,
      Selectdropdown: true,
      blackFont:true
    })

    if (e.detail.value == 1) {
      that.setData({
        otherShow: true
      })
    } else {
      that.setData({
        otherShow: false,
        otherAppealReason: ''
      })
    }
  },
  //申诉原因取消选择
  Cancelthechoice: function (e) {
    this.setData({
      Selectdropdown: true
    })
  },
  //点击申诉input事件
  Choosecomplaint: function (e) {
    this.setData({
      Selectdropdown: false
    })
  },
  //购买地点
  bindRegionChange: function (e) {
    this.data.AppealList.buying_addr = e.detail.value;
    this.setData({
      region: e.detail.value,
      Selectdropdown3: true
    })
  },
  //购买地点取消选择
  Cancelthechoice3: function (e) {
    this.setData({
      Selectdropdown3: true
    })
  },
  //点击购买地点input事件
  Choosecomplaint3: function (e) {
    this.setData({
      Selectdropdown3: false
    })
  },
  // 购买时间
  payDateChange: function (e) {
    this.data.AppealList.buying_time = e.detail.value;
    this.setData({
      payDate: e.detail.value,
      Selectdropdown4: true
    })
  },
  //购买时间取消选择
  Cancelthechoice4: function (e) {
    this.setData({
      Selectdropdown4: true
    })
  },
  //点击购买时间input事件
  Choosecomplaint4: function (e) {
    this.setData({
      Selectdropdown4: false
    })
  },
  //点击我知道了按钮事件
  callPolice: function (e) {
    this.setData({
      mark: false
    })
  },
  //从申诉信息跳转到申诉人
  Complainantjump: function (e) {
    
    this.setData({
      Complainant: 0,
      Initialcomplaint:1
    })
    wx.setNavigationBarTitle({
      title: '申诉人信息',
    })
  },
  //从申诉人跳转到申诉信息
  Appealsjump: function (e) {
    this.setData({
      Complainant: 2,
    })
    wx.setNavigationBarTitle({
      title: '申诉信息',
    })
  },
  //手机串号提示
  SerialPrompt: function (e) {
    this.setData({
      mark: true
    })
  },
  // 添加图片
  addFirstImg: function (e) {
    var that = this;
    let imgNum = e.currentTarget.dataset.imgnum;
    //等于1，代表上传第一张图片
    if (imgNum == 1) {
      wx.chooseImage({
        count: 1, // 上传张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res);
          that.data.AppealList.file = res.tempFilePaths[0]
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            'imgAll[0]': res.tempFilePaths[0],
            img1: res.tempFilePaths,
            imgOne: true,
          })
        }
      })
    } else {
      //否则是第二张
      wx.chooseImage({
        count: 1, // 上传张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.data.AppealList.file2 = res.tempFilePaths[0]
          that.setData({
            'imgAll[1]': res.tempFilePaths[0],
            img1: res.tempFilePaths,
            imgOne2: true,
            addTwoImg: true
          })
        }
      })
    }

  },
  //删除图片
  detailImg: function (e) {
    var that = this;
    let imgNum = e.currentTarget.dataset.imgnum;

    // 如果是1就是删除第一张图片
    if (imgNum == 1) {
      that.setData({
        'imgAll[0]': '',
        imgOne: false,
      })
    } else {
      that.setData({
        'imgAll[1]': '',
        imgOne2: false,
      })
    }
  },
  //点击确认，提交表单事件
  formSubmit: function (e) {
    var that = this;
    var value = e.detail.value;
    var valueImei = value.imei.replace(/\s+/g, "");
    var Imeiregex = /^[0-9]{15,17}$/;
    //非空验证 
    if (!value.cellphone_features) {
      wx.showToast({
        title: '请填写品牌型号！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!value.contact_number) {
      wx.showToast({
        title: '请填写手机号码！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!value.name) {
      wx.showToast({
        title: '请填写申诉人姓名！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!value.imei) {
      wx.showToast({
        title: '请填写手机串号！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!value.id_card) {
      wx.showToast({
        title: '请填写申诉人身份证号码！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!that.data.AppealList.appeal_cause) {
      wx.showToast({
        title: '请选择申诉原因！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (that.data.AppealList.appeal_cause == '其他' && !value.other_appeal_cause) {
      wx.showToast({
        title: '请填写申诉原因！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!that.data.AppealList.buying_time) {
      wx.showToast({
        title: '请选择购买时间！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!that.data.AppealList.buying_addr) {
      wx.showToast({
        title: '请选择购买地点！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!that.data.AppealList.appeal_usual_addr) {
      wx.showToast({
        title: '请选择现住地！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!Imeiregex.test(valueImei)) {
      wx.showToast({
        title: '手机串号不正确！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(value);
    console.log(that.data.AppealList);
    var appeal_latitude = that.data.AppealList.appeal_latitude.toString();
    var appeal_longitude = that.data.AppealList.appeal_longitude.toString();
    var buying_str = that.data.AppealList.buying_addr.join(",");
    var buying_addr = buying_str.replace(/,/g, '');
    var appeal_usual_str = that.data.AppealList.appeal_usual_addr.join(",");
    var appeal_usual_addr = appeal_usual_str.replace(/,/g, '');
    var appeal_addr = that.data.AppealList.appeal_addr.toString();

    wx.showLoading({
      title: '正在提交申诉信息',
      mask: true
    });
    wx.uploadFile({
      url: app.globalData.apiUrl + 'appeal/submissionAppealInformation.do',
      filePath: that.data.AppealList.file,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      name: 'file',
      formData: {
        openid: that.data.openid,
        name: value.name,
        id_card: value.id_card,
        contact_number: value.contact_number,
        appeal_addr: appeal_addr,
        appeal_usual_addr: appeal_usual_addr,
        buying_addr: buying_addr,
        appeal_longitude: appeal_longitude,
        appeal_latitude: appeal_latitude,
        appeal_cause: that.data.AppealList.appeal_cause,
        other_appeal_cause: value.other_appeal_cause,
        cellphone_features: value.cellphone_features,
        buying_time: that.data.AppealList.buying_time,
        imei: valueImei
      },
      success: function (res) {
        var data = res;
        //如果有第二张图片，再调一个接口 
        if (that.data.addTwoImg) {
          wx.uploadFile({
            url: app.globalData.apiUrl + 'appeal/setImageBase64Ecidence.do',
            filePath: that.data.AppealList.file2,
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            name: 'file',
            formData: {
              openid: that.data.openid,
            },
            success: function (res) {
              var data = res;
              console.log(data);
            },
            fail: function (r) {
              console.log(r);
            }
          })
        }
        wx.hideLoading();
        wx.showModal({
          content: '申诉提交成功，请保持手机畅通!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            } else {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res);
        wx.showModal({
          content: '申诉失败，请稍后重新申诉!',
          success: function (res) {

          }
        })
      }
    })
   

  },
  /**
   * 
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})