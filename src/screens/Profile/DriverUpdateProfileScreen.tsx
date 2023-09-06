import React, {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserContext } from "../../context/UserContext";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { themeColors, vigoStyles } from "../../../assets/theme";
import {
  Alert,
  Box,
  Center,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "native-base";
import { SafeAreaView } from "react-native";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import Header from "../../components/Header/Header";
import StepIndicator from "react-native-step-indicator";
import DriverAddIdTab from "./components/DriverAddIdTab";
import { getMaximumDob } from "../../utils/datetimeUtils";
import DriverAddDriverLicenseTab from "./components/DriverAddDriverLicenseTab";
import DriverAddVehicleTab from "./components/DriverAddVehicleTab";
import DriverReviewInformationTab from "./components/DriverReviewInformationTab";
import {
  createVehicle,
  getVehicleTypes,
  getVehicles,
} from "../../services/vehicleService";
import {
  eventNames,
  getErrorMessage,
  handleError,
  handleWarning,
} from "../../utils/alertUtils";
import {
  editProfile,
  getProfile,
  logUserOut,
} from "../../services/userService";
import {
  createUserLicense,
  getUserLicenses,
} from "../../services/userLicenseService";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { launchImageLibrary } from "react-native-image-picker";
import { generateImageName } from "../../utils/imageUtils";
import { uploadFile } from "../../utils/firebaseUtils";
import { NativeEventEmitter } from "react-native";
import {
  readDriverInformation,
  readIdInformation,
} from "../../services/imageService";
import moment from "moment";
import ConfirmAlert from "../../components/Alert/ConfirmAlert";
import { useNavigation } from "@react-navigation/native";
import { removeItem } from "../../utils/storageUtils";
import auth from "@react-native-firebase/auth";

const DriverUpdateProfileScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const [isSubmitted, setIsSubmitted] = useState(true);

  const [activeStep, setActiveStep] = useState(0);

  const pickingImage = require("../../../assets/images/image-picker.png");

  const [idFrontSide, setIdFrontSide] = useState("");
  const [idBackSide, setIdBackSide] = useState("");
  const [isIdFrontSideChange, setIsIdFrontSideChange] = useState(false);
  const [isDrivingFrontSideChange, setIsDrivingFrontSideChange] =
    useState(false);

  const [avatarSource, setAvatarSource] = useState(
    user?.avatarUrl as string | null
  );
  const [name, setName] = useState(user?.name as string);
  const [email, setEmail] = useState(user?.email as string);

  const [gender, setGender] = useState(user?.gender as boolean);
  const defaultDob =
    user?.dateOfBirth != null ? new Date(user?.dateOfBirth) : getMaximumDob();
  // console.log(defaultDob);

  const [dob, setDob] = useState(defaultDob as Date | undefined);
  const [drivingFrontSide, setDrivingFrontSide] = useState("");
  const [drivingBackSide, setDrivingBackSide] = useState("");

  const [vehicleFrontSide, setVehicleFrontSide] = useState("");
  const [vehicleBackSide, setVehicleBackSide] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleTypeText, setVehicleTypeText] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([] as any[]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const eventEmitter = new NativeEventEmitter();
  const navigation = useNavigation();

  let scrollRef = useRef() as any;

  const scrollToTop = () => {
    if (scrollRef) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  const renderInformation = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        // Thông tin cá nhân
        return (
          <DriverAddIdTab
            handlePickId_FrontSide={() =>
              handlePickImage("CCCD_Front", setIdFrontSide)
            }
            handlePickId_BackSide={() =>
              handlePickImage("CCCD_Back", setIdBackSide)
            }
            handlePickAvatar={() => handlePickImage("Avatar", setAvatarSource)}
            idBackSide={idBackSide}
            idFrontSide={idFrontSide}
            // setIdBackSide={setIdBackSide}
            // setIdFrontSide={setIdFrontSide}
            isSubmitted={isSubmitted}
            pickImage={pickingImage}
            avatarSource={avatarSource}
            // setAvatarSource={setAvatarSource}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            gender={gender}
            setGender={setGender}
            dob={dob}
            setDob={setDob}
            setNextStep={() => setActiveStep(1)}
            scrollToTop={scrollToTop}
            isIdFrontSideChange={isIdFrontSideChange}
            handleReadIdFrontSideText={handleReadIdFrontSideText}
            navigation={navigation}
          />
        );
      case 1:
        // GPLX
        return (
          <DriverAddDriverLicenseTab
            handlePickLicense_FrontSide={() =>
              handlePickImage("Driving_Front", setDrivingFrontSide)
            }
            handlePickLicense_BackSide={() =>
              handlePickImage("Driving_Back", setDrivingBackSide)
            }
            isSubmitted={isSubmitted}
            pickImage={pickingImage}
            setNextStep={() => setActiveStep(2)}
            setPreviousStep={() => setActiveStep(0)}
            drivingFrontSide={drivingFrontSide}
            setDrivingFrontSide={setDrivingFrontSide}
            drivingBackSide={drivingBackSide}
            setDrivingBackSide={setDrivingBackSide}
            scrollToTop={scrollToTop}
            isDrivingFrontSideChange={isDrivingFrontSideChange}
            handleReadDrivingFrontSideText={handleReadDrivingFrontSideText}
          />
        );
      case 2:
        // Vehicle
        return (
          <DriverAddVehicleTab
            handlePickVehicle_FrontSide={() =>
              handlePickImage("Vehicle_Front", setVehicleFrontSide)
            }
            handlePickVehicle_BackSide={() =>
              handlePickImage("Vehicle_Back", setVehicleBackSide)
            }
            isSubmitted={isSubmitted}
            pickImage={pickingImage}
            setNextStep={() => setActiveStep(3)}
            setPreviousStep={() => setActiveStep(1)}
            vehicleFrontSide={vehicleFrontSide}
            setVehicleFrontSide={setVehicleFrontSide}
            vehicleBackSide={vehicleBackSide}
            setVehicleBackSide={setVehicleBackSide}
            scrollToTop={scrollToTop}
            setIsLoading={setIsLoading}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            vehicleTypeText={vehicleTypeText}
            setVehicleTypeText={setVehicleTypeText}
            vehiclePlate={vehiclePlate}
            setVehiclePlate={setVehiclePlate}
            loadVehicleTypes={loadVehicleTypesMemo}
            vehicleTypes={vehicleTypes}
          />
        );
      case 3:
        // Review
        return (
          <DriverReviewInformationTab
            name={name}
            email={email}
            gender={gender}
            dob={dob}
            avatarSource={avatarSource}
            vehicleTypeText={vehicleTypeText}
            vehiclePlate={vehiclePlate}
            scrollToTop={scrollToTop}
            setPreviousStep={() => setActiveStep(2)}
            handleOpenConfirm={handleOpenConfirm}
            isSubmitted={isSubmitted}
            navigation={navigation}
          />
        );
      default:
        return <></>;
    }
  };

  const loadVehicleTypes = async () => {
    try {
      setIsLoading(true);
      const response = await getVehicleTypes();
      setVehicleTypes(response);
      // setVehicleTypesDropdown(
      //   response.map((item: any) => ({
      //     label: item.name,
      //     value: item.id,
      //   }))
      // );
    } catch (err) {
      // handleError("Có lỗi xảy ra", err);
      throw err;
    } finally {
      // setIsLoading(false);
    }
    // console.log(response);
  };

  const loadVehicleTypesMemo = useCallback(() => {
    loadVehicleTypes();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
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
          // console.log("False Profile");
          setIsSubmitted(false);
        }
      }
      const vehicles = await getVehicles(user.id);
      // console.log(vehicles);
      if (vehicles && vehicles.length > 0) {
        const vehicle = vehicles[0];
        setVehicleType(vehicle.vehicleTypeId);
        setVehicleTypeText(vehicle.vehicleType.name);
        setVehiclePlate(vehicle.licensePlate);
      } else {
        // console.log("False Vehicle");
        setIsSubmitted(false);
      }

      const licenses = await getUserLicenses(user.id);
      // console.log(licenses);
      if (licenses) {
        const idLicense = licenses.filter(
          (item: any) => item.licenseType == "IDENTIFICATION"
        )[0];
        if (idLicense) {
          // console.log(idLicense);
          setIdFrontSide(idLicense.frontSideFile);
          setIdBackSide(idLicense.backSideFile);
        } else {
          // console.log("False ID");
          setIsSubmitted(false);
        }
        const vehicleLicense = licenses.filter(
          (item: any) => item.licenseType == "VEHICLE_REGISTRATION"
        )[0];
        if (vehicleLicense) {
          setVehicleFrontSide(vehicleLicense.frontSideFile);
          setVehicleBackSide(vehicleLicense.backSideFile);
        } else {
          // console.log("False Vehicle License");
          setIsSubmitted(false);
        }
        const drivingLicense = licenses.filter(
          (item: any) => item.licenseType == "DRIVER_LICENSE"
        )[0];
        if (drivingLicense) {
          setDrivingFrontSide(drivingLicense.frontSideFile);
          setDrivingBackSide(drivingLicense.backSideFile);
        } else {
          // console.log("False Driving");
          setIsSubmitted(false);
        }
      }

      setCount(1);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isSubmitted == true && count === 1) {
      setActiveStep(3);
    } else {
      setActiveStep(0);
    }
  }, [isSubmitted, count]);

  useEffect(() => {
    // setIsLoading(true);
    try {
      loadVehicleTypesMemo();
      loadInitialData();
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
      setIsError(true);
    } finally {
      // setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsIdFrontSideChange(true);
  }, [idFrontSide]);

  useEffect(() => {
    setIsDrivingFrontSideChange(true);
  }, [drivingFrontSide]);

  const handlePickImage = async (
    imageType: string,
    setImageUrl: Dispatch<React.SetStateAction<string>>
  ) => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
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
              // toast.show({
              //   description: "Tải ảnh lên thành công",
              //   duration: 2000,
              // });
              eventEmitter.emit(eventNames.SHOW_TOAST, {
                title: "Tải ảnh lên thành công",
                description: "",
                status: "info",
                // placement: "bottom",
                duration: 3000,
                isSlide: true,
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

  const handleReadIdFrontSideText = async (
    idFrontSideUrl: string,
    callback: () => void
  ) => {
    try {
      setIsLoading(true);
      const idResponse = await readIdInformation(idFrontSideUrl);
      console.log(idResponse);
      setName(idResponse.name);
      if (idResponse.dob.includes("/")) {
        setDob(moment(idResponse.dob, "DD/MM/YYYY").toDate());
      } else if (idResponse.dob.includes("-")) {
        setDob(moment(idResponse.dob, "DD-MM-YYYY").toDate());
      }
      setGender(idResponse.sex);
      setIsIdFrontSideChange(false);
      callback();
    } catch (error) {
      // console.log("Read From ID Failed: ");
      // console.log(getErrorMessage(error));
      handleError("Ảnh không hợp lệ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadDrivingFrontSideText = async (
    drivingFrontSideUrl: string,
    callback: () => void
  ) => {
    try {
      setIsLoading(true);
      const drivingResponse = await readDriverInformation(drivingFrontSideUrl);
      console.log(drivingResponse);
      const checkName = drivingResponse.name;
      let checkDob = null;

      if (drivingResponse.dob.includes("/")) {
        checkDob = moment(drivingResponse.dob, "DD/MM/YYYY").toDate();
      } else if (drivingResponse.dob.includes("-")) {
        checkDob = moment(drivingResponse.dob, "DD-MM-YYYY").toDate();
      }

      setIsDrivingFrontSideChange(false);
      if (checkName !== name || !checkDob || checkDob != dob) {
        handleError(
          "Thông tin không trùng khớp",
          "Thông tin họ tên hoặc ngày sinh trên các giấy tờ không trùng khớp! Vui lòng kiểm tra lại thông tin của bạn!"
        );
      } else {
        callback();
      }
    } catch (error) {
      handleError("Ảnh không hợp lệ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirm = () => {
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
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh đại diện của bạn!"
        );
      }
      if (!name || name.length <= 5) {
        handleWarning("Thiếu thông tin", "Họ và tên phải có ít nhất 5 kí tự!");
      }
      if (!email) {
        handleWarning("Thiếu thông tin", "Vui lòng nhập email!");
      }
      if (!dob) {
        handleWarning("Thiếu thông tin", "Vui lòng chọn ngày tháng năm sinh!");
      }
      if (!idFrontSide) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt trước của CCCD/CMND của bạn!"
        );
      }
      if (!idBackSide) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt sau của CCCD/CMND của bạn!"
        );
      }
      if (!vehicleType) {
        handleWarning("Thiếu thông tin", "Vui lòng chọn loại phương tiện!");
      }
      if (!vehiclePlate) {
        handleWarning("Thiếu thông tin", "Vui lòng nhập biển số xe của bạn!");
      }
      if (!vehicleFrontSide) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt trước của giấy đăng ký sử dụng xe của bạn!"
        );
      }
      if (!vehicleBackSide) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt sau của giấy đăng ký sử dụng xe của bạn!"
        );
      }
      if (!drivingFrontSide) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt trước của giấy phép lái xe của bạn!"
        );
      }
      if (!drivingBackSide) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh mặt sau của giấy phép lái xe của bạn!"
        );
      }
    }
  };

  const handleUpdateProfile = async () => {
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
        (item: any) => item.id == vehicleType
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

      setIsSubmitted(true);
      setIsLoading(false);

      eventEmitter.emit(eventNames.SHOW_TOAST, {
        title: "Tạo hồ sơ thành công",
        description:
          "Hồ sơ tài xế của bạn đã được gửi tới hệ thống ViGo thành công! Hãy chờ quản trị viên xem xét hồ sơ của bạn nhé",
        status: "success",
        // placement: "top",
        isDialog: true,
        onOkPress: async () => {
          // await removeItem("token");
          // await auth().signOut();

          // // await setUserData(null);
          // setUser(null);

          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: "Login" }],
          // });
          await logUserOut(setUser, navigation);
        },
      });
    } catch (err) {
      handleError("Có lỗi xảy ra", err);
      setIsLoading(false);
    }
  };

  // console.log(isSubmitted);
  return (
    <SafeAreaView style={vigoStyles.container}>
      <ViGoSpinner isLoading={isLoading} />
      <Header title="Tạo hồ sơ tài xế" isBackButtonShown={false} />

      <Box style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <StepIndicator
            customStyles={stepIndicatorCustomStyles}
            currentPosition={activeStep}
            labels={stepIndicatorData.map((item) => item.label)}
            // direction="horizontal"
            stepCount={stepIndicatorData.length}
            // onPress={setActiveStep}
          />
          {isSubmitted && count == 1 && (
            <Center marginBottom={"2"} mt="2">
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
          <ScrollView ref={scrollRef}>
            {renderInformation(activeStep)}
          </ScrollView>
        </ErrorAlert>
      </Box>
      <ConfirmAlert
        title="Kiểm tra lại thông tin"
        description="Vui lòng kiểm tra kĩ lại các thông tin hồ sơ tải xế của bạn trước khi gửi đi nhé"
        okButtonText="Tôi đã kiểm tra kĩ"
        cancelButtonText="Hủy"
        onOkPress={() => handleUpdateProfile()}
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        key="confirm-profile-alert"
        onCancelPress={() => {}}
      />
    </SafeAreaView>
  );
};

const stepIndicatorData = [
  {
    label: "Thông tin cá nhân",
  },
  {
    label: "Giấy phép lái xe",
  },
  {
    label: "Phương tiện",
  },
  {
    label: "Kiểm tra thông tin",
  },
];

const stepIndicatorCustomStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: themeColors.primary,
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: themeColors.primary,
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: themeColors.primary,
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: themeColors.primary,
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 16,
  stepIndicatorLabelCurrentColor: themeColors.primary,
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 12,
  currentStepLabelColor: themeColors.primary,
};

export default DriverUpdateProfileScreen;
