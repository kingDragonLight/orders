// pages/goods/goods.js
var pageData=require("../../data/data.js")
// console.log(pageData)
Page({
  data: {
    scrollNum:0,
    hide: false,
    nowId: 0,
    menu: [
      { name: '人气热卖',id:"z01",icon: "../../images/icon01.png" },
      { name: '热菜', id: "z02", icon: "../../images/icon02.png" },
      { name: '凉菜', id: "z03",icon: "../../images/icon03.png" },
      { name: '主食', id: "z04",icon: "../../images/icon04.png" },
      { name: '汤类', id: "z05",icon: "../../images/icon05.png" }
    ],
   toView: '0',
    scrollTop: 100,
    foodCounts: 0,
    totalPrice: 0,// 总价格
    totalCount: 0, // 总商品数
    carArray: [],
    minPrice: 20,//起送價格,最低限制
    payDesc: '',
    deliveryPrice: 4,//配送費
    fold: true,
    selectFoods: [{ price: 20, count: 2 }],
    cartShow: 'none',
    typeHeight: 97,
    goodHeight: 26
  },
  selectFoods:function(e){
    console.log(e.currentTarget.dataset.postid)
    console.log(e.currentTarget.dataset.ids)
    var postid = e.currentTarget.dataset.postid;
    var ids = e.currentTarget.dataset.ids
    var indexs = [postid, ids]
      wx.navigateTo({
        url: '../details/details?postid=' + postid +"&ids="+ids,
      })
  },
  goodsScrollAct: function (e) {
    // console.log(this.data)
    // console.log(e)
    var typeCount = this.data.menu.length;//获取左侧导航长度
    // console.log(typeCount)
    var goodsCount = 0
    this.data.goods.forEach((item) => {
      goodsCount += item.foods.length;
      // console.log(goodsCount)
    });

    var heightList = [0];
    var curHeight = 0;
    this.data.goods.forEach((item) => {
      curHeight += (this.data.typeHeight + item.foods.length * this.data.goodHeight);
      // console.log(curHeight)
      heightList.push(curHeight);//获取高度
      // console.log(heightList)
    });
    var leftId = this.data.menu
    // console.log(this.data.menu)
    // console.log(leftId)
    for (var i = 0; i < heightList.length; i++) {
      if (e.detail.scrollTop >= heightList[i] && e.detail.scrollTop < heightList[i + 1]) {
        if (i == 0) {
          this.setData({
            hide: false
          });
        } else {
          this.setData({
            hide: true
          });
        }
        // console.log(leftId[i].id)
        this.setData({
          nowId: leftId[i].id,
          scrollNum: i
        });
      }
    }
  },

  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    // console.log(index)
    this.setData({
      toView: 'order' + index.toString()
    })
    // console.log(this.data.toView);

    if (index == 0) {
      this.setData({
        scrollNum: index,
        hide: false
      });
    } else {
      this.setData({
        scrollNum: index,
        hide: true
      });
    }
  },




  //移除商品
  decreaseCart: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    // console.log(e)
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods.forEach((good) => {
          // good为当前goods元素 goods数组  
      good.foods.forEach((food) => {
        // food为foods元素
        var num = this.data.goods[parentIndex].foods[index].Count;
        var mark = 'a' + index + 'b' + parentIndex
        // console.log(food)
        if (food.Count > 0) {
          this.data.goods[parentIndex].foods[index].Count--
          var price = this.data.goods[parentIndex].foods[index].price;//获取价格 
          
          var obj = { price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
          var carArray1 = this.data.carArray.filter(item => item.mark != mark);
          carArray1.push(obj);
          // console.log(carArray1);
          this.setData({
            carArray: carArray1,
            goods: this.data.goods
          })
          this.calTotalPrice()
          this.setData({
            payDesc: this.payDesc()
          })
        }
        if (num > 0) {
          var carArray1 = this.data.carArray.filter(item => item.num > 0)
          // console.log(carArray1)
          this.setData({
            carArray: carArray1,
          })
        }else{
          console.log("num<=0")
        }
      })
    })
  },
  decreaseShopCart: function (e) {
    console.log(e)
    this.decreaseCart(e);
  },
  //添加到购物车
  addCart(e) {
    // console.log(e)
    var index = e.currentTarget.dataset.itemIndex;
    // console.log(index)
    var parentIndex = e.currentTarget.dataset.parentindex;
    // console.log(parentIndex)
    // console.log(this)
    this.data.goods[parentIndex].foods[index].Count++;
    var mark = 'a' + index + 'b' + parentIndex
    // console.log(mark)
    var price = this.data.goods[parentIndex].foods[index].price;//价格
    var num = this.data.goods[parentIndex].foods[index].Count;//购买数量
    var name = this.data.goods[parentIndex].foods[index].name;
    var obj = { price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    // filter为过滤器  =>匿名函数 function(item){item.mark != mark}
    carArray1.push(obj)
    // console.log(carArray1);
    this.setData({
      carArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice();//调用计算总价
    this.setData({
      payDesc: this.payDesc()
    })
  },

  addShopCart: function (e) {
    this.addCart(e);
  },
  //计算总价
  calTotalPrice: function () {
    var carArray = this.data.carArray;//获取添加信息的数组
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].num;//获取总价
      totalCount += carArray[i].num;//获取购买数量
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,//转换格式给data{}
      //payDesc: this.payDesc()
    });
  },
  //差几元起送
  payDesc() {
    if (this.data.totalPrice === 0) {
      return `￥${this.data.minPrice}元起送`;
    } else if (this.data.totalPrice < this.data.minPrice) {
      let diff = this.data.minPrice - this.data.totalPrice;
      return '还差' + diff + '元起送';
    } else {
      return '去结算';
    }
  },
  //結算
  pay() {
    if (this.data.totalPrice < this.data.minPrice) {
      return;
    }
    // window.alert('支付' + this.totalPrice + '元');
    //确认支付逻辑
    var resultType = "success";
    wx.redirectTo({
      url: '../goods/pay/pay?resultType=' + resultType
    })
  },
  //彈起購物車
  toggleList: function () {
    console.log(!this.data.totalCount)//!0 为true
    if (!this.data.totalCount) {
      return;
    }
    this.setData({
      fold: !this.data.fold,//fold取相反布尔值
    })
    var fold = this.data.fold
    console.log(this.data.fold);
    this.cartShow(fold)//针对函数，而不是data值
  },
  cartShow: function (fold) {
    console.log(fold);
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
    console.log(this.data.cartShow);
  },
  listShow() {
    if (!this.data.totalCount) {
      this.data.fold = true;
      return false;
    }
    let show = !this.fold;
    // if (show) {
    //     this.$nextTick(() => {
    //         if (!this.scroll) {
    //             this.scroll = new BScroll(this.$refs.listContent, {
    //                 click: true
    //             });
    //         } else {
    //             this.scroll.refresh();
    //         }
    //     });
    // }
    return show;
  },
  onLoad: function (options) {
    
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      goods: pageData.postList,
      payDesc: this.payDesc()
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
