const app = getApp();
const config = require('../../config.js');
// const store = db.collection('store');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:0,
    latitude: 0,
    mapSubKey: config.mapSubKey,
    windowHeight: 624,
    defaultScale:15,
    mapId:"mapId"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.setData({
     windowHeight: app.globalData.windowHeight,
     defaultScale: config.default_scale
   })
    this.getCenterLocation()
  },
   /**
   * 获取用户经纬度
   */
  getCenterLocation: function () {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        console.log(
          "当前中心点的位置：",
          this.data.longitude,
          this.data.latitude
        );
        this.moveTolocation()
      },
      fail: (err) => {
        wx.showToast({
          title: "GPS定位失败",
          icon: "fail",
        });
        console.log("err", err);
      },
    });
  },
  // 回到当前位置
  moveTolocation: function () {
    //mapId 就是你在 map 标签中定义的 id
    let Id = this.data.mapId
    var mapCtx = wx.createMapContext(Id);
    mapCtx.moveToLocation();
  }
})