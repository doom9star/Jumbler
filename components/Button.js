import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles, pColor } from "../globals";

function Button(props) {
  const { title, children, handler, pStyles } = props;

  return (
    <TouchableOpacity
      style={[pStyles, styles.flex, styles.button]}
      activeOpacity={0.8}
      onPress={() => (handler ? handler() : null)}
    >
      {children}
      <Text style={{ color: pColor, fontFamily: "serif", fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
