import {
  SafeAreaView,
  View,
  // Image,
  StyleSheet,
  // Alert,
  ScrollView,
  TouchableOpacity,
  // TextInput,
  // Text,
  // Pressable,
  NativeEventEmitter,
} from "react-native";
import Header from "../../components/Header/Header";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import {
  createVehicle,
  getVehicleTypes,
  getVehicles,
} from "../../services/vehicleService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import DropDownPicker from "react-native-dropdown-picker";
// import DateTimePicker from "react-native-modal-datetime-picker";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadFile } from "../../utils/firebaseUtils";
import storage from "@react-native-firebase/storage";
import { generateImageName } from "../../utils/imageUtils";
import { editProfile, getProfile } from "../../services/userService";
import {
  createUserLicense,
  getUserLicenses,
} from "../../services/userLicenseService";
import {
  Alert,
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Image,
  Input,
  KeyboardAvoidingView,
  Select,
  Text,
  VStack,
  useToast,
  Pressable,
} from "native-base";
import { issuedAtTime } from "@firebase/util";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { getMaximumDob } from "../../utils/datetimeUtils";
import { CheckIcon } from "react-native-heroicons/solid";
import { eventNames, handleError, handleWarning } from "../../utils/alertUtils";
import ConfirmAlert from "../../components/Alert/ConfirmAlert";
import { useNavigation } from "@react-navigation/native";

const NewDriverUpdateProfileScreen = () => {
  const { user, setUser } = useContext(UserContext);

  const [avatarSource, setAvatarSource] = useState(user.avatarUrl);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [genderOpen, setGenderOpen] = useState(false);
  const [availableGender, setAvailableGenders] = useState([
    { label: "Nam", value: true },
    { label: "Nữ", value: false },
  ]);

  const [gender, setGender] = useState(user.gender);

  const [showPicker, setShowpicker] = useState(false);
  const defaultDob =
    user.dateOfBirth != null ? new Date(user.dateOfBirth) : getMaximumDob();

  const [dob, setDob] = useState(defaultDob);
  // console.log(defaultDob);
  const [idFrontSide, setIdFrontSide] = useState(null);
  const [idBackSide, setIdBackSide] = useState(null);

  const [vehicleType, setVehicleType] = useState(null);
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  const [vehicleFrontSide, setVehicleFrontSide] = useState(null);
  const [vehicleBackSide, setVehicleBackSide] = useState(null);

  const [drivingFrontSide, setDrivingFrontSide] = useState(null);
  const [drivingBackSide, setDrivingBackSide] = useState(null);

  const [vehicleTypesOpen, setVehicleTypesOpen] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const [vehicleTypesDropdown, setVehicleTypesDropdown] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const toast = useToast();

  const eventEmitter = new NativeEventEmitter();

  const navigation = useNavigation();

  const loadVehicleTypes = async () => {
    const response = await getVehicleTypes();
    setVehicleTypes(response);
    setVehicleTypesDropdown(
      response.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );

    // console.log(response);
  };

  var dobRef = useRef();

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return `${day}-${month + 1}-${year}`;
  };

  const toggleDatepicker = () => {
    setShowpicker(!showPicker);
  };
  // const onChange = ({ type }, selectDate) => {
  //   if (type == "set") {
  //     const currentDate = selectDate;
  //     setDob(currentDate);
  //     if (Platform.OS === "android") {
  //       toggleDatepicker();
  //       setDob(formatDate(currentDate));
  //     }
  //   } else {
  //     toggleDatepicker();
  //   }
  // };

  const handlePickImage = async (imageType, setImageUrl) => {
    const result = await launchImageLibrary({
      mediaType: "photo",
    });

    if (result.errorMessage) {
      // Alert.alert("Có lỗi xảy ra", "Chi tiết: " + result.errorMessage);
      handleError("Có lỗi xảy ra", result.errorMessage);
    } else {
      if (result.assets) {
        setIsLoading(true);
        // console.log(result.assets[0].uri);
        try {
          const imageUri = result.assets[0].uri;
          const fileName = `driver_${imageType}_${generateImageName(10)}.png`;

          const { task, ref } = await uploadFile(imageUri, fileName);

          // task.on('state_changed', taskSnapshot => {

          // });

          task.then(async () => {
            setIsLoading(true);
            // return ref.getDownloadURL();
            // console.log("Upload success");
            const downloadUrl = await ref.getDownloadURL();
            if (downloadUrl) {
              setIsLoading(false);
              setImageUrl(downloadUrl);
              console.log(downloadUrl);
              toast.show({
                description: "Tải ảnh lên thành công",
                duration: 2000,
              });
            }
          });
        } catch (error) {
          // Alert.alert("Có lỗi xảy ra", "Chi tiết: " + error.message);
          handleError("Có lỗi xảy ra", error);
          setIsLoading(false);
        } finally {
          // setIsLoading(false);
        }
      }
    }
  };

  const handleConfirmUpdateProfile = async () => {
    try {
      setIsLoading(true);
      // Update profile
      const profileToUpdate = {
        email: email,
        name: name,
        gender: gender,
        dateOfBirth: dob,
        avatarUrl: avatarSource,
      };

      // console.log(profileToUpdate);
      const profileData = await editProfile(user.id, profileToUpdate);

      // Create UserLicense
      // ID
      const idLicense = {
        frontSideFile: idFrontSide,
        backSideFile: idBackSide,
        licenseType: "IDENTIFICATION",
      };
      // console.log(idLicense);
      const idData = await createUserLicense(idLicense);

      // Vehicle
      const vehicleLicense = {
        frontSideFile: vehicleFrontSide,
        backSideFile: vehicleBackSide,
        licenseType: "VEHICLE_REGISTRATION",
      };
      // console.log(vehicleLicense);
      const vehicleLicenseData = await createUserLicense(vehicleLicense);

      // Driving
      const drivingLicense = {
        frontSideFile: drivingFrontSide,
        backSideFile: drivingBackSide,
        licenseType: "DRIVER_LICENSE",
      };
      // console.log(drivingLicense);
      const drivingData = await createUserLicense(drivingLicense);

      // Vehicle
      const vehicleTypeObj = vehicleTypes.filter(
        (item) => item.id == vehicleType
      )[0];

      const vehicle = {
        name: `${vehicleTypeObj.name} - ${vehiclePlate}`,
        licensePlate: vehiclePlate,
        vehicleTypeId: vehicleType,
        userId: user.id,
        userLicenseId: vehicleLicenseData.id,
      };
      // console.log(vehicle);
      const vehicleData = await createVehicle(vehicle);

      setIsLoading(false);

      eventEmitter.emit(eventNames.SHOW_TOAST, {
        title: "Tạo hồ sơ thành công",
        description:
          "Hồ sơ tài xế của bạn đã được gửi tới hệ thống ViGo thành công! Hãy chờ quản trị viên xem xét hồ sơ của bạn nhé",
        status: "success",
        // placement: "top",
        isDialog: true,
      });

      setIsSubmitted(true);

      navigation.navigate("Login");
      // Alert.alert(
      //   "Tạo hồ sơ thành công",
      //   "Hồ sơ tài xế của bạn đã được gửi tới hệ thống ViGo thành công!"
      // );
    } catch (err) {
      handleError("Có lỗi xảy ra", err);
      // console.error(err);
      // if (err.response) {
      //   Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.response.data);
      // } else {
      //   Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
      // }
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    // setConfirmOpen(true);

    if (
      avatarSource &&
      name &&
      email &&
      dob &&
      idFrontSide &&
      idBackSide &&
      vehicleType &&
      vehiclePlate &&
      vehicleFrontSide &&
      vehicleBackSide &&
      drivingFrontSide &&
      drivingBackSide
    ) {
      setConfirmOpen(true);
    } else {
      if (!avatarSource) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh đại diện của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh đại diện của bạn!"
        );
      }
      if (!name || name.length <= 5) {
        handleWarning("Thiếu thông tin", "Họ và tên phải có ít nhất 5 kí tự!");
        // Alert.alert("Thiếu thông tin", "Họ và tên phải có ít nhất 5 kí tự!");
      }
      if (!email) {
        handleWarning("Thiếu thông tin", "Vui lòng nhập email!");
        // Alert.alert("Thiếu thông tin", "Vui lòng nhập email!");
      }
      if (!dob) {
        handleWarning("Thiếu thông tin", "Vui lòng chọn ngày tháng năm sinh!");
        // Alert.alert("Thiếu thông tin", "Vui lòng chọn ngày tháng năm sinh!");
      }
      if (!idFrontSide) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh mặt trước của CCCD/CMND của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt trước của CCCD/CMND của bạn!"
        );
      }
      if (!idBackSide) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh mặt sau của CCCD/CMND của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt sau của CCCD/CMND của bạn!"
        );
      }
      if (!vehicleType) {
        // Alert.alert("Thiếu thông tin", "Vui lòng chọn loại phương tiện!");
        handleWarning("Thiếu thông tin", "Vui lòng chọn loại phương tiện!");
      }
      if (!vehiclePlate) {
        // Alert.alert("Thiếu thông tin", "Vui lòng nhập biển số xe của bạn!");
        handleWarning("Thiếu thông tin", "Vui lòng nhập biển số xe của bạn!");
      }
      if (!vehicleFrontSide) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh mặt trước của giấy đăng ký sử dụng xe của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt trước của giấy đăng ký sử dụng xe của bạn!"
        );
      }
      if (!vehicleBackSide) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh mặt sau của giấy đăng ký sử dụng xe của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt sau của giấy đăng ký sử dụng xe của bạn!"
        );
      }
      if (!drivingFrontSide) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh mặt trước của giấy phép lái xe của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt trước của giấy phép lái xe của bạn!"
        );
      }
      if (!drivingBackSide) {
        // Alert.alert(
        //   "Thiếu thông tin",
        //   "Vui lòng tải lên ảnh mặt sau của giấy phép lái xe của bạn!"
        // );
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt sau của giấy phép lái xe của bạn!"
        );
      }
    }
  };

  const loadInitialData = async () => {
    // setIsLoading(true);
    try {
      const profile = await getProfile(user.id);
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);
        setGender(profile.gender);
        setDob(new Date(profile.dateOfBirth));
        setAvatarSource(profile.avatarUrl);
        if (
          !profile.name ||
          !profile.email ||
          !profile.dateOfBirth ||
          !profile.avatarUrl
        ) {
          setIsSubmitted(false);
        }
      }
      const vehicles = await getVehicles(user.id);
      // console.log(vehicles);
      if (vehicles && vehicles.length > 0) {
        const vehicle = vehicles[0];
        setVehicleType(vehicle.vehicleTypeId);
        setVehiclePlate(vehicle.licensePlate);
      } else {
        setIsSubmitted(false);
      }

      const licenses = await getUserLicenses(user.id);
      // console.log(licenses);
      if (licenses) {
        const idLicense = licenses.filter(
          (item) => item.licenseType == "IDENTIFICATION"
        )[0];
        if (idLicense) {
          console.log(idLicense);
          setIdFrontSide(idLicense.frontSideFile);
          setIdBackSide(idLicense.backSideFile);
        } else {
          setIsSubmitted(false);
        }
        const vehicleLicense = licenses.filter(
          (item) => item.licenseType == "VEHICLE_REGISTRATION"
        )[0];
        if (vehicleLicense) {
          setVehicleFrontSide(vehicleLicense.frontSideFile);
          setVehicleBackSide(vehicleLicense.backSideFile);
        } else {
          setIsSubmitted(false);
        }
        const drivingLicense = licenses.filter(
          (item) => item.licenseType == "DRIVER_LICENSE"
        )[0];
        if (drivingLicense) {
          setDrivingFrontSide(drivingLicense.frontSideFile);
          setDrivingBackSide(drivingLicense.backSideFile);
        } else {
          setIsSubmitted(false);
        }
      }
    } catch (err) {
      throw err;
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    // console.log(idFrontSide);
    setIsLoading(true);
    try {
      setDob(defaultDob);

      loadVehicleTypes();
      loadInitialData();
      setIsLoading(false);

      // if (
      //   avatarSource &&
      //   name &&
      //   email &&
      //   dob &&
      //   idFrontSide &&
      //   idBackSide &&
      //   vehicleType &&
      //   vehiclePlate &&
      //   vehicleFrontSide &&
      //   vehicleBackSide &&
      //   drivingFrontSide &&
      //   drivingBackSide
      // ) {
      //   setIsSubmitted(true);
      // }
    } catch (err) {
      // Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
      handleError("Có lỗi xảy ra", err);
      setIsLoading(false);
    } finally {
    }
  }, []);

  const didMount = useRef(false);
  // const handleReadIdQrCode = async (frontSideUri) => {
  //   if (frontSideUri) {
  //     console.log(frontSideUri);
  //     setIsLoading(true);

  //     // let idWidth, idHeight;
  //     // Image.getSize(
  //     //   frontSideUri,
  //     //   async (width, height) => {
  //     //     idWidth = width;
  //     //     idHeight = height;
  //     //     const imageData = await getImageDataForQrReading(frontSideUri);

  //     //     console.log(imageData.length);
  //     //     console.log(idWidth, idHeight);
  //     //     const code = jsQR(imageData, idWidth, idHeight);

  //     //     console.log(code);
  //     //     if (code) {
  //     //       console.log(code.data);
  //     //     }
  //     //   },
  //     //   (error) => {
  //     //     throw error;
  //     //   }
  //     // );

  //     RNQRGenerator.detect({
  //       // uri: frontSideUri,
  //       uri: "https://firebasestorage.googleapis.com/v0/b/vigo-a7754.appspot.com/o/images%2Fdriver_CCCD_Front_uQBh977dPO1690801899281.png?alt=media&token=1dbbe6dd-6fbe-4c59-8c01-bbe92bd87916",
  //     })
  //       .then((response) => {
  //         const { values } = response;
  //         console.log(response);

  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         throw err;
  //       });
  //   }
  // };

  // useEffect(() => {
  //   if (idFrontSide) {
  //     try {
  //       handleReadIdQrCode(idFrontSide);
  //     } catch (err) {
  //       Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
  //     } finally {
  //     }
  //   }
  // }, [idFrontSide]);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <ViGoSpinner isLoading={isLoading} />
      <Box>
        <Header title="Tạo hồ sơ tài xế" isBackButtonShown={false} />
      </Box>
      <Box style={vigoStyles.body}>
        <KeyboardAvoidingView>
          <ScrollView>
            <VStack>
              {isSubmitted && (
                <Center marginBottom={"2"}>
                  {/* <Text>Hồ sơ của bạn đã được gửi đến ViGo!</Text> */}
                  <Alert status="info" colorScheme={"info"}>
                    <HStack
                      flexShrink={1}
                      space={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <HStack flexShrink={1} space={2} alignItems="center">
                        <Alert.Icon />
                        <Text
                          fontSize="md"
                          fontWeight="medium"
                          color="coolGray.800"
                        >
                          Hồ sơ của bạn đã được gửi đến ViGo!
                        </Text>
                      </HStack>
                    </HStack>
                  </Alert>
                </Center>
              )}
              <View style={{ alignItems: "center" }}>
                <Pressable
                  onPress={() => handlePickImage("Avatar", setAvatarSource)}
                  isDisabled={isSubmitted}
                >
                  <Image
                    source={
                      avatarSource
                        ? { uri: avatarSource }
                        : require("../../../assets/images/no-image.jpg")
                    }
                    // style={styles.image}
                    alt="Ảnh đại diện"
                    size={100}
                    borderRadius={100}
                  />
                </Pressable>
              </View>

              {/* <View style={styles.profileContainer}> */}
              {/* <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Số điện thoại</Text>
                <View style={styles.inputBorder}>
                  <TextInput
                    placeholder={user.phone}
                    value={user.phone}
                    style={styles.input}
                    editable={false}
                  />
                </View>
              </View> */}
              <Box>
                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Số điện thoại</FormControl.Label>
                    <Input
                      value={user.phone}
                      // editable={false}
                      isReadOnly={true}
                      variant={"filled"}
                      // style={styles.input}
                    />
                  </FormControl>
                </Box>

                {/* <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Họ và Tên</Text>
                <View style={styles.inputBorder}>
                  <TextInput
                    placeholder="Nhập họ và tên"
                    value={name}
                    autoComplete="name"
                    keyboardType="default"
                    textContentType="name"
                    onChangeText={setName}
                    style={styles.input}
                    // editable={isSubmitted == true}
                  />
                </View>
              </View> */}
                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Họ và tên</FormControl.Label>
                    <Input
                      placeholder="Nhập họ và tên"
                      value={name}
                      autoComplete="name"
                      keyboardType="default"
                      textContentType="name"
                      onChangeText={setName}
                      isReadOnly={isSubmitted}
                      // variant={"filled"}
                      // style={{ backgroundColor: "white" }}
                      style={styles.input}
                    />
                  </FormControl>
                </Box>

                {/* <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Giới tính</Text>

                <View style={styles.inputBorder}>
                  <DropDownPicker
                    open={genderOpen}
                    value={gender}
                    items={availableGender}
                    setOpen={setGenderOpen}
                    setValue={setGender}
                    setItems={setAvailableGenders}
                    zIndex={1000}
                    zIndexInverse={3000}
                    listMode="MODAL"
                    // disabled={isSubmitted == true}
                    // style={styles.input}
                  />
                </View>
              </View> */}
                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Giới tính</FormControl.Label>
                    <Select
                      accessibilityLabel="Nam hoặc nữ"
                      placeholder="Nam hoặc nữ"
                      selectedValue={gender}
                      onValueChange={(item) => setGender(item)}
                      // color={"white"}
                      isDisabled={isSubmitted}
                      backgroundColor={"white"}
                    >
                      {availableGender.map((item) => (
                        <Select.Item
                          label={item.label}
                          value={item.value}
                          key={item.value}
                        />
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Ngày sinh</Text>
                <DateTimePicker
                  isVisible={showPicker}
                  mode="date"
                  display="spinner"
                  value={dob}
                  onConfirm={(date) => {
                    setShowpicker(false);
                    setDob(date);
                    // dobRef.current.props.value = formatDate(date);
                  }}
                  onCancel={toggleDatepicker}
                  date={dob ?? new Date()}
                  // disabled={isSubmitted == true}
                />
                <View style={styles.inputBorder}>
                  <Pressable
                    // disabled={isSubmitted == true}
                    onPress={toggleDatepicker}
                  >
                    <TextInput
                      placeholder="Nhập ngày sinh"
                      value={dob ? formatDate(dob) : ""}
                      // onChangeText={setDob}
                      ref={dobRef}
                      style={styles.input}
                      editable={false}
                    />
                  </Pressable>
                </View>
              </View> */}

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Ngày sinh</FormControl.Label>
                    <Pressable
                      // disabled={isSubmitted == true}
                      isDisabled={isSubmitted}
                      onPress={toggleDatepicker}
                    >
                      <Input
                        placeholder="Nhập ngày sinh"
                        value={dob ? formatDate(dob) : ""}
                        // onChangeText={setDob}
                        ref={dobRef}
                        style={styles.input}
                        isReadOnly={true}
                      />
                    </Pressable>
                    {showPicker && (
                      <RNDateTimePicker
                        mode="date"
                        onChange={(event, date) => {
                          toggleDatepicker();
                          setDob(date);
                        }}
                        value={dob}
                        maximumDate={getMaximumDob()}
                        negativeButton={{ label: "Hủy" }}
                        positiveButton={{ label: "Xác nhận" }}
                      />
                    )}
                  </FormControl>
                </Box>

                {/* <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Email</Text>
                <View style={styles.inputBorder}>
                  <TextInput
                    placeholder="Nhập email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    // editable={isSubmitted == true}
                  />
                </View>
              </View> */}
                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Địa chỉ email</FormControl.Label>
                    <Input
                      placeholder="Nhập địa chỉ email"
                      value={email}
                      autoComplete="email"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      onChangeText={setEmail}
                      isReadOnly={isSubmitted == true}
                      // variant={"filled"}
                      // style={{ backgroundColor: "white" }}
                      style={styles.input}
                    />
                  </FormControl>
                </Box>

                {/* <View style={styles.inputContainer}>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    CCCD / CMND
                  </Text>
                  <Text style={{ marginBottom: 20 }}>
                Tải ảnh CCCD gắn chip lên để các thông tin được cập nhật chính
                xác nhất
              </Text>
                  <View style={{ ...vigoStyles.row, ...{ marginBottom: 20 } }}>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ marginBottom: 10 }}>Mặt trước</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("CCCD_Front", setIdFrontSide)
                        }
                        // disabled={isSubmitted == true}
                      >
                        <Image
                          source={
                            idFrontSide
                              ? {
                                  uri: idFrontSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                        />
                      </Pressable>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text style={{ marginBottom: 10 }}>Mặt sau</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("CCCD_Back", setIdBackSide)
                        }
                        // disabled={isSubmitted == true}
                      >
                        <Image
                          source={
                            idBackSide
                              ? {
                                  uri: idBackSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View> */}

                <Box marginTop={4}>
                  <Heading size={"md"} marginBottom={2}>
                    CCCD / CMND
                  </Heading>
                  <HStack
                    justifyContent={"space-between"}
                    paddingLeft={4}
                    paddingRight={4}
                  >
                    <VStack alignItems={"center"}>
                      <Text marginBottom={1}>Mặt trước</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("CCCD_Front", setIdFrontSide)
                        }
                        // disabled={isSubmitted == true}
                        isDisabled={isSubmitted}
                      >
                        <Image
                          source={
                            idFrontSide
                              ? {
                                  uri: idFrontSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                          alt="Ảnh CCCD mặt trước"
                        />
                      </Pressable>
                    </VStack>
                    <VStack alignItems={"center"}>
                      <Text marginBottom={1}>Mặt sau</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("CCCD_Back", setIdBackSide)
                        }
                        // disabled={isSubmitted == true}
                        isDisabled={isSubmitted}
                      >
                        <Image
                          source={
                            idBackSide
                              ? {
                                  uri: idBackSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                          alt="Ảnh CCCD mặt sau"
                        />
                      </Pressable>
                    </VStack>
                  </HStack>
                </Box>

                {/* <View style={styles.inputContainer}>
                  <Text
                    style={{
                      marginBottom: 20,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Phương tiện
                  </Text>

                  <View style={[styles.inputContainer, { width: "100%" }]}>
                    <Text style={styles.inputTitle}>Loại phương tiện</Text>

                    <View style={styles.inputBorder}>
                      <DropDownPicker
                        open={vehicleTypesOpen}
                        value={vehicleType}
                        items={vehicleTypesDropdown}
                        setOpen={setVehicleTypesOpen}
                        setValue={setVehicleType}
                        setItems={setVehicleTypesDropdown}
                        zIndex={2000}
                        zIndexInverse={2000}
                        listMode="MODAL"
                        // disabled={isSubmitted == true}
                        // style={styles.input}
                      />
                    </View>
                  </View>

                  <View style={[styles.inputContainer, { width: "100%" }]}>
                    <Text style={styles.inputTitle}>Biển số xe</Text>
                    <View style={styles.inputBorder}>
                      <TextInput
                        placeholder="72A-852.312"
                        value={vehiclePlate}
                        keyboardType="default"
                        onChangeText={setVehiclePlate}
                        style={styles.input}
                        // editable={isSubmitted == true}
                      />
                    </View>
                  </View>
                </View> */}

                <Box marginTop={4}>
                  <Heading size={"md"} marginBottom={2}>
                    Phương tiện
                  </Heading>
                  <Box>
                    <FormControl>
                      <FormControl.Label>Loại phương tiện</FormControl.Label>
                      <Select
                        accessibilityLabel="Loại phương tiện"
                        placeholder="Loại phương tiện"
                        selectedValue={vehicleType}
                        onValueChange={(vehicleTypeId) =>
                          setVehicleType(vehicleTypeId)
                        }
                        // color={"white"}
                        isDisabled={isSubmitted}
                        backgroundColor={"white"}
                      >
                        {vehicleTypesDropdown.map((item) => (
                          <Select.Item
                            label={item.label}
                            value={item.value}
                            key={item.value}
                          />
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box marginTop={3}>
                    <FormControl>
                      <FormControl.Label>Biển số xe</FormControl.Label>
                      <Input
                        placeholder="72A-852.312"
                        value={vehiclePlate}
                        keyboardType="default"
                        onChangeText={setVehiclePlate}
                        isReadOnly={isSubmitted}
                        // variant={"filled"}
                        // style={{ backgroundColor: "white" }}
                        style={styles.input}
                      />
                    </FormControl>
                  </Box>
                </Box>

                {/* <View style={styles.inputContainer}>
                  <Text
                    style={{
                      marginBottom: 20,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Giấy đăng ký sử dụng xe
                  </Text>

                  <View style={[vigoStyles.row]}>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ marginBottom: 10 }}>Mặt trước</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Vehicle_Front", setVehicleFrontSide)
                        }
                        // disabled={isSubmitted == true}
                      >
                        <Image
                          source={
                            vehicleFrontSide
                              ? {
                                  uri: vehicleFrontSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                        />
                      </Pressable>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text style={{ marginBottom: 10 }}>Mặt sau</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Vehicle_Back", setVehicleBackSide)
                        }
                        // disabled={isSubmitted == true}
                      >
                        <Image
                          source={
                            vehicleBackSide
                              ? {
                                  uri: vehicleBackSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View> */}

                <Box marginTop={4}>
                  <Heading size={"md"} marginBottom={2}>
                    Giấy đăng ký sử dụng xe
                  </Heading>
                  <HStack
                    justifyContent={"space-between"}
                    paddingLeft={4}
                    paddingRight={4}
                  >
                    <VStack alignItems={"center"}>
                      <Text marginBottom={1}>Mặt trước</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Vehicle_Front", setVehicleFrontSide)
                        }
                        // disabled={isSubmitted == true}
                        isDisabled={isSubmitted}
                      >
                        <Image
                          source={
                            vehicleFrontSide
                              ? {
                                  uri: vehicleFrontSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                          alt="Giấy đăng ký sử dụng xe mặt trước"
                        />
                      </Pressable>
                    </VStack>
                    <VStack alignItems={"center"}>
                      <Text marginBottom={1}>Mặt sau</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Vehicle_Back", setVehicleBackSide)
                        }
                        // disabled={isSubmitted == true}
                        isDisabled={isSubmitted}
                      >
                        <Image
                          source={
                            vehicleBackSide
                              ? {
                                  uri: vehicleBackSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                          alt="Giấy đăng ký sử dụng xe mặt sau"
                        />
                      </Pressable>
                    </VStack>
                  </HStack>
                </Box>

                {/* <View style={styles.inputContainer}>
                  <Text
                    style={{
                      marginBottom: 20,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Giấy phép lái xe
                  </Text>

                  <View style={vigoStyles.row}>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ marginBottom: 10 }}>Mặt trước</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Driving_Front", setDrivingFrontSide)
                        }
                        // disabled={isSubmitted == true}
                      >
                        <Image
                          source={
                            drivingFrontSide
                              ? {
                                  uri: drivingFrontSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                        />
                      </Pressable>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text style={{ marginBottom: 10 }}>Mặt sau</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Driving_Back", setDrivingBackSide)
                        }
                        // disabled={isSubmitted == true}
                      >
                        <Image
                          source={
                            drivingBackSide
                              ? {
                                  uri: drivingBackSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View> */}

                <Box marginTop={4}>
                  <Heading size={"md"} marginBottom={2}>
                    Giấy phép lái xe
                  </Heading>
                  <HStack
                    justifyContent={"space-between"}
                    paddingLeft={4}
                    paddingRight={4}
                  >
                    <VStack alignItems={"center"}>
                      <Text marginBottom={1}>Mặt trước</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Driving_Front", setDrivingFrontSide)
                        }
                        // disabled={isSubmitted == true}
                        isDisabled={isSubmitted}
                      >
                        <Image
                          source={
                            drivingFrontSide
                              ? {
                                  uri: drivingFrontSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                          alt="Giấy phép lái xe mặt trước"
                        />
                      </Pressable>
                    </VStack>
                    <VStack alignItems={"center"}>
                      <Text marginBottom={1}>Mặt sau</Text>
                      <Pressable
                        onPress={() =>
                          handlePickImage("Driving_Back", setDrivingBackSide)
                        }
                        // disabled={isSubmitted == true}
                        isDisabled={isSubmitted}
                      >
                        <Image
                          source={
                            drivingBackSide
                              ? {
                                  uri: drivingBackSide,
                                }
                              : require("../../../assets/images/no-photo.jpg")
                          }
                          style={styles.licenseImage}
                          alt="Giấy phép lái xe mặt sau"
                        />
                      </Pressable>
                    </VStack>
                  </HStack>
                </Box>
                {/* </View> */}
              </Box>
            </VStack>
          </ScrollView>
        </KeyboardAvoidingView>
      </Box>

      <Box style={styles.footer}>
        {/* <TouchableOpacity
          // activeOpacity={1}
          disabled={
            !(
              avatarSource &&
              name &&
              email &&
              dob &&
              idFrontSide &&
              idBackSide &&
              vehicleType &&
              vehiclePlate &&
              vehicleFrontSide &&
              vehicleBackSide &&
              drivingFrontSide &&
              drivingBackSide
            ) && !isSubmitted
          }
          style={styles.button}
          onPress={() => handleUpdateProfile()}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Cập nhật</Text>
        </TouchableOpacity> */}
        <Button
          isDisabled={
            !(
              avatarSource &&
              name &&
              email &&
              dob &&
              idFrontSide &&
              idBackSide &&
              vehicleType &&
              vehiclePlate &&
              vehicleFrontSide &&
              vehicleBackSide &&
              drivingFrontSide &&
              drivingBackSide
            ) || isSubmitted
          }
          style={styles.button}
          leftIcon={<CheckIcon size={24} color="white" />}
          onPress={() => handleUpdateProfile()}
        >
          Cập nhật
        </Button>
      </Box>
      <ConfirmAlert
        title="Kiểm tra lại thông tin"
        description="Vui lòng kiểm tra kĩ lại các thông tin hồ sơ tải xế của bạn trước khi gửi đi nhé"
        okButtonText="Tôi đã kiểm tra kĩ"
        cancelButtonText="Hủy"
        onOkPress={() => handleConfirmUpdateProfile()}
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        key="confirm-profile-alert"
      />
    </SafeAreaView>
  );
};

export default NewDriverUpdateProfileScreen;

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  licenseImage: {
    width: 120,
    height: 80,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  container: {
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  body: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: "white",
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 225,
  },

  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    alignItems: "center",
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: themeColors.primary,
    marginBottom: 20,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
    // backgroundColor: themeColors.linear,
  },
  inputTitle: {
    borderRadius: 10,
    color: themeColors.linear,
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: themeColors.primary,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  input: {
    height: 40,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
});
