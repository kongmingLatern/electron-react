export const urls = {
  scan: {
    getQrcode:
      'http://passport.bilibili.com/x/passport-login/web/qrcode/generate',

    scanQrcode:
      'https://passport.bilibili.com/x/passport-login/web/qrcode/poll',
  },
  user: {
    // NOTE: https://socialsisteryi.github.io/bilibili-API-collect/docs/user/info.html#%E7%94%A8%E6%88%B7%E7%A9%BA%E9%97%B4%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF
    getUserCard: 'https://api.bilibili.com/x/web-interface/card',
  },

  // // 获取直播间信息
  // // NOTE: GET room_id 30639870
  // getLiveInfo: 'https://api.live.bilibili.com/room/v1/Room/get_info',

  // // 获取主播信息
  // // NOTE: GET uid 目标用户mid 3537123099543958
  // getLive2DInfo: 'https://api.live.bilibili.com/live_user/v1/Master/info',

  // // 二维码登录
  // // NOTE: GET
  // generateQCode:
  //   'https://passport.bilibili.com/x/passport-login/web/qrcode/generate',
};
