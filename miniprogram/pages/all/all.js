// pages/all/all.js
const db = wx.cloud.database()
const store = db.collection('store');
const config = require('../../config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    exist:true,
    numbers: 0,
    stores: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.loadData()
  },
  //获取全部美食数据
  loadData: function() {
    const that=this
    store.skip(this.data.numbers).get().then(res => {
      /**
       * 如果没有数据，就提示没有商户了，并返回。
       */
      if (res.data.length == 0) {
        that.setData({
          exist:false
        })
        return;
      }
      console.log(res);
      this.setData({
        stores: this.data.stores.concat(res.data),
        numbers: this.data.numbers + res.data.length
      });
    })
  },
});
