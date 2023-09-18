import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'
import ProfileCard from "../../components/Card/ProfileCard";
// import { Ionicons } from '@expo/vector-icons'
import { themeColors, vigoStyles } from "../../../assets/theme/index";
import {
  getProfile,
  getUserAnalysis,
  logUserOut,
} from "../../services/userService";
import {
  ArrowLeftOnRectangleIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  FlagIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
  WalletIcon,
} from "react-native-heroicons/solid";
import {
  UsersIcon as UsersOutlineIcon,
  GiftIcon as GiftOutlineIcon,
  EnvelopeIcon as EnvelopeOutlineIcon,
  FireIcon as FireOutlineIcon,
  XCircleIcon as XCircleOutlineIcon,
  TruckIcon as TruckOutlineIcon,
} from "react-native-heroicons/outline";
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
import moment from "moment";
import { toPercent } from "../../utils/numberUtils";
import { getCancelRateTextColor } from "../../utils/userUtils";

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

  const [rating, setRating] = useState(0);
  const [canceledTripRate, setCanceledTripRate] = useState(0);

  const [completedTrips, setCompletedTrips] = useState(0);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleTypeText, setVehicleTypeText] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    // console.log(dob);

    // let year = date.getFullYear();
    // let month = date.getMonth();
    // let day = date.getDate();

    return moment(date).format("DD/MM/YYYY").toString();
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
        setRating(profile.rating);
        setCanceledTripRate(profile.canceledTripRate);
      }

      const analysis = await getUserAnalysis(user.id);
      setCompletedTrips(analysis.totalCompletedTrips);

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
      if (err.response && err.response.status == 401) {
        await logUserOut(setUser, navigation);
      } else {
        setErrorMessage(getErrorMessage(err));
        setIsError(true);
      }
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
    const unsubscribe = navigation.addListener("focus", () => {
      loadInitialData();
    });
    return unsubscribe;
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
      <View style={[vigoStyles.body, { paddingHorizontal: 0 }]}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <Box style={{ paddingHorizontal: 20 }}>
            <ProfileCard
              // onPress={() =>
              //   navigation.navigate("EditProfile", { data: response })
              // }
              name={name ?? ""}
              phoneNumber={user?.phone ?? ""}
              imageSource={
                avatarSource
                  ? { uri: avatarSource }
                  : require("../../../assets/images/no-image.jpg")
              }
              rate={rating}
            />
          </Box>

          <ScrollView mt="2">
            <HStack
              mt="4"
              justifyContent="space-between"
              style={{ paddingHorizontal: 20 }}
            >
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
            <HStack
              mt="4"
              justifyContent="space-between"
              style={{ paddingHorizontal: 20 }}
            >
              <TouchableOpacity
                key={"my-report"}
                // style={styles.list}
                onPress={() => navigation.navigate("MyReport")}
              >
                <HStack>
                  <FlagIcon size={24} color={themeColors.primary} />
                  <Text style={{ marginLeft: 10 }}>Báo cáo của tôi</Text>
                </HStack>
              </TouchableOpacity>
            </HStack>
            <VStack mt={3} pb="4" backgroundColor={themeColors.cardColor}>
              <Box style={{ paddingHorizontal: 20 }}>
                <Heading mt={3} size={"sm"} marginBottom={4}>
                  Thông tin cá nhân
                </Heading>
                <HStack alignItems="center">
                  {/* <FormControl>
                      <FormControl.Label>Giới tính</FormControl.Label>
                      <Input
                        placeholder="Nam hoặc nữ"
                        value={gender == true ? "Nam" : "Nữ"}
                        isReadOnly
                        // variant={"filled"}
                        // style={{ backgroundColor: "white" }}
                        style={styles.input}
                      />
                      <Text bold>{gender == true ? "Nam" : "Nữ"}</Text>
                    </FormControl> */}
                  <UsersOutlineIcon size={17} color="black" />
                  <Text ml="2">
                    Giới tính <Text bold>{gender == true ? "Nam" : "Nữ"}</Text>
                  </Text>
                </HStack>

                <HStack marginTop={3} alignItems="center">
                  {/* <FormControl>
                      <FormControl.Label>Ngày sinh</FormControl.Label>

                      <Input
                        placeholder="Nhập ngày sinh"
                        value={dob ? formatDate(dob) : ""}
                        // onChangeText={setDob}
                        // ref={dobRef}
                        style={styles.input}
                        isReadOnly={true}
                      />
                      <Text bold>
                        {dob ? formatDate(dob) : "Chưa có dữ liệu"}
                      </Text>
                    </FormControl> */}
                  <GiftOutlineIcon size={17} color="black" />
                  <Text ml="2">
                    Ngày sinh{" "}
                    <Text bold>
                      {dob ? formatDate(dob) : "Chưa có dữ liệu"}
                    </Text>
                  </Text>
                </HStack>

                <HStack marginTop={3} alignItems="center">
                  {/* <FormControl>
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
                    <Text bold>{email}</Text>
                  </FormControl> */}
                  <EnvelopeOutlineIcon size={17} color="black" />
                  <Text ml="2">
                    Địa chỉ email: <Text bold>{email}</Text>
                  </Text>
                </HStack>
              </Box>
            </VStack>

            <VStack mt={5} pb="2" backgroundColor={themeColors.cardColor}>
              <Box style={{ paddingHorizontal: 20 }}>
                <Heading mt={3} size={"sm"} marginBottom={4}>
                  Thông tin tài xế
                </Heading>
                <HStack alignItems="center">
                  <TruckOutlineIcon size={17} color="black" />
                  <Text ml="2">
                    Phương tiện{" "}
                    <Text bold>{`${vehicleTypeText} ${vehiclePlate}`}</Text>
                  </Text>
                </HStack>
                <HStack alignItems="center" mt="3">
                  {/* <FormControl>
                    <FormControl.Label>
                      Số chuyến đi đã hoàn thành
                    </FormControl.Label>
                    <Input
                        placeholder="Đã hoành thành"
                        value={completedTrips > 0 ? `${completedTrips} chuyến` : `Chưa có thông tin`}
                        isReadOnly
                        // variant={"filled"}
                        // style={{ backgroundColor: "white" }}
                        style={styles.input}
                      />
                    <Text bold>
                      {completedTrips > 0
                        ? `${completedTrips} chuyến`
                        : `Chưa có thông tin`}
                    </Text>
                  </FormControl> */}
                  <FireOutlineIcon size={17} color="black" />
                  <Text ml="2">
                    Số chuyến đi đã hoàn thành{" "}
                    <Text bold>
                      {completedTrips > 0
                        ? `${completedTrips} chuyến`
                        : `Chưa có thông tin`}
                    </Text>
                  </Text>
                </HStack>

                <HStack marginTop={3} alignItems="center">
                  {/* <FormControl>
                    <FormControl.Label>Tỉ lệ hủy chuyến</FormControl.Label>

                    <Text color={getCancelRateTextColor(canceledTripRate)}>
                      {toPercent(canceledTripRate)}
                    </Text>
                  </FormControl> */}
                  <XCircleOutlineIcon size={17} color="black" />
                  <Text ml="2" pt="0">
                    Tỉ lệ hủy chuyến{" "}
                    <Text bold color={getCancelRateTextColor(canceledTripRate)}>
                      {toPercent(canceledTripRate)}
                    </Text>
                  </Text>
                </HStack>
                {/* <Box>
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
                </Box> */}
              </Box>
            </VStack>

            <HStack mt="4" style={{ paddingHorizontal: 20 }}>
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
