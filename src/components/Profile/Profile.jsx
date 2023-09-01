import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { themeColors } from "../../../assets/theme";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

import { editProfile } from "../../services/userService";

const Profile = ({ data, onSubmit }) => {
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
  const [imageSource, setImageSource] = useState(
    "https://avatars.githubusercontent.com/u/66261053?v=4"
  );
  const [name, setName] = React.useState();
  const [phone, setPhone] = React.useState(
    data.phone == null ? "" : data.phone
  );
  const [dateOfBirth, setDateOfBirth] = React.useState();
  const [email, setEmail] = React.useState();
  const [number, setGender] = React.useState();

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const handleSubmit = () => {
    onSubmit(formData);
  };
  const uploadImageToFirebase = async (imageUri, fileName) => {
    const reference = storage().ref(fileName);
    await reference.putFile(imageUri);
    const imageUrl = await reference.getDownloadURL();
    return imageUrl;
  };

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

  const handleImagePress = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        setImageSource(response.uri);
      }
    }).catch((error) => {
      console.log("Error launching image library: ", error);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImageUpload(imageSource)}>
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
          <TextInput placeholder={phone} value={phone} style={styles.input} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <View style={styles.inputBorder}>
          <TextInput
            placeholder="Nhập email"
            onChangeText={(text) => handleInputChange("email", text)}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Ngày sinh</Text>
        <View style={styles.inputBorder}>
          <TextInput
            placeholder="Nhập ngày sinh"
            value={formData.dateOfBirth}
            onChangeText={(text) => handleInputChange("dateOfBirth", text)}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Giới tính</Text>
        <View style={styles.inputBorder}>
          <TextInput
            placeholder={formData.gender ? "Nữ" : "Nam"}
            value={formData.gender ? "Nam" : "Nữ"}
            onChangeText={(text) => handleInputChange("gender", text === "Nam")}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default Profile;
