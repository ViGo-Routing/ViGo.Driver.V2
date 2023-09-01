import { extendTheme } from "native-base";
import { StyleSheet } from "react-native";

export const themeColors = {
  primary: "#00A1A1",
  linear: "#E3F6F5",
};
export const vigoStyles = StyleSheet.create({
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  title: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 20,
    paddingBottom: 15,
  },
  body: {
    backgroundColor: themeColors.linear,
    padding: 20,
    flex: 1,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
  },
  h2: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 10,
  },
  h3: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  list: {
    paddingTop: 20,
    fontSize: 20,
  },
  listItem: {
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  column: {
    flexDirection: "column",
  },

  sectionDivider: {
    marginTop: 20,
    marginBottom: 40,
  },
  listDivider: {
    marginTop: 20,
    marginBottom: 20,
  },

  badgeSuccessContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "green",
    borderRadius: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },

  badgeSuccessText: {
    color: "white",
  },

  badgePendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "orange",
    borderRadius: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },

  badgePendingText: {
    color: "white",
  },

  badgeErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "red",
    borderRadius: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },

  badgeErrorText: {
    color: "white",
  },

  buttonPrimary: {
    backgroundColor: themeColors.primary,
    // marginTop: 10,
    borderRadius: 10,
    // marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonPrimaryText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  buttonWhite: {
    backgroundColor: "white",
    // marginTop: 10,
    borderRadius: 10,
    // marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonWhiteText: {
    textAlign: "center",
    color: themeColors.primary,
    fontWeight: "bold",
  },

  modalContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    marginTop: "auto",
    height: "50%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  link: {
    // textAlign:'center',
    color: themeColors.primary,
    fontSize: 16,
    // textDecorationLine: 'underline',
  },
});
