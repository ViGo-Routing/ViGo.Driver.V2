// import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../../assets/theme/index";

const WelcomeDriverHeader = ({ title, subtitle, onBack }) => {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </Text>
      </TouchableOpacity> */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} bold>
          {title}
        </Text>
        {/* <Text style={styles.subtitle} numberOfLines={null}>
          {subtitle}
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 120,
    backgroundColor: themeColors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  titleContainer: {
    paddingRight: 20,
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "white",
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 14,
    paddingTop: 10,
    color: themeColors.linear,
  },
});

export default WelcomeDriverHeader;
