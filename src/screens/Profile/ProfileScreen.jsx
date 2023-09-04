import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header/Header";
// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'
import ProfileCard from "../../components/Card/ProfileCard";
// import { Ionicons } from '@expo/vector-icons'
import { themeColors } from "../../../assets/theme/index";
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

const ProfileSreen = () => {
  const navigation = useNavigation();
  const [response, setResponse] = useState(null);

  const { setUser, user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const getProfileData = async () => {
    setIsLoading(true);
    try {
      const profileId = user.id;
      const response = await getProfile(profileId);
      setResponse(response);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProfileData();
  }, []);

  handleSendData = (item, responseData) => {
    if (item.navigator == "EditProfile") {
      navigation.navigate("EditProfile", { data: responseData });
    } else {
      navigation.navigate(item.navigator);
    }
  };

  const listAccountUtilities = [
    {
      icon: <PencilSquareIcon size={24} color={themeColors.primary} />,
      label: "Chỉnh sửa hồ sơ",
      navigator: "EditProfile",
    },
    // { icon: "flag", label: "Mốc thưởng", navigator: "Promotion" },
    {
      icon: <WalletIcon size={24} color={themeColors.primary} />,
      label: "Ví của tôi",
      navigator: "Wallet",
    },
    {
      icon: <BellAlertIcon size={24} color={themeColors.primary} />,
      label: "Thông báo của tôi",
      navigator: "MyNotification",
    },
    {
      icon: <QuestionMarkCircleIcon size={24} color={themeColors.primary} />,
      label: "Trợ giúp & yêu cầu hỗ trợ",
      navigator: "Help",
    },
    // { icon: 'bookmark', label: 'Địa điểm đã lưu', navigator: 'MyAddresses' },
    {
      icon: <ShieldCheckIcon size={24} color={themeColors.primary} />,
      label: "Bảo mật tài khoản",
      navigator: "Safety",
    },
    {
      icon: <UserIcon size={24} color={themeColors.primary} />,
      label: "Quản lý tài khoản",
      navigator: "Manage Account",
    },
  ];

  const listGeneralUtilities = [
    {
      icon: <DocumentCheckIcon size={24} color={themeColors.primary} />,
      label: "Quy chế",
      navigator: "RegulationScreen",
    },
    {
      icon: <ClipboardDocumentListIcon size={24} color={themeColors.primary} />,
      label: "Bảo mật & Điều khoản",
      navigator: "Screen2",
    },
    // { icon: 'analytics', label: 'Dữ liệu', navigator: 'Screen1' },
    {
      icon: <StarIcon size={24} color={themeColors.primary} />,
      label: "Đánh giá ứng dụng ViGo",
      navigator: "Screen2",
    },
    // { icon: "", label: "", navigator: "" },
  ];

  const logout = async () => {
    setIsLoading(true);
    try {
      await logUserOut(setUser, navigation);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }

    // navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Thông tin tài khoản" />
      </View>
      <ScrollView style={styles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <ProfileCard
            onPress={() =>
              navigation.navigate("EditProfile", { data: response })
            }
            name={response && response.name ? response.name : ""}
            phoneNumber={response && response.phone ? response.phone : ""}
            imageSource={{
              uri:
                response && response.avatarUrl
                  ? response.avatarUrl
                  : "https://avatars.githubusercontent.com/u/66261053?v=4",
            }}
          />

          <Text style={styles.title}>Tài Khoản</Text>
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
              <ArrowLeftOnRectangleIcon size={24} color={themeColors.primary} />
              <Text style={{ marginLeft: 10 }}>Đăng xuất</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>Thông tin chung</Text>
          {listGeneralUtilities.map((item, index) => (
            <TouchableOpacity key={index} style={styles.list}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.icon}
                <Text style={{ marginLeft: 10 }}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ErrorAlert>
      </ScrollView>
      <View style={styles.footer}>{/* <BottomNavigationBar /> */}</View>
    </View>
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
    fontWeight: "bold",
    paddingTop: 20,
  },
  list: {
    paddingTop: 20,
    fontSize: 20,
  },
});

export default ProfileSreen;
