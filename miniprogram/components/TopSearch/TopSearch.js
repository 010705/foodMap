// components/TopSearch/TopSearch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search:function(e) {
      console.log( this.data.inputValue);
      const value=this.data.inputValue
      // wx.request({
      //   url: `https://apis.map.qq.com/ws/place/v1/search?page_index=1&boundary=nearby(28.681114,115.918377,1000,1)&keyword=${this.data.inputValue}&key=7PJBZ-W47WV-VYTPC-5IVNH-H2OQ5-XABKO`,
      //   success(res) {
          wx.redirectTo({
            url: `/pages/search/search?value=${value}`,
          })
      //     if(res.data.count==0){
      //      console.log("0");
      //     }
      //     else{
      //        console.log(res);
      //     }
      //   },
      // })
    },
    loadData: function (keywords) {
      store
        .skip(this.data.numbers)
        .where({
          title: db.RegExp({
            regexp: this.data.keywords,
            options: "i",
          }),
        })
        .get()
        .then((res) => {
          /**
           * 如果没有数据，就提示没有商户了，并返回。
           */
          if (res.data.length == 0) {
            this.setData({
              searched: true,
            });
          }
          this.setData({
            stores: this.data.stores.concat(res.data),
            numbers: this.data.numbers + res.data.length,
          });
        });
    },
  },
});
