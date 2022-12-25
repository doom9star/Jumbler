import { StyleSheet } from "react-native";
export const pColor = "rgb(150,150,150)";
export const sColor = "rgb(200,100,0)";
export const bColor = "rgb(40,40,40)";
export const styles = StyleSheet.create({
  flex: { alignItems: "center", justifyContent: "center" },
  button: {
    borderWidth: 0.2,
    borderColor: pColor,
    flexDirection: "row",
  },
  full: {
    width: "100%",
    height: "100%",
  },
});
export const serverURI = "http://192.168.1.2:5000";
