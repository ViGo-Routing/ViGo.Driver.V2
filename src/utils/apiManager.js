import axios from "axios";
import { Alert, NativeEventEmitter } from "react-native";
import { getString, setString } from "./storageUtils";
import { eventNames, handleError } from "./alertUtils";

const baseURL = "https://vigo-api.azurewebsites.net";
const apiManager = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});

const updateToken = async (newToken) => {
  await setString("token", newToken);
};

export const login = async (phone, password) => {
  // try {
  const requestData = {
    password: password,
    phone: phone,
    role: "DRIVER",
  };
  const response = await axios.post(
    `${baseURL}/api/Authenticate/Mobile/Login`,
    requestData
  );

  if (response.data.user.role != "DRIVER") {
    throw new Error("Người dùng không hợp lệ!");
  }

  const newToken = response.data.token;
  updateToken(newToken); // Update the token value
  // console.log("Login successful!");
  return response.data;
  // } catch (error) {
  //   // console.error("Login failed:", error.response.data);
  //   // handleError(null, error);
  //   const eventEmitter = new NativeEventEmitter();
  //   eventEmitter.emit(eventNames.SHOW_TOAST, {
  //     title: "Đăng nhập không thành công",
  //     description: "Vui lòng kiểm tra lại thông tin đăng nhập",
  //     status: "error",
  //     placement: "top-right",
  //   });
  //   // Alert.alert(
  //   //   "Đăng nhập không thành công!",
  //   //   "Chi tiết: " + (error.response ? error.response.data : error.message)
  //   // );
  // }
};

export const register = async (/*name, */ phone, password) => {
  try {
    const requestData = {
      // name: name,
      phone: phone,
      password: password,
      role: "DRIVER",
    };

    const response = await axios.post(
      `${baseURL}/api/Authenticate/Register`,
      requestData
    );

    return response.data;
  } catch (err) {
    // console.error(err.response.data);
    Alert.alert(
      "Có lỗi xảy ra khi đăng ký",
      "Chi tiết: " + (err.response ? err.response.data : err.message)
    );
  }
};



apiManager.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${await getString("token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiManager;
