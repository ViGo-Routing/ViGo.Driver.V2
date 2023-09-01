import { NativeEventEmitter } from "react-native";

export const eventNames = {
  SHOW_TOAST: "showToast",
};

export const handleError = (alertTitle: string, error: any) => {
  const eventEmitter = new NativeEventEmitter();

  eventEmitter.emit(eventNames.SHOW_TOAST, {
    title: alertTitle,
    description: getErrorMessage(error),
    status: "error",
    isDialog: true,
  });
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
