import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import { bColor, sColor, styles, pColor } from "../globals";
import Button from "./Button";

export default function LevelScreen(props) {
  const [currentLevel, setCurrentLevel] = React.useState(1);

  const loadLevel = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const fileURI = FileSystem.documentDirectory + "jumbler.txt";
      const fileInfo = await FileSystem.getInfoAsync(fileURI);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(fileURI, "level=1", {
          encoding: FileSystem.EncodingType.UTF8,
        });
      } else {
        const content = await FileSystem.readAsStringAsync(fileInfo.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        setCurrentLevel(parseInt(content.split("=")[1]));
      }
    }
  };

  React.useEffect(() => {
    loadLevel();
  }, []);

  return (
    <View style={[{ flex: 1, backgroundColor: bColor }, styles.flex]}>
      <View style={[{ height: "10%" }, styles.flex]}>
        <Text
          style={{
            color: sColor,
            fontFamily: "Monoton",
            fontSize: 20,
          }}
        >
          JUMBLER
        </Text>
      </View>
      <View
        style={[
          {
            height: "70%",
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            paddingVertical: 20,
          },
          styles.flex,
        ]}
      >
        {Array.from(Array(11), (_, i) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={i + 1}
            onPress={() =>
              props.navigation.navigate("Game", {
                level: i + 1,
                latest: currentLevel,
              })
            }
            style={[
              {
                width: 150,
                backgroundColor: "rgb(30, 30, 30)",
                height: 60,
                marginRight: 5,
                marginTop: 5,
                opacity: i + 1 > currentLevel && 0.5,
                flexDirection: "row",
              },
              styles.flex,
            ]}
            disabled={i + 1 > currentLevel}
          >
            <>
              {i + 1 === currentLevel ? (
                <Text style={{ color: sColor, fontFamily: "Monoton" }}>
                  PLAY
                </Text>
              ) : i + 1 < currentLevel ? (
                <Ionicons
                  name="checkmark-done-sharp"
                  size={24}
                  style={{ color: sColor }}
                />
              ) : (
                <Entypo name="lock" size={24} style={{ color: pColor }} />
              )}
              {currentLevel !== i + 1 && (
                <Text
                  style={{
                    color: pColor,
                    fontFamily: "Monoton",
                    paddingLeft: 10,
                  }}
                >
                  {i + 1}
                </Text>
              )}
            </>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.flex, { height: "20%", width: "100%" }]}>
        <Button
          title="Back"
          handler={() => props.navigation.navigate("Home")}
          pStyles={{
            width: "50%",
            height: "40%",
          }}
        >
          <AntDesign
            name="leftcircle"
            size={20}
            color={sColor}
            style={{ marginRight: 5 }}
          />
        </Button>
      </View>
    </View>
  );
}
