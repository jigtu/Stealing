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
    addressInputname:'搜索地点',
    scale:'18',
    controls: [{
      id: 1,
      iconPath: '../../public/marke.png',
position: {
        left: 180,
        top: 270,
        width: 30,
        height: 40
      },
      clickable: true
    }],
    mapStreettext:'',
    mapcitytext:'',
    eventPlace: '',
    otherTextarea: '',
    eventTimearray: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  },
  onLoad: function () {
    var that=this;
    // 获取案件信息
    wx.getStorage({
      key: 'caseInfor',
      success: function (res) {
        var str = res.data.find_case_time;
        var eventDate = str.split(" ")[0];
        var eventTime = parseInt(str.split(" ")[1]);
        console.log(str)
        console.log(eventDate)
        console.log(eventTime)
        that.setData({
          policeConType: res.data.alarm_type,
          losterName: res.data.owner_name,
          losterIdcard: res.data.owner_card_id,
          eventDate: eventDate,
          eventTimeindex: eventTime,
          eventPlace: res.data.find_case_place,
          otherTextarea: res.data.find_case_place_replenish,
          caseType: res.data.caseType
        })
      }
    })
    if (app.globalData.search) {
      var location = app.globalData.search.location;
      that.mapCtx = wx.createMapContext("map");
      demo.reverseGeocoder({
        location: {
          latitude: location.lat,
          longitude: location.lng
        },
        success: function (res) {
          var str = res.result.formatted_addresses.recommend;
          var str2 = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district;
          var str3 = res.result.address_component.street_number;
          var mapStreettext = str.replace(/\(.*?\)/g, '');
          that.setData({
            mapStreettext: mapStreettext,
            addressInputname: mapStreettext,
            mapcitytext: res.result.address,
            eventPlace: str2,
            otherTextarea: str3
          })

        }
      });
       that.setData({
         longitude: location.lng,
         latitude: location.lat
       })
      }else{
      that.mapCtx = wx.createMapContext("map"); // 地图组件的id
      that.movetoPosition();
      wx.getLocation({
        type: "gcj02", // 坐标系类型
        // 获取经纬度成功回调
        success: (res) => { // es6 箭头函数，可以解绑当前作用域的this指向，使得下面的this可以绑定到Page对象
          this.setData({  // 为data对象里定义的经纬度默认值设置成获取到的真实经纬度，这样就可以在地图上显示我们的真实位置
            longitude: res.longitude,
            latitude: res.latitude
          })
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
                addressInputname: mapStreettext,
                mapcitytext: res.result.address,
                eventPlace: str2,
                otherTextarea: str3
              })

            }
          });
        }
      });  
     
      }
   
  },

  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },

  //点击确定事件
  mapsure: function (e) {
    var that = this;
    var eventTimeindex = that.data.eventTimeindex;
    var eventTime = that.data.eventTimearray[eventTimeindex];
 
    //在另外页面取这个值
    app.globalData.Permanentaddress = that.data.mapStreettext;
    that.setData({
      caseInfor: {
        alarm_type: that.data.policeConType,
        owner_name: that.data.losterName,
        owner_card_id: that.data.losterIdcard,
        find_case_time: that.data.eventDate + ' ' + eventTime,
        find_case_place: that.data.eventPlace,
        alarm_place: that.data.regionCall,
        find_case_place_replenish: that.data.otherTextarea,
        caseType: true,
        find_case_longitude: that.data.longitude,
        find_case_latitude: that.data.latitude,
        alarm_longitude: that.data.alarm_longitude,
        alarm_latitude: that.data.alarm_latitude,
      }
    })
    wx.setStorageSync('caseInfor', that.data.caseInfor)
    //跳转
    if (that.data.eventPlace) {
      wx.redirectTo({
        url: '../policeEventinformation/policeEventinformation',
      })
    }
  },
  //地图点击加减号
  mapProportions:function(e){
    var vlaue = e.currentTarget.dataset.map;
    var that=this;
    if(vlaue==1){//代表放大地图
      if (that.data.scale < 20) {
        that.setData({
          scale: ++that.data.scale
        })
      }
    }else{ //代表缩小地图
      if (that.data.scale > 5) {
        that.setData({
          scale: --that.data.scale
        })
      }
    }
  },
  //点击跳转当前所在位置
  mapcurrent:function(e){
    var that=this;
    that.mapCtx = wx.createMapContext("map"); // 地图组件的id
    that.movetoPosition();
  },
 

  //点击搜索地点框
  searchaddress:function(e){
   wx.navigateTo({
     url: './search',
   })
  },
  //地图拖动实时获取经纬度
  regionchange: function (e) {
    var that = this;
    if (e.type == 'end') {
      that.mapCtx.getCenterLocation({
        success: function (res) {
          // 调用接口
          demo.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
              var str= res.result.formatted_addresses.recommend;
              var str2 = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district;
              var str3 = res.result.address_component.street_number;
              var mapStreettext = str.replace(/\(.*?\)/g, '');
              that.setData({
                mapStreettext: mapStreettext,
                addressInputname: mapStreettext,
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