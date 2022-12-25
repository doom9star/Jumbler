import React from "react";
import { Text, View } from "react-native";
import { bColor, sColor } from "../globals";

export default function Timer(props) {
  const { from, dir, to, shouldReset } = props;
  const [value, setValue] = React.useState(from);
  const valueRef = React.useRef(value);
  const resetRef = React.useRef(shouldReset);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);
  React.useEffect(() => {
    resetRef.current = shouldReset;
  }, [shouldReset]);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (resetRef.current) {
        setValue(from);
      } else {
        if (valueRef.current === to) props.gameOver();
        else setValue((preValue) => preValue + dir);
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: bColor,
        borderRadius: 50,
        padding: 10,
        width: "30%",
      }}
    >
      <Text
        style={{
          color: sColor,
          textAlign: "center",
          fontSize: 15,
          fontFamily: "Monoton",
        }}
      >
        {new Date(value * 1000).toISOString().substr(14, 5)}
      </Text>
    </View>
  );
}
