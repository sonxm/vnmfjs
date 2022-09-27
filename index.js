var Taro = require("@tarojs/taro");

class VnmfInfo {
  constructor() {
    window.__vnmfInfo = Taro.getSystemInfoSync()
  }
}

const vnm = new VnmfInfo();