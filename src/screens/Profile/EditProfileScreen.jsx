import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import storage from "@react-native-firebase/storage";

// IMPORT COMPONENTS

import CustomButton from "../../components/Button/CustomButton";
import Profile from "../../components/Profile/Profile";
import { themeColors } from "../../../assets/theme/index";
import Header from "../../components/Header/Header";
import { editProfile } from "../../services/userService";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { months } from "moment/moment";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  console.log(route);
  const { data } = route.params;
  const [imageSource, setImageSource] = useState(
    "https://avatars.githubusercontent.com/u/66261053?v=4"
  );
  const [phone, setPhone] = React.useState(
    data.phone == null ? "" : data.phone
  );
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowpicker] = useState(false);

  const [formData, setFormData] = useState({
    email: data.email == null ? "" : data.email,
    password: "",
    name: data.name == null ? "" : data.name,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth == null ? "" : data.dateOfBirth,
    avatarUrl:
      data.avatarUrl == null
        ? "https://avatars.githubusercontent.com/u/66261053?v=4"
        : data.avatarUrl,
  });
  const handleImageUpload = async (imageUri) => {
    try {
      const fileName = "image.jpg";
      const imageUrl = await uploadImageToFirebase(imageUri, fileName);
      console.log("Image uploaded to Firebase:", imageUrl);

      // Save the image URL to your API
      saveImageUrlToAPI(imageUrl);
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${year}-${month}-${day}`;
  };
  const handleSubmit = (formData) => {
    console.log(formData);
    editProfile(data.id, formData)
      .then((response) => {
        console.log("Profile updated:", response);
        // Do something after the profile is successfully updated
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
        // Handle the error if the profile update fails
      });
    console.log("Form submitted");
    // Call the API or perform any other actions you need
  };

  const toggleDatepicker = () => {
    setShowpicker(!showPicker);
  };
  const onChange = ({ type }, selectDate) => {
    if (type == "set") {
      const currentDate = selectDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setFormData((prevState) => ({
          ...prevState,
          dateOfBirth: formatDate(currentDate),
        }));
      }
    } else {
      togleDatepicker();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Chỉnh sửa hồ sơ" />
      </View>
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => handleImageUpload(imageSource)}>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: imageSource }} />
              </View>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Họ và Tên</Text>
              <View style={styles.inputBorder}>
                <TextInput
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Mật khẩu</Text>
              <View style={styles.inputBorder}>
                <TextInput
                  placeholder="Nhập mật khẩu mới"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Số điện thoại</Text>
              <View style={styles.inputBorder}>
                <TextInput
                  placeholder={phone}
                  value={phone}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Email</Text>
              <View style={styles.inputBorder}>
                <TextInput
                  placeholder="Nhập email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Ngày sinh</Text>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                />
              )}
              <View style={styles.inputBorder}>
                {!showPicker && (
                  <Pressable onPress={toggleDatepicker}>
                    <TextInput
                      placeholder="Nhập ngày sinh"
                      value={formData.dateOfBirth}
                      onChangeText={(text) =>
                        handleInputChange("dateOfBirth", text)
                      }
                      style={styles.input}
                      editable={false}
                    />
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Giới tính</Text>
              <View style={styles.inputBorder}>
                <TextInput
                  placeholder={formData.gender ? "Nữ" : "Nam"}
                  value={formData.gender ? "Nam" : "Nữ"}
                  onChangeText={(text) =>
                    handleInputChange("gender", text === "Nam")
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSubmit(formData)}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // safeContainer: {
  //   flex: 1,
  //   paddingTop: StatusBar.currentHeight,
  // },
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
  image: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    width: "80%",
    marginBottom: 10,
    backgroundColor: themeColors.linear,
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
  },
});

export default EditProfileScreen;
