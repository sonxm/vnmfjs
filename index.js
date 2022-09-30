var CryptoJS = require("crypto-js");

class VnmfInfo {
  constructor() {
    const key = "186d1aeb795dfe1012f992e0965dd618";
    this.createRequestCallUser();
    window.getUser = (info) => {
      var tmp = JSON.parse(this.decrypt(info, key));
      if (tmp.status == "SUCCESS") {
        this.userfInfo = tmp;
      } else if (tmp.status != "PERMISSION_DENIED") {
        this.createRequestCallUser();
      }
    };
  }
  getUserInfo() {
    return this.userfInfo;
  }
  createRequestCallUser() {
    const key = "186d1aeb795dfe1012f992e0965dd618";
    alert(
      JSON.stringify(
        this.encrypt(
          JSON.stringify({
            action: "get_user_info",
            field: "fullname|email|phone",
            function: "getUser",
          }),
          key
        )
      )
    );
  }
  createPayment(order) {
    const key = "186d1aeb795dfe1012f992e0965dd618";
    alert(
      JSON.stringify(
        this.encryptJson({ action: "payment", data: order }, key)
      )
    );
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
  encryptJson(inputData, key) {
    var iv_base64 = CryptoJS.enc.Base64.stringify(
      CryptoJS.lib.WordArray.random(16)
    );
    var iv = CryptoJS.enc.Base64.parse(iv_base64);
    var data = inputData;
    var encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
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
  decrypt(ciphertext, key) {
    var iv = CryptoJS.enc.Base64.parse(ciphertext);
    iv.words = iv.words.slice(0, 4);
    iv.sigBytes = 16;
    var encrypted = CryptoJS.enc.Base64.parse(ciphertext);
    encrypted.sigBytes = encrypted.sigBytes - 16;
    encrypted.words = encrypted.words.slice(4, encrypted.words.length);
    var decrypted = CryptoJS.AES.decrypt(
      encrypted.toString(CryptoJS.enc.Base64),
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

export default VnmfInfo;
