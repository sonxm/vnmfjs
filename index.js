var CryptoJS = require("crypto-js");

window.vnmf = {};
const requestNative = (data) => {
  const key = "186d1aeb795dfe1012f992e0965dd618";
  var tmp = encryptJson(data, key);
  alert(tmp);
};
window.vnmf.requestUserInfo = (
  input = { success: (callback = (res) => {}) }
) => {
  requestNative({
    action: "get_user_info",
    field: "fullname|email|phone",
    function: "vnmf.userInfoCallBack",
  });
  window.vnmf["assignUserInfo"] = input.success;
};

window.vnmf.userInfoCallBack = function (data) {
  const key = "186d1aeb795dfe1012f992e0965dd618";
  var tmp = JSON.parse(decrypt(data, key));
  if (tmp.status == "SUCCESS") {
    window.vnmf["assignUserInfo"](tmp);
  } else if (tmp.status != "PERMISSION_DENIED") {
    /// TODO: fail
  }
};

window.vnmf.requestPayment = (
  input = { data: data, success: (callback = (res) => {}) }
) => {
  requestNative({ action: "payment", data: input.data });
  window.vnmf["assignPayment"] = input.success;
};

window.vnmf.paymentCallBack = function (data) {
  window.vnmf["assignPayment"](data);
};
const encryptJson = (inputData, key) => {
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
};
const decrypt = (ciphertext, key) => {
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
};
