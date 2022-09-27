import Taro from "@tarojs/taro";

const info = () => {
  window.__vnmfInfo = Taro.getSystemInfoSync();
};
export default info;
  