// pages/info/info.js
const app = getApp();
const db = wx.cloud.database();
const store = db.collection("store");
const config = require("../../config.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    imgList: [],
    windowHeight: app.globalData.windowHeight,
    keywords:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    store
      .doc(options.id)
      .get()
      .then((res) => {
        console.log(res);
        wx.setNavigationBarTitle({
          title: res.data.title,
        });
        this.setData({
          info: res.data,
          imgList: res.data.images,
          keywords:res.data.keywords.split("，")
        });
        console.log(res.data);
        console.log(this.data.keywords);
        this.getImg(res.data.images);
        // 两次切割以适配中英文逗号
        // let keywords_array = res.data.keywords.split(',').map(item => { return item.split('，') })
        // 将数组压平
        // let keywords = [].concat.apply([], keywords_array);
        // res.data.keywords = keywords
        // this.setData({
        //   store: res.data,
        //   is_administrator: app.globalData.is_administrator
        // },res => {
        //   wx.hideLoading();
        // })
      });
  },

  //获取照片并显示
  getImg(e) {
    let imgArr = [];
    console.log(e);
    if (e) {
      for (let i = 0; i < e.length; i++) {
        wx.getImageInfo({
          src: i,
          success(res) {
            imgArr = [...imgArr, res.path];
            console.log(res.path);
            that.setData({
              imgList: imgArr,
            });
            console.log("----------", that.data.imgList);
          },
        });
      }
    }
    else{
      this.setData({
        imgList:'https://gd-hbimg.huaban.com/5d91b400204034583e9c24dd4b10f225f3e59522ed9-zXPxPI_fw658webp'
      })
    }
  },
  //导航按钮
  gohere(e){
    console.log("-----------",e.target.dataset.info);
    const id=e.target.dataset.info._id
    wx.navigateTo({
      url: '/pages/map/map?id='+id,
    })
  }
});
