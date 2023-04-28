// pages/search/search.js
const db = wx.cloud.database()
const store = db.collection('store');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exist:false,
    stores:[],
    numbers: 0,
  },

  search:function(e) {
    const value=getCurrentPages()[0].options.value
    console.log("------------",value);
    store.skip(this.data.numbers).where({
      title: db.RegExp({
        regexp: value,
        options: 'i',
      })
    }).get().then(res => {
      console.log(res);
      /**
       * 如果没有数据，就提示没有商户了，并返回。
       */
      if (res.data.length !== 0) {
        this.setData({
          exist:true
        })
      }
      this.setData({
        stores: this.data.stores.concat(res.data),
        numbers: this.data.numbers + res.data.length
      });
    })
    // wx.request({
    //   url: `https://apis.map.qq.com/ws/place/v1/search?page_index=1&page_size=20&boundary=nearby(28.681114,115.918377,1000,1)&keyword=${value}&key=7PJBZ-W47WV-VYTPC-5IVNH-H2OQ5-XABKO`,
    //   success(res) {
    //     if(res.data.count!==0){
    //      that.setData({
    //        exist:true,
    //        infos:res.data.data
    //      })
    //     }
    //     console.log(that.data.infos);
    //   },
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.search()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

})