import { NativeEventEmitter } from "react-native";

export const eventNames = {
  SHOW_TOAST: "showToast",
};

export const handleError = (
  alertTitle: string,
  error: any,
  navigation: any
) => {
  const eventEmitter = new NativeEventEmitter();

  if (error.response && error.response.status == 401) {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      title: "Vui lòng đăng nhập lại",
      description: "",
      status: "error",
      placement: "top",
      duration: 5000,
      isSlide: true,
    });

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } else {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      title: alertTitle,
      description: getErrorMessage(error),
      status: "error",
      isDialog: true,
    });
  }
};

export const getErrorMessage = (error: any) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    // console.log(data);
    if (data.errors) {
      return "Dữ liệu không hợp lệ! Vui lòng kiểm tra lại các thông tin";
    }
    return data;
  } else {
    return error.message ? error.message : error;
  }
};

export const handleWarning = (title: string, message: string) => {
  const eventEmitter = new NativeEventEmitter();

  eventEmitter.emit(eventNames.SHOW_TOAST, {
    title: title,
    description: message,
    status: "warning",
    isDialog: true,
  });
};
