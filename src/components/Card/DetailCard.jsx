import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetailCard = ({ title, info }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>{info}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  title: {
    fontWeight: "bold",
  },
  info: {
    textAlign: "right",
  },
});

export default DetailCard;
