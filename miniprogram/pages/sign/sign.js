// pages/out/wuliangye/index.js
const app = getApp();

var interval = null //倒计时函数
var intervalFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    imgCode: '',
    massageCode: '',
    password: '',
    checkCode_url: '',
    time: '',
    currentTime: 5,
    disabledFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    intervalFlag = true;
    clearInterval(interval);
    this.setData({
      time: '获取验证码',
      currentTime: 5,
      disabledFlag: false
    })
    that.changImg();
  },
  changImg() {
    let url = app.globalData.signUrl;
    let time = Date.parse(new Date());
    this.setData({
      checkCode_url: "https://www.youchent.com/file/code.jpg?time=" + time
    });

  },
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  inputimgCode: function(e) {
    this.setData({
      imgCode: e.detail.value
    });
  },
  inputmassageCode: function(e) {
    this.setData({
      massageCode: e.detail.value
    });
  },

  inputpassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },
  // 点击获取验证码
  getVerificationCode() {
    var that = this;
    if (!intervalFlag) {
      return;
    }

    if (that.checkPhone()) {
      var currentTime = that.data.currentTime;
      intervalFlag = false;
      that.getcode()
      that.getcodeData()
    } else {
      intervalFlag = true;
    }
  },
  // 获取验证码接口数据
  getcodeData() {
    var that = this;
    let url = app.globalData.signUrl;
    wx.request({
      url: url + '/sys/sms/send',
      method: 'POST',
      data: {
        "mobile": that.data.phone,
        "purpose": 2,
        "verifyCode": that.data.imgCode,
      },
      success: function(res) {
        console.log(res)
        if (res.data.code != 500) {
          that.showToast('已发送短信，请查收');
        } else {
          that.changImg();
          clearInterval(interval);
          wx.showToast({
            title: '发送验证码失败',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            time: '获取验证码',
            currentTime: 5,
            disabledFlag: false
          })
          intervalFlag = true;
        }

      },
      fail: function() {
        // 清除定时器：
        that.changImg();
        clearInterval(interval);
        that.setData({
          time: '获取验证码',
          currentTime: 5,
          disabledFlag: false
        })
        intervalFlag = true;
      }
    })
  },
  // 获取验证码
  getcode() {
    var that = this;
    if (!that.data.disabledFlag) {
      var currentTime = that.data.currentTime;
      that.setData({
        disabledFlag: true
      })
      interval = setInterval(function() {
        currentTime--;
        intervalFlag = false;
        that.setData({
          time: currentTime + 's'
        })
        if (currentTime <= 0) {
          clearInterval(interval);
          intervalFlag = true;
          that.setData({
            time: '获取验证码',
            currentTime: 5,
            disabledFlag: false
          })
        }
      }, 1000)
    }

  },
  // 验证手机号码
  checkPhone() {
    var that = this;
    var phone = that.data.phone + "";
    var imgCode = that.data.imgCode + "";
    if (phone.trim() == '') {
      that.showToast('手机号码不能为空');
      return false;
    }
    if (phone.trim().length != 11) {
      that.showToast('手机号码必须为11位！');
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(phone.trim()))) {
      that.showToast('手机格式不正确');
      return false;
    }
    if (imgCode.trim() == '') {
      that.showToast('图形码不能为空');
      return false;
    }
    return true
  },
  showToast: function(data) {
    wx.showToast({
      title: data,
      icon: 'none',
      duration: 2000
    });
  },
  signFtn: function() {
    var that = this;
    that.checkPhone();
    var massageCode = that.data.massageCode + "";
    var password = that.data.password + "";
    if (massageCode.trim() == '') {
      that.showToast('短信验证码不能为空');
      return false;
    }
    if (password.trim() == '') {
      that.showToast('密码不能为空');
      return false;
    }
  }
})