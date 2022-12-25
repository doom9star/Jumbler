import React from "react";
import { View, Text, BackHandler } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { bColor, sColor, styles } from "../globals";
import Button from "./Button";
import Logo from "./Logo";

function HomeScreen({ navigation }) {
  return (
    <View style={[{ flex: 1, backgroundColor: bColor }, styles.flex]}>
      <View
        style={[
          {
            position: "absolute",
          },
          styles.flex,
          styles.full,
        ]}
      >
        <Logo size={50} />
        <Text
          style={{
            color: sColor,
            fontFamily: "Monoton",
            fontSize: 50,
          }}
        >
          JUMBLER
        </Text>
        <Button
          title="PLAY"
          handler={() => navigation.navigate("Level")}
          pStyles={{
            width: "50%",
            height: "8%",
            marginTop: 20,
          }}
        >
          <Ionicons
            name="logo-playstation"
            size={24}
            color={sColor}
            style={{ marginRight: 10 }}
          />
        </Button>
        <Button
          title="EXIT"
          handler={() => BackHandler.exitApp()}
          pStyles={{
            width: "50%",
            height: "8%",
            marginTop: 5,
          }}
        >
          <MaterialCommunityIcons
            name="exit-run"
            size={24}
            color={sColor}
            style={{ marginRight: 5 }}
          />
        </Button>
      </View>
    </View>
  );
}

export default HomeScreen;
