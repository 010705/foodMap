// pages/map/map.js
const db = wx.cloud.database();
const store = db.collection("store");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    latitude: 0,
    longitude: 0,
    nowlongitude: 0,
    nowlatitude: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    this.getCenterLocation();
    console.log(options.id);
    // const res = await store.doc(options.id).get();
    store.doc(options.id).get().then((res) => {
      console.log(res);
      wx.setNavigationBarTitle({
        title: res.data.title,
      });
      this.setData({
        info: res.data,
        latitude:res.data.latitude,
        longitude:res.data.longitude
      });
      that.way()
    });
  },

  onShow() {},
  /**
   * 获取用户经纬度
   */
  getCenterLocation: function () {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          nowlongitude: res.longitude,
          nowlatitude: res.latitude,
        });
        console.log(
          "当前位置：",
          this.data.nowlongitude,
          this.data.nowlatitude
        );
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

  //规划路线
  way() {
    const that = this;
    console.log(
      that.data.nowlatitude,
      that.data.nowlongitude,
      that.data.latitude,
      that.data.longitude
    );
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${that.data.nowlatitude},${that.data.nowlongitude}&to=${that.data.latitude},${that.data.longitude}&output=json&callback=cb&key=7PJBZ-W47WV-VYTPC-5IVNH-H2OQ5-XABKO`,
      success(res) {
        console.log("---------", res);
        var result = res.data.result
        var route = result.routes[0]
        
        var coors = route.polyline, pl = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          that.setData({
            // 将路线的起点设置为地图中心点
            nowlatitude:pl[0].latitude,
            nowlongitude:pl[0].longitude,
            // 绘制路线
            polyline: [{
              points: pl,
              color: '#58c16c',
              width: 6,
              borderColor: '#2f693c',
              borderWidth: 1
            }]
          })
      },
    });
  },
});
