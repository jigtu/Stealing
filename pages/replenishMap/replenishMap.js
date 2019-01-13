// pages/replenishMap/replenishMap.js
var bmap = require('../../utils/bmap-wx.min.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const app = getApp();
var demo = new QQMapWX({
  key: 'PUMBZ-PTAWX-EOM4T-ZBHGT-GOVS3-NWFHN' // 必填
});
var BMap = new bmap.BMapWX({
  ak: 'mbWPHadI2BXzg3LflyWXUOQ8hwyijnq7'
});
Page({
  data: {
    sugData: '',
    latitude: '',
    longitude: '',
    sugDatadisplay: '',
    addressName: '',
    controls: [{
      id: 1,
      iconPath: '../../public/marker_red.png',
      position: {
        left: 170,
        top: 240,
        width: 30,
        height: 30
      },
      clickable: true
    }],
    mapStreettext: '',
    mapcitytext: '',
    eventPlace: '',
    otherTextarea: '',
    eventTimearray: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
  },
  onLoad: function () {
    var that = this;
    var fail = function (data) {
      console.log(data)
    };
    this.mapCtx = wx.createMapContext('map');
    this.mapCtx.moveToLocation();
    // 获取案件信息
    wx.getStorage({
      key: 'policeDetail',
      success: function (res) {
        console.log('res')
        console.log(res)
        var str = res.data.find_case_time;
        var eventDate = str.split(" ")[0];
        var eventTime = parseInt(str.split(" ")[1]) - 1;
        that.setData({
          losterTel: res.data.lost_phone_number,
          secondlosterTel: res.data.lost_phone_number,
          phonename: res.data.lost_phone_brand,
          phoneSize: res.data.lost_phone_model,
          phoneTime: res.data.lost_phone_purchasingDate,
          IMEI1: res.data.IMEI1,
          IMEI2: res.data.IMEI2,
          bindNumber: res.data.lost_phone_serialNumber,
          phonenameindex: res.data.phonenameindex,
          phoneTimeindex: res.data.phoneTimeindex,
          id: res.data.id,
          eventDate: eventDate,
          eventTimeindex: eventTime,
          eventPlace: res.data.find_case_place,
          otherTextarea: res.data.find_case_place_replenish,
          // find_case_longitude: res.data.find_case_longitude,
          // find_case_latitude: res.data.find_case_latitude,
          callbackTel: res.data.contact_number
        })
        console.log('hahahaahaah')
        console.log(that)
      }
    })
    //获取定位经纬度
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // 调用接口
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res)
            var longitude = res.result.location.lng;
            var latitude = res.result.location.lat;
            var str = res.result.formatted_addresses.recommend;
            var str2 = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district;
            var str3 = res.result.address_component.street_number;
            var mapStreettext = str.replace(/\(.*?\)/g, '');
            that.setData({
              mapStreettext: mapStreettext,
              mapcitytext: res.result.address,
              eventPlace: str2,
              otherTextarea: str3
            })
            console.log(that)
          }
        });
        that.setData({
          find_case_longitude: res.longitude,
          find_case_latitude: res.latitude
        })
      }

    })

  },
  //input输入事件
  bindKeyInput: function (e) {
    var that = this;
    if (e.detail.value === '') {
      that.setData({
        sugData: '',
        sugDatadisplay: false
      });
      return;
    } else {
      that.setData({
        sugDatadisplay: true
      });
    }

    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {

      that.setData({
        sugData: data.result
      });
    }
    BMap.suggestion({
      query: e.detail.value,
      region: '全国',
      city_limit: false,
      fail: fail,
      success: success
    });
  },
  //点击确定事件
  mapsure: function (e) {
    var that = this;
    console.log(that)
    var eventTimeindex = that.data.eventTimeindex;
    console.log(eventTimeindex)
    var eventTime = that.data.eventTimearray[eventTimeindex];
    var find_case_time = that.data.eventDate + ' ' + eventTime;
    console.log(eventTime)
    //在另外页面取这个值
    app.globalData.Permanentaddress = that.data.mapStreettext;
    that.setData({
      policeDetail: {
        alarm_people_openid: that.data.openid,
        id: that.data.id,
        lost_phone_number: that.data.losterTel,
        lost_phone_brand: that.data.phonename,
        lost_phone_model: that.data.phoneSize,
        lost_phone_purchasingDate: that.data.phoneTime,
        lost_phone_serialNumber: that.data.bindNumber,
        IMEI1: that.data.IMEI1,
        IMEI2: that.data.IMEI2,
        phonenameindex: that.data.phonenameindex,
        phoneTimeindex: that.data.phoneTimeindex,
        find_case_time: find_case_time,
        eventTimeindex: eventTime,
        find_case_place: that.data.eventPlace,
        find_case_longitude: that.data.find_case_longitude,
        find_case_latitude: that.data.find_case_latitude,
        find_case_place_replenish: that.data.otherTextarea,
        contact_number: that.data.callbackTel
      }
    })
    wx.setStorageSync('policeDetail', that.data.policeDetail)
    //跳转
    if (that.data.eventPlace) {
      wx.redirectTo({
        url: '../replenishEventinfor/replenishEventinfor',
      })
    }
  },
  //取消按钮点击事件
  Cancelsearch: function (e) {
    this.setData({
      sugDatadisplay: false,
      addressName: ''
    })
  },
  //点击下拉显示的地图
  clickmap: function (e) {
    var that = this;
    var list = e.currentTarget.dataset.maplist;
    // 调用接口
    demo.reverseGeocoder({
      location: {
        latitude: list.location.lat,
        longitude: list.location.lng
      },
      success: function (res) {

        var str = res.result.formatted_addresses.recommend;
        var str2 = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district;
        var str3 = res.result.address_component.street_number;
        var mapStreettext = str.replace(/\(.*?\)/g, '');
        that.setData({
          mapStreettext: mapStreettext,
          mapcitytext: res.result.address,
          eventPlace: str2,
          otherTextarea: str3,
          latitude: list.location.lat,
          longitude: list.location.lng,
          sugDatadisplay: false,
          addressName: list.name,
        })
      }
    });


  },

  regionchange: function (e) {
    var that = this;
    if (e.type == 'end') {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          // 调用接口
          demo.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
              var str = res.result.formatted_addresses.recommend;
              var str2 = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district;
              var str3 = res.result.address_component.street_number;
              var mapStreettext = str.replace(/\(.*?\)/g, '');
              that.setData({
                mapStreettext: mapStreettext,
                mapcitytext: res.result.address,
                eventPlace: str2,
                otherTextarea: str3
              })
            }
          });
        }
      })
    }
  }
})