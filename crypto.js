var CryptoJS = require("crypto-js");

const encrypt = (inputData, key) => {
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

const macKey = "186d1aeb795dfe1012f992e0965dd618";
var encodeMacSHA256 = (data, key) => {
  return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Base64);
};

export default {
  encrypt,
  decrypt,
  encodeMacSHA256,
};
