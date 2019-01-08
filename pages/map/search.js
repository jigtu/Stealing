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

  /**
   * 页面的初始数据
   */
  data: {
    searchmaindisplay:true,
    addressName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
    
  },
  //input输入事件
  bindKeyInput: function (e) {
    var that = this;
    var value = e.detail.value;
    if(!value){
     that.setData({
       searchmaindisplay:false
     })
    }else{
      that.setData({
        searchmaindisplay: true,
        addressName:value
      })
    }
    // 调用接口
    demo.getSuggestion({
      keyword: value,
      region:'北京市',
      success: function (res) {
        var dataValue=res.data;
        that.setData({
          sugData: res.data,
          sugDatadisplay:true
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  // 点击删除按钮事件
  searchvaluedetail:function(e){
    this.setData({
      addressName:'',
      searchmaindisplay:false
    })
  },
  //点击搜索结果某一项
  mapBackoff:function(e){
 
    var itemvlaue = e.currentTarget.dataset.item;
    console.log(itemvlaue.location);
    if(itemvlaue){
      app.globalData.search = itemvlaue;
      wx.navigateTo({
        url: './map',
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