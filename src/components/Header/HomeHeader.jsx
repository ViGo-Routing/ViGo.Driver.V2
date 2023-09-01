import React from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { themeColors } from "../../../assets/theme";
import { useNavigation } from "@react-navigation/native";

const HomeHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchbar}
        placeholder=" 🔍 Tìm dịch vụ, món ngon, địa điểm"
      />
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Image
          source={{
            uri: "https://avatars.githubusercontent.com/u/66261053?v=4",
          }}
          style={styles.profile}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    paddingRight: 16,
    paddingTop: 20,
    height: 100,
    backgroundColor: themeColors.primary,
    // borderBottomLeftRadius:16,
    // borderBottomRightRadius:16,
  },
  searchbar: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: themeColors.linear,
  },
});

export default HomeHeader;
