import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'
import ProfileCard from "../../components/Card/ProfileCard";
// import { Ionicons } from '@expo/vector-icons'
import { themeColors, vigoStyles } from "../../../assets/theme/index";
import { getProfile, logUserOut } from "../../services/userService";
import {
  ArrowLeftOnRectangleIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
  WalletIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { removeItem } from "../../utils/storageUtils";
import { UserContext } from "../../context/UserContext";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage, handleError } from "../../utils/alertUtils";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import {
  Box,
  FormControl,
  HStack,
  Heading,
  Image,
  Input,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { getVehicles } from "../../services/vehicleService";
import { getMaximumDob } from "../../utils/datetimeUtils";

const ProfileSreen = () => {
  const navigation = useNavigation();
  // const [response, setResponse] = useState(null);

  const { setUser, user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const [avatarSource, setAvatarSource] = useState(user?.avatarUrl);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const [gender, setGender] = useState(user?.gender);
  const defaultDob =
    user?.dateOfBirth != null ? new Date(user?.dateOfBirth) : getMaximumDob();
  // console.log(defaultDob);

  const [dob, setDob] = useState(defaultDob);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleTypeText, setVehicleTypeText] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    // console.log(dob);

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return `${day}-${month + 1}-${year}`;
  };

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
        // setIsSubmitted(false);
      }
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // const getProfileData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const profileId = user.id;
  //     const response = await getProfile(profileId);
  //     setResponse(response);
  //   } catch (err) {
  //     setErrorMessage(getErrorMessage(err));
  //     setIsError(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    loadInitialData();
  }, []);

  // handleSendData = (item, responseData) => {
  //   if (item.navigator == "EditProfile") {
  //     navigation.navigate("EditProfile", { data: responseData });
  //   } else {
  //     navigation.navigate(item.navigator);
  //   }
  // };

  // const listAccountUtilities = [
  //   {
  //     icon: <PencilSquareIcon size={24} color={themeColors.primary} />,
  //     label: "Chỉnh sửa hồ sơ",
  //     navigator: "EditProfile",
  //   },
  //   // { icon: "flag", label: "Mốc thưởng", navigator: "Promotion" },
  //   {
  //     icon: <WalletIcon size={24} color={themeColors.primary} />,
  //     label: "Ví của tôi",
  //     navigator: "Wallet",
  //   },
  //   {
  //     icon: <BellAlertIcon size={24} color={themeColors.primary} />,
  //     label: "Thông báo của tôi",
  //     navigator: "MyNotification",
  //   },
  //   // {
  //   //   icon: <QuestionMarkCircleIcon size={24} color={themeColors.primary} />,
  //   //   label: "Trợ giúp & yêu cầu hỗ trợ",
  //   //   navigator: "Help",
  //   // },
  //   // // { icon: 'bookmark', label: 'Địa điểm đã lưu', navigator: 'MyAddresses' },
  //   // {
  //   //   icon: <ShieldCheckIcon size={24} color={themeColors.primary} />,
  //   //   label: "Bảo mật tài khoản",
  //   //   navigator: "Safety",
  //   // },
  //   // {
  //   //   icon: <UserIcon size={24} color={themeColors.primary} />,
  //   //   label: "Quản lý tài khoản",
  //   //   navigator: "Manage Account",
  //   // },
  // ];

  // const listGeneralUtilities = [
  //   {
  //     icon: <DocumentCheckIcon size={24} color={themeColors.primary} />,
  //     label: "Quy chế",
  //     navigator: "RegulationScreen",
  //   },
  //   {
  //     icon: <ClipboardDocumentListIcon size={24} color={themeColors.primary} />,
  //     label: "Bảo mật & Điều khoản",
  //     navigator: "Screen2",
  //   },
  //   // { icon: 'analytics', label: 'Dữ liệu', navigator: 'Screen1' },
  //   {
  //     icon: <StarIcon size={24} color={themeColors.primary} />,
  //     label: "Đánh giá ứng dụng ViGo",
  //     navigator: "Screen2",
  //   },
  //   // { icon: "", label: "", navigator: "" },
  // ];

  // const logout = async () => {
  //   setIsLoading(true);
  //   try {
  //     await logUserOut(setUser, navigation);
  //   } catch (err) {
  //     handleError(err);
  //   } finally {
  //     setIsLoading(false);
  //   }

  //   // navigation.navigate("Login");
  // };

  return (
    <SafeAreaView style={vigoStyles.container}>
      {/* <Header title="Thông tin tài khoản" /> */}
      <View style={vigoStyles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <ProfileCard
            // onPress={() =>
            //   navigation.navigate("EditProfile", { data: response })
            // }
            name={name ?? ""}
            phoneNumber={user.phone ?? ""}
            imageSource={
              avatarSource
                ? { uri: avatarSource }
                : require("../../../assets/images/no-image.jpg")
            }
          />

          <ScrollView mt="2">
            <HStack mt="4" justifyContent="space-between">
              <TouchableOpacity
                key={"my-wallet"}
                // style={styles.list}
                onPress={() => navigation.navigate("Wallet")}
              >
                <HStack>
                  <WalletIcon size={24} color={themeColors.primary} />
                  <Text style={{ marginLeft: 10 }}>Ví của tôi</Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                key={"my-notification"}
                // style={styles.list}
                onPress={() => {
                  navigation.navigate("MyNotification");
                }}
              >
                <HStack>
                  <BellAlertIcon size={24} color={themeColors.primary} />
                  <Text style={{ marginLeft: 10 }}>Thông báo của tôi</Text>
                </HStack>
              </TouchableOpacity>
            </HStack>
            <VStack pb="4">
              <Box>
                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Giới tính</FormControl.Label>
                    <Input
                      placeholder="Nam hoặc nữ"
                      value={gender == true ? "Nam" : "Nữ"}
                      isReadOnly
                      // variant={"filled"}
                      // style={{ backgroundColor: "white" }}
                      style={styles.input}
                    />
                  </FormControl>
                </Box>

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Ngày sinh</FormControl.Label>

                    <Input
                      placeholder="Nhập ngày sinh"
                      value={dob ? formatDate(dob) : ""}
                      // onChangeText={setDob}
                      // ref={dobRef}
                      style={styles.input}
                      isReadOnly={true}
                    />
                  </FormControl>
                </Box>

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Địa chỉ email</FormControl.Label>
                    <Input
                      placeholder="Nhập địa chỉ email"
                      value={email}
                      autoComplete="email"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      // onChangeText={setEmail}
                      // isReadOnly={isSubmitted == true}
                      isReadOnly
                      // variant={"filled"}
                      // style={{ backgroundColor: "white" }}
                      style={styles.input}
                    />
                  </FormControl>
                </Box>
              </Box>
            </VStack>

            <VStack pt={4} pb="2">
              <Heading size={"md"} marginBottom={2}>
                Phương tiện
              </Heading>
              <Box>
                <FormControl>
                  <FormControl.Label>Loại phương tiện</FormControl.Label>
                  <Input
                    placeholder="Loại phương tiện"
                    value={vehicleTypeText}
                    isReadOnly
                    // variant={"filled"}
                    // style={{ backgroundColor: "white" }}
                    style={styles.input}
                  />
                </FormControl>
              </Box>
              <Box marginTop={3}>
                <FormControl>
                  <FormControl.Label>Biển số xe</FormControl.Label>
                  <Input
                    placeholder="72A-852.312"
                    value={vehiclePlate}
                    keyboardType="default"
                    // onChangeText={setVehiclePlate}
                    // isReadOnly={isSubmitted}
                    isReadOnly
                    // variant={"filled"}
                    // style={{ backgroundColor: "white" }}
                    style={styles.input}
                  />
                </FormControl>
              </Box>
            </VStack>

            <HStack mt="4">
              <TouchableOpacity
                style={[
                  vigoStyles.buttonWhite,
                  { borderColor: "red", flex: 1 },
                ]}
                onPress={() => {
                  // setCurrentStep(0);
                  // scrollToTop();
                  logUserOut(setUser, navigation);
                }}
                // disabled={isAmountInvalid}
              >
                <HStack justifyContent="center">
                  <ArrowLeftOnRectangleIcon size={24} color={"red"} />
                  <Text ml="1" style={{ color: "red" }}>
                    Đăng xuất
                  </Text>
                </HStack>
              </TouchableOpacity>
            </HStack>
          </ScrollView>
          {/* <ScrollView mt="3">
            {listAccountUtilities.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.list}
                onPress={() => handleSendData(item, response)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.icon}
                  <Text style={{ marginLeft: 10 }}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              key="logout"
              style={styles.list}
              onPress={() => logout()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowLeftOnRectangleIcon
                  size={24}
                  color={themeColors.primary}
                />
                <Text style={{ marginLeft: 10 }}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>

          </ScrollView> */}
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  body: {
    backgroundColor: themeColors.linear,
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    paddingTop: 20,
  },
  list: {
    paddingTop: 20,
    fontSize: 20,
  },
  input: {
    height: 40,
    padding: 10,
    backgroundColor: themeColors.cardColor,
    borderRadius: 5,
  },
});

export default ProfileSreen;
