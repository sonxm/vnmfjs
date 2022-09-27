var Taro = require("@tarojs/taro");
var CryptoJS = require("crypto-js");
class VnmfInfo {
  constructor() {
    window.__vnmfInfo = Taro.getSystemInfoSync();
  }
  createPayment(order) {
    const key = "186d1aeb795dfe1012f992e0965dd618";
    alert({ action: "PAYMENT", data: this.encrypt(JSON.stringify(order), key) });
  }
  encrypt(inputData, key) {
    var iv_base64 = CryptoJS.enc.Base64.stringify(
      CryptoJS.lib.WordArray.random(16)
    );
    var iv = CryptoJS.enc.Base64.parse(iv_base64);
    var data = inputData;
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(data),
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    data = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    return data;
  }
}

export default VnmfInfo;