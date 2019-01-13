const app = getApp();
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    IDCarddisplay:true,
    Positivedisplay:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res)
        that.setData({
          openid: res.data
        })
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
    const ctx = wx.createCameraContext();
    // 旋转照片
    var animation = wx.createAnimation({
      duration: 0,
      transformOrigin: '50% 28%'
    });
    animation.rotate(-90).step();
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
          wx.uploadFile({
            url: app.globalData.apiUrl + 'appeal/idCardFrontUpload',
            filePath: PositiveImage,
            header: { "content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            name: 'file',
            formData: {
              openid: that.data.openid
            },
            success: function (res) {
              var datas = JSON.parse(res.data);
              wx.hideLoading();
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
                back: 3
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
            animationData: animation.export()
          })
          wx.uploadFile({
            url: app.globalData.apiUrl + 'appeal/idCardBackUpload',
            filePath: OthersideImage,
            header: { "content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            name: 'file',
            formData: {
              openid: that.data.openid
            },
            success: function (res) {
              wx.hideLoading();
              var datas = JSON.parse(res.data);
              console.log(datas);
              if (datas.code == "200") {
                that.setData({
                  front: 2,
                  "imgarr[2]": OthersideImage
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
                front: 3
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
      wx.request({
        url: app.globalData.apiUrl + 'appeal/appealOcrDiscern',
        data: {
          openid: that.data.openid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (res) {
          if (res.data.code == '200') {
            wx.hideLoading();
            //识别出来身份证号码
            var people_idCard = res.data.data.people_idCard;
            //识别出来姓名
            var people_name = res.data.data.people_name;
           that.setData({
             appealInfo: {
               apppeople_name:people_name,
               apppeople_idCard:people_idCard,
               IDCardFront: that.data.IDCardimage1,
               IDCardafter: that.data.IDCardimage2
             }
           })
           wx.setStorageSync('appealInfo', that.data.appealInfo)
            wx.navigateTo({
              url: '../appeal/info',
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