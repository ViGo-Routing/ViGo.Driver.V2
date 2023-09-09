import { memo } from "react";
import { StyleSheet, View } from "react-native";

const Divider = ({ style }) => {
  return <View style={{ ...styles.divider, ...style }} />;
};

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: StyleSheet.hairlineWidth,
    // marginTop: 20,
    // marginBottom: 40,
  },
});

export default memo(Divider);
