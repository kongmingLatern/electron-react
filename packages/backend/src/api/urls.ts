export const urls = {
  scan: {
    getQrcode:
      'http://passport.bilibili.com/x/passport-login/web/qrcode/generate',

    scanQrcode:
      'https://passport.bilibili.com/x/passport-login/web/qrcode/poll',
  },
  user: {
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
