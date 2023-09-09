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

export const login = async (phone, firebaseToken) => {
  // try {
  const requestData = {
    // password: password,
    firebaseToken: firebaseToken,
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
  updateToken(newToken);
  return response.data;
};

export const register = async (/*name, */ phone, firebaseUid) => {
  // try {
  const requestData = {
    // name: name,
    phone: phone,
    // password: password,
    firebaseUid: firebaseUid,
    role: "DRIVER",
  };

  const response = await axios.post(
    `${baseURL}/api/Authenticate/Register`,
    requestData
  );

  return response.data;
  // } catch (err) {
  //   // console.error(err.response.data);
  //   Alert.alert(
  //     "Có lỗi xảy ra khi đăng ký",
  //     "Chi tiết: " + (err.response ? err.response.data : err.message)
  //   );
  // }
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

// apiManager.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status == 401) {
//       eventEmitter.emit(eventNames.SHOW_TOAST, {
//         title: "Vui lòng đăng nhập lại",
//         description: "",
//         status: "error",
//         placement: "top",
//         duration: 5000,
//         isSlide: true,
//       });
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "Login" }],
//       });
//     }
//   }
// )

export default apiManager;
