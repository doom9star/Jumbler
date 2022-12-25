import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sColor } from "../globals";

function Logo(props) {
  return (
    <MaterialCommunityIcons
      name="math-compass"
      size={props.size ? props.size : 24}
      style={{ color: sColor }}
    />
  );
}

export default Logo;
