// pages/add/add.js
const db = wx.cloud.database();
const store = db.collection("store");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    latitude: 0,
    longitude: 0,
    name: "",
    imgList: [],
    list: [],
    imgUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
  // 选择地址
  chooseLocation: function (event) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.userLocation"]) {
          wx.authorize({
            scope: "scope.userLocation",
            success: (res) => {
              wx.chooseLocation({
                success: (res) => {
                  this.setData({
                    address: res.address,
                    latitude: res.latitude,
                    longitude: res.longitude,
                    name: res.name,
                  });
                },
              });
            },
          });
        } else {
          wx.chooseLocation({
            success: (res) => {
              this.setData({
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude,
                name: res.name,
              });
            },
          });
        }
      },
    });
  },
  //创建
  createItem: function (event) {
    wx.showLoading({
      title: "上传数据中...",
    });
    let value = event.detail.value;
    store
      .add({
        data: {
          ...value,
          thumbs_up: 1,
          iconPath: "../../images/food.png",
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          label: {
            content: value.title,
          },
          images: this.data.imgUrl,
        },
      })
      .then((res) => {
        this.onLoad()
        wx.hideLoading();
        wx.showToast({
          title: "创建成功！",
          icon: "success",
          success: (res) => {
            wx.navigateBack({});
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  //上传照片
  uploadImage() {
    const that = this;
    // let arr = that.data.imgList;
    wx.chooseMedia({
      count: 6,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      camera: "back",
      success(res) {
        // console.log(res.tempFiles[0]);
        // arr = [...arr, res.tempFiles[0]];
        // that.setData({
        //   imgList:res.tempFiles[0],
        // });
        if(that.data.imgUrl.length<9){
          that.playback(res.tempFiles[0]);
        }
        // else{
        //   wx.showToast({
        //     title: '添加已达上限',
        //     icon:'none'
        //   })
        // }
      },
    });
  },
  //获取照片并显示
  playback(e) {
    let that = this;
    let imgArr = that.data.imgUrl;
    wx.getImageInfo({
      src: e.tempFilePath,
      success(res) {
        imgArr=[...imgArr,res.path]
        console.log(res.path);
        that.setData({
          imgUrl: imgArr,
        });
        console.log(that.data.imgUrl);
      },
    });
  },
  //上传照片至云服务器
  uploadPhoto(filePath) {
    return wx.cloud.uploadFile({
      cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
      filePath
    })
  }
});
