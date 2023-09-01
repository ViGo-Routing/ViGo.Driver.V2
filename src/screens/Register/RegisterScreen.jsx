import React from "react";
import {
  SafeAreaView,
  // Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  NativeAppEventEmitter,
  NativeEventEmitter,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import EnterOtpCodeModal from "../../components/Modal/EnterOtpCodeModal";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import auth from "@react-native-firebase/auth";

import { login, register } from "../../utils/apiManager";
import { UserContext } from "../../context/UserContext";
import { updateUserFcmToken } from "../../services/userService";
import messaging from "@react-native-firebase/messaging";
import { Box, FormControl, Input, WarningOutlineIcon, Text } from "native-base";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import { isPhoneNumber } from "../../utils/stringUtils";
import { eventNames, handleError } from "../../utils/alertUtils";

const RegisterScreen = () => {
  const navigation = useNavigation();
  // const [enterOtpModalVisible, setEnterOtpModalVisible] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // const [confirm, setConfirm] = useState(null);
  // const [code, setCode] = useState("");

  const [firebaseToken, setFirebaseToken] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);

  // const [name, setName] = useState("");
  const { setUser } = useContext(UserContext);
  const [isInputPhoneInvalid, setIsInputPhoneInvalid] = useState(false);
  const handlePhoneChange = (text) => {
    if (!isPhoneNumber(text)) {
      setIsInputPhoneInvalid(true);
    } else {
      setIsInputPhoneInvalid(false);
    }
    setPhoneNumber(text);
    // setIsInputPhoneInvalid(false); // Reset the input validation when the user starts typing again
  };

  const [isInputPasswordInvalid, setIsInputPasswordInvalid] = useState(false);
  const [passwordInvalidMessage, setPasswordInvalidMessage] = useState("");

  const handlePasswordChange = (text) => {
    if (text.length == 0) {
      setIsInputPasswordInvalid(true);
      setPasswordInvalidMessage("Mật khẩu không được bỏ trống!");
    } else if (text.length > 20) {
      setIsInputPasswordInvalid(true);
      setPasswordInvalidMessage("Mật khẩu không được vượt quá 20 kí tự!");
    } else if (text != confirmPassword) {
      setIsInputPasswordConfirmInvalid(true);
    } else {
      setIsInputPasswordConfirmInvalid(false);
    }
    setPassword(text);
    // setIsInputPasswordInvalid(false); // Reset the input validation when the user starts typing again
  };

  const [isInputPasswordConfirmInvalid, setIsInputPasswordConfirmInvalid] =
    useState(false);
  const handlePasswordConfirmChange = (text) => {
    if (text != password) {
      setIsInputPasswordConfirmInvalid(true);
    } else {
      setIsInputPasswordConfirmInvalid(false);
      // setconfirm
    }
    setConfirmPassword(text);
  };
  // Handle Login by Firebase
  const onAuthStateChanged = (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setCode("");
        // setPhoneNumber(user.phoneNumber);
        setFirebaseToken(token);
        setFirebaseUid(user.uid);
        // console.log(user.firebaseUid);
        // console.log(user);
        // console.log(token);
        setEnterOtpModalVisible(false);
      });
    }
  };

  useEffect(() => {
    // console.log(firebaseToken);
    auth().settings.appVerificationDisabledForTesting = true;
    // auth().settings.forceRecaptchaFlowForTesting = true;
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;
  }, []);

  useEffect(() => {
    if (firebaseToken && firebaseUid) {
      onRegister();
    }
  }, [firebaseToken, firebaseUid]);

  // Handle Send OTP
  const sendOtp = async () => {
    if (phoneNumber) {
      setIsLoading(true);
      try {
        // const phoneProvider = new auth.PhoneAuthProvider();
        // phoneProvider.
        const confirmation = await auth().signInWithPhoneNumber(
          `+84${phoneNumber}`
        );
        setConfirm(confirmation);

        setEnterOtpModalVisible(true);
      } catch (err) {
        console.error(err);
        Alert.alert("Có lỗi xảy ra khi gửi mã OTP", "Chi tiết: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const otpConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await confirm.confirm(code);
      console.log(result);
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code
      );

      auth()
        .signInWithCredential(credential)
        .then(() => {
          // console.log(user);
          auth().onAuthStateChanged(onAuthStateChanged);
        });

      // let userData = await auth().currentUser.linkWithCredential(credential);
      // console.log(userData);
    } catch (err) {
      if (err.code == "auth/invalid-verification-code") {
        Alert.alert("Mã OTP không chính xác", "Vui lòng kiểm tra lại mã OTP!");
      } else {
        Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const renderAfterOtpConfirm = () => {
  //   if (firebaseToken) {
  //     return (
  //       <View>
  //         <Text>Họ và tên</Text>
  //         <View
  //           style={{
  //             ...vigoStyles.row,
  //             ...{
  //               justifyContent: "center",
  //               marginBottom: 10,
  //             },
  //           }}
  //         >
  //           <TextInput
  //             style={{ ...styles.input, ...{ flex: 1 } }}
  //             onChangeText={setName}
  //             placeholder="Nguyễn Văn A"
  //             autoComplete="name"
  //             keyboardType="default"
  //             textContentType="name"
  //           />
  //         </View>
  //       </View>
  //     );
  //   } else {
  //     return <></>;
  //   }
  // };

  const onRegister = async () => {
    // console.log(isPhoneNumber(phoneNumber));
    if (!isPhoneNumber(phoneNumber)) {
      setIsInputPhoneInvalid(true);
      // console.log(isInputPhoneInvalid);
    } else if (password.length == 0) {
      setIsInputPasswordInvalid(true);
      setPasswordInvalidMessage("Mật khẩu không được bỏ trống!");
    } else if (password.length > 20) {
      setIsInputPasswordInvalid(true);
      setPasswordInvalidMessage("Mật khẩu không được vượt quá 20 kí tự!");
    } else if (password != confirmPassword) {
      setIsInputPasswordConfirmInvalid(true);
    } else {
      // console.log(isInputPhoneInvalid);
      setIsLoading(true);
      try {
        const newUserData = await register(
          /*name, */ `+84${phoneNumber.substring(1, 10)}`,
          password
        );
        if (newUserData) {
          // Alert.alert(
          //   "Đăng ký tài khoản thành công!",
          //   "Hãy tiến hành cập nhật hồ sơ để có thể sử dụng ViGo bạn nhé"
          // );
          const eventEmitter = new NativeEventEmitter();
          eventEmitter.emit(eventNames.SHOW_TOAST, {
            title: "Đăng ký tài khoản thành công!",
            description:
              "Hãy tiến hành cập nhật hồ sơ để có thể sử dụng ViGo bạn nhé",
            status: "success",
            // placement: "top-right",
            isDialog: true,
          });

          login(`+84${phoneNumber.substring(1, 10)}`, password).then(
            async (response) => {
              setUser(response.user);
              try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                  {
                    title: "Cho phép ViGo gửi thông báo đến bạn",
                    message: `Nhận thông báo về trạng thái giao dịch, nhắc nhở chuyến đi
                    trong ngày và hơn thế nữa`,
                    buttonNeutral: "Hỏi lại sau",
                    buttonNegative: "Từ chối",
                    buttonPositive: "Đồng ý",
                  }
                );

                console.log(granted);

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  await messaging().registerDeviceForRemoteMessages();
                  const fcmToken = await messaging().getToken();
                  await updateUserFcmToken(response.user.id, fcmToken);
                }
              } catch (err) {
                handleError("Có lỗi xảy ra khi đăng ký", err);
              }

              if (response.user.status == "PENDING") {
                navigation.navigate("NewDriverUpdateProfile");
              } else {
                navigation.navigate("Home");
              }
            }
          );
        }
        // console.log(newUserData);
      } catch (err) {
        // Alert.alert("Có lỗi xảy ra khi đăng ký", "Chi tiết: " + err.message);
        handleError("Có lỗi xảy ra khi đăng ký", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={{ ...vigoStyles.container, ...styles.container }}>
      <ViGoSpinner isLoading={isLoading} />
      <Image
        source={require("../../../assets/images/ViGo_logo.png")}
        style={styles.image}
      />
      <Box alignItems="center">
        <Box
          maxW="80"
          rounded="xl"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="2"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 8,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Box p="4">
            <Text fontSize="3xl" bold>
              Đăng ký
            </Text>
            <Text fontSize="lg">Trở thành tài xế ViGo ngay hôm nay</Text>
            {/* <Text>Số điện thoại</Text> */}
            {/* <View
          style={{
            ...vigoStyles.row,
            ...{
              justifyContent: "center",
              marginBottom: 10,
            },
          }}
        >
          <Text style={{ marginRight: 10 }}>+84</Text>
          <TextInput
            style={{ ...styles.input, ...{ flex: 1 } }}
            onChangeText={setPhoneNumber}
            editable={firebaseToken ? false : true}
            placeholder="123 456 789"
            autoComplete="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            // onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View> */}
            <Box alignItems="center" pt="4">
              <FormControl
                style={styles.input}
                isInvalid={isInputPhoneInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  InputLeftElement={
                    <Text fontSize="xs" bold>
                      +84
                    </Text>
                  }
                  placeholder="Nhập số điện thoại"
                />
                {isInputPhoneInvalid && (
                  <FormControl.ErrorMessage
                    // isInvalid={isInputPhoneInvalid}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    pb="2"
                  >
                    Số điện thoại không hợp lệ
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            </Box>
            {/* {renderAfterOtpConfirm()} */}
            {/* <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={true}
        /> */}
            {/* <TextInput
          style={styles.input}
          placeholder="OTP Code"
          // onChangeText={setCode}
          keyboardType="phone-pad"
        /> */}
            <Box alignItems="center" pt="1">
              <FormControl
                style={styles.input}
                isInvalid={isInputPasswordInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  value={password}
                  onChangeText={handlePasswordChange}
                  // keyboardType="numeric"
                  type={showPassword ? "text" : "password"}
                  InputLeftElement={
                    <TouchableOpacity
                      p="3"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <EyeIcon size={18} color="black" />
                      ) : (
                        <EyeSlashIcon name="eye-off" size={18} color="black" />
                      )}
                    </TouchableOpacity>
                  }
                  placeholder="Mật khẩu"
                />
                <FormControl.ErrorMessage
                  // isInvalid={isInputPasswordInvalid}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  pb="2"
                >
                  {passwordInvalidMessage}
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            <Box alignItems="center" pt="1">
              <FormControl
                style={styles.input}
                isInvalid={isInputPasswordConfirmInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  value={confirmPassword}
                  onChangeText={handlePasswordConfirmChange}
                  // keyboardType=""
                  type={showConfirmPassword ? "text" : "password"}
                  InputLeftElement={
                    <TouchableOpacity
                      p="3"
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {!showConfirmPassword ? (
                        <EyeIcon size={18} color="black" />
                      ) : (
                        <EyeSlashIcon name="eye-off" size={18} color="black" />
                      )}
                    </TouchableOpacity>
                  }
                  placeholder="Xác nhận mật khẩu"
                />
                <FormControl.ErrorMessage
                  // isInvalid={isInputPasswordConfirmInvalid}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  pb="2"
                >
                  Mật khẩu không trùng khớp!
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            <Box pt="1" mt="1">
              <TouchableOpacity
                style={vigoStyles.buttonPrimary}
                onPress={() => onRegister()}
                disabled={
                  isInputPhoneInvalid ||
                  isInputPasswordInvalid ||
                  isInputPasswordConfirmInvalid
                }
              >
                <Text style={vigoStyles.buttonPrimaryText}>Đăng ký</Text>
              </TouchableOpacity>
            </Box>

            <View
              style={{ ...vigoStyles.row, ...{ justifyContent: "flex-start" } }}
            >
              <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={vigoStyles.link}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </Box>
        </Box>
      </Box>

      {/* </View> */}

      {/* Modal */}
      {/* <EnterOtpCodeModal
        modalVisible={enterOtpModalVisible}
        setModalVisible={setEnterOtpModalVisible}
        onModalRequestClose={() => {}}
        onModalConfirm={() => otpConfirm()}
        phoneNumber={`+84${phoneNumber}`}
        setCode={setCode}
      /> */}
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.linear,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 80,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    marginTop: 40,
    marginBottom: 30,
  },
  input: {
    // height: 50,
    borderRadius: 15,
    paddingHorizontal: 20,
    // marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  loginText: {
    fontSize: 16,
  },
});
