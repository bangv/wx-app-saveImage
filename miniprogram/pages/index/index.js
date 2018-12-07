//index.js
const app = getApp()

Page({
  data: {
    hidden: true
  },

  onLoad: function() {
    let promise2 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: '../../images/download.png',
        success: function(res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise2
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareImg')

      //主要就是计算好各个图文的位置
      ctx.drawImage('../../' + res[0].path, 0, 0, 545, 771)

      // ctx.setTextAlign('center')
      // ctx.setFillStyle('#ffffff')
      // ctx.setFontSize(22)
      // ctx.fillText('分享文字描述1', 545 / 2, 130)
      // ctx.fillText('分享文字描述2', 545 / 2, 160)

      ctx.stroke()
      ctx.draw();

    })
  },


  /**
   * 生成分享图
   */
  share: function() {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 771,
      height: 771,
      destWidth: 771,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function(res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
        that.save();
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
   */
  save: function() {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: 'APP二维码保存成功，微信扫一扫下载APP赚钱吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })

  },
  //分享
  onShareAppMessage: function(Options) {
    var that = this;
    return {
      title: '动动手指，轻轻松松赚钱~',
      path: '/pages/index/index',
      success: function(shareTickets) {
        console.info(shareTickets + '成功');
        wx.showToast({
          title: "转发成功",
          icon: 'none',
          duration: 2000
        });

      }
    }
  },
})