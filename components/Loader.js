import React from "react";
import { ActivityIndicator, View } from "react-native";
import { styles, bColor, sColor } from "../globals";

export default function Loader() {
  return (
    <View
      style={[
        {
          position: "absolute",
          zIndex: 2,
          backgroundColor: bColor,
        },
        styles.full,
        styles.flex,
      ]}
    >
      <ActivityIndicator size="large" color={sColor} />
    </View>
  );
}
