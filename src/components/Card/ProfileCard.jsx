import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../../assets/theme";
import { useNavigation } from "@react-navigation/native";

const ProfileCard = ({ name, phoneNumber, imageSource, onPress }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: themeColors.linear,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#999",
  },
});

export default ProfileCard;
