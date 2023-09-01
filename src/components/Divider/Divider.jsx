import { StyleSheet, View } from "react-native";

export default Divider = ({ style }) => {
  return <View style={{ ...styles.divider, ...style }} />;
};

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: "#999",
    borderBottomWidth: StyleSheet.hairlineWidth,
    // marginTop: 20,
    // marginBottom: 40,
  },
});
