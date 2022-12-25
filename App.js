import React from "react";
import { StatusBar } from "react-native";
import * as Fonts from "expo-font";

import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import LevelScreen from "./components/LevelScreen";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

async function loadFonts(setter) {
  let fonts = { Monoton: require("./assets/fonts/Monoton-Regular.ttf") };
  await Fonts.loadAsync(fonts);
  setter(true);
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  React.useEffect(() => {
    StatusBar.setHidden(true);
    loadFonts(setFontsLoaded);
  }, []);
  if (!fontsLoaded) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="Game" component={GameScreen}></Stack.Screen>
        <Stack.Screen name="Level" component={LevelScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
