import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import React from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  bColor,
  pColor,
  sColor,
  serverURI,
  styles as gStyles,
} from "../globals";
import Button from "./Button";
import Loader from "./Loader";
import Logo from "./Logo";
import Timer from "./Timer";

class GameScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPauseScreen: false,
      levelResult: { over: false, completed: false },
      input: "",
      inputIsRight: false,
      inputIsWrong: false,
      words: [],
      quote: null,
      resetTimer: false,
      levelDetails: {
        word: undefined,
        cWords: undefined,
        sWord: undefined,
        lives: 3,
      },
      contentLoaded: false,
    };
    this.local = {
      quotes: [
        "Life' a game, all you have to do is know how to play it!",
        "Failure doesn't mean game over, it means try again with experience.",
        "Play to win, but enjoy the fun.",
        "Play every game as if its your last one.",
      ],
    };
  }

  shuffleWord(word) {
    word = word.split("");
    return word
      .filter((c, i) => word.indexOf(c) === i)
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  resetGame = () => {
    this.setState((prevState) => ({
      ...prevState,
      levelDetails: {
        word: prevState.words[0],
        cWords: 0,
        sWord: this.shuffleWord(prevState.words[0]),
        lives: 3,
      },
    }));
  };

  nextWordOrOver() {
    let cWords = this.state.levelDetails.cWords + 1;
    if (cWords !== this.state.words.length) {
      let word = this.state.words[cWords];
      this.setState((prevState) => ({
        ...prevState,
        levelDetails: {
          ...prevState.levelDetails,
          cWords,
          word,
          sWord: this.shuffleWord(word),
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        levelResult: { over: true, completed: true },
        levelDetails: { ...prevState.levelDetails, cWords },
      }));
    }
  }

  evalInput(uInput) {
    if (this.state.input.length + 1 === this.state.levelDetails.word.length) {
      let finalInput = this.state.input + uInput;
      if (finalInput === this.state.levelDetails.word) {
        setTimeout(() => {
          this.nextWordOrOver();
          this.setState((prevState) => ({
            ...prevState,
            inputIsRight: false,
            input: "",
            resetTimer: false,
          }));
        }, 1000);
        this.setState((prevState) => ({
          ...prevState,
          inputIsRight: true,
          input: finalInput,
          resetTimer: true,
        }));
      } else {
        setTimeout(() => {
          if (this.state.levelDetails.lives - 1 <= 0) {
            this.setState((prevState) => ({
              ...prevState,
              levelResult: { over: true, completed: false },
              levelDetails: {
                ...prevState.levelDetails,
                lives: prevState.levelDetails.lives - 1,
              },
            }));
          } else {
            this.setState((prevState) => ({
              ...prevState,
              inputIsWrong: false,
              input: "",
              levelDetails: {
                ...prevState.levelDetails,
                lives: prevState.levelDetails.lives - 1,
              },
            }));
          }
        }, 500);
        this.setState((prevState) => ({
          ...prevState,
          inputIsWrong: true,
          input: prevState.input + uInput,
        }));
      }
    } else
      this.setState((prevState) => ({
        ...prevState,
        input: prevState.input + uInput,
      }));
  }

  fillWords = async () => {
    const { level } = this.props.route.params;
    if (!this.state.contentLoaded) {
      try {
        const response = await fetch(
          `${serverURI}/?count=${level * 4}&size=${level + 2}`,
          {
            method: "GET",
          }
        );
        const words = await response.json();
        this.setState((prevState) => ({
          ...prevState,
          words,
          contentLoaded: true,
          quote:
            this.local.quotes[
              Math.floor(Math.random() * this.local.quotes.length)
            ],
          levelDetails: {
            ...prevState.levelDetails,
            word: words[0],
            cWords: 0,
            sWord: this.shuffleWord(words[0]),
          },
        }));
      } catch (err) {
        console.log("here");
        console.log(err);
      }
    }
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("Home");
      return true;
    });
    this.fillWords();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => true);
  }

  render() {
    const { level, latest } = this.props.route.params;
    if (!this.state.contentLoaded) return <Loader />;
    return (
      <View style={[{ flex: 1 }]}>
        <View
          style={{
            height: "10%",
            width: "100%",
            backgroundColor: bColor,
            flexDirection: "row",
          }}
        >
          <View style={[gStyles.flex, { width: "100%", height: "100%" }]}>
            <Text
              style={{ color: sColor, fontSize: 20, fontFamily: "Monoton" }}
            >
              LEVEL - {level}
            </Text>
          </View>
          <TouchableOpacity
            style={{ position: "absolute", right: 10, marginVertical: 15 }}
            activeOpacity={0.7}
            onPress={() =>
              this.setState((prevState) => ({
                ...prevState,
                showPauseScreen: true,
              }))
            }
          >
            <FontAwesome5 name="pause-circle" size={35} color={sColor} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              height: "80%",
              width: "100%",
              backgroundColor: "rgb(30,30,30)",
            },
            gStyles.flex,
          ]}
        >
          <View
            style={[
              gStyles.flex,
              {
                width: "100%",
                height: "40%",
                flexDirection: "column",
              },
            ]}
          >
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                height: "40%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "35%",
                  justifyContent: "center",
                }}
              >
                {Array.from(Array(this.state.levelDetails.lives), (_, i) => (
                  <AntDesign
                    name="heart"
                    size={24}
                    color={sColor}
                    key={i}
                    style={{ marginLeft: 10 }}
                  />
                ))}
              </View>
              {!this.state.levelResult.over && (
                <Timer
                  from={30 * level}
                  dir={-1}
                  to={0}
                  shouldReset={this.state.resetTimer}
                  gameOver={() =>
                    this.setState((prevState) => ({
                      ...prevState,
                      levelResult: { over: true, completed: false },
                    }))
                  }
                />
              )}
              <Text
                style={{
                  color: sColor,
                  fontSize: 12,
                  fontFamily: "monospace",
                  width: "30%",
                  textAlign: "center",
                }}
              >
                <Text style={{ color: pColor }}>Completed:</Text>{" "}
                {this.state.levelDetails.cWords}/{this.state.words.length}
              </Text>
            </View>
            <View
              style={[
                gStyles.flex,
                {
                  width: "100%",
                  height: "60%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 20,
                },
              ]}
            >
              {this.state.levelDetails.word.split("").map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    {
                      width: "10%",
                      height: 40,
                      marginRight: 10,
                      marginTop: 10,
                      borderColor:
                        !this.state.inputIsRight && !this.state.inputIsWrong
                          ? "rgb(150,150,150)"
                          : this.state.inputIsRight
                          ? "rgb(0,200,0)"
                          : "rgb(200,0,0)",
                      borderWidth: 1,
                    },
                    gStyles.flex,
                  ]}
                >
                  <Text style={{ color: pColor }}>
                    {this.state.input[idx] ? this.state.input[idx] : null}
                  </Text>
                </View>
              ))}
            </View>
            {this.state.inputIsRight && (
              <AntDesign
                name="checkcircle"
                size={40}
                color="rgb(0,200,0)"
                style={styles.rIcon}
              />
            )}
            {this.state.inputIsWrong && (
              <Entypo
                name="circle-with-cross"
                size={40}
                color="rgb(200, 0, 0)"
                style={styles.rIcon}
              />
            )}
          </View>
          <View style={{ width: "100%", height: "60%" }}>
            <View
              style={[
                {
                  width: "100%",
                  height: "50%",
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  paddingTop: 70,
                  paddingHorizontal: 2,
                },
              ]}
            >
              {this.state.levelDetails.sWord.split("").map((val, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    {
                      width: 50,
                      height: "50%",
                      marginRight: 10,
                      marginTop: 10,
                      borderColor: pColor,
                      borderRadius: 20,
                      borderWidth: 1,
                    },
                    gStyles.flex,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => this.evalInput(val)}
                >
                  <Text style={{ color: pColor }}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                width: "100%",
                height: "50%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                title="Clear"
                handler={() =>
                  this.setState((prevState) => ({
                    ...prevState,
                    input: prevState.input.substr(
                      0,
                      prevState.input.length - 1
                    ),
                  }))
                }
                pStyles={{
                  width: "40%",
                  height: "30%",
                  marginTop: 20,
                  marginRight: 10,
                }}
              >
                <Entypo
                  name="circle-with-cross"
                  size={30}
                  color={sColor}
                  style={{ marginRight: 20 }}
                />
              </Button>
              <Button
                title="Clear All"
                handler={() =>
                  this.setState((prevState) => ({ ...prevState, input: "" }))
                }
                pStyles={{
                  width: "40%",
                  height: "30%",
                  marginTop: 20,
                }}
              >
                <MaterialIcons
                  name="clear-all"
                  size={30}
                  color={sColor}
                  style={{ marginRight: 10 }}
                />
              </Button>
            </View>
          </View>
        </View>
        <View
          style={[
            {
              height: "10%",
              width: "100%",
              backgroundColor: "rgb(40,40,40)",
              flexDirection: "row",
            },
            gStyles.flex,
          ]}
        >
          <View style={{ width: "15%", alignItems: "flex-end" }}>
            <Entypo name="bell" size={24} color={sColor} />
          </View>
          <View style={{ width: "85%", paddingRight: 10 }}>
            <Text
              style={{
                color: pColor,
                fontSize: 11,
                fontFamily: "serif",
                textAlign: "center",
              }}
            >
              {this.state.quote}
            </Text>
          </View>
        </View>
        {this.state.showPauseScreen && (
          <>
            <View style={styles.overlay} />
            <PauseScreen
              resumeGameScreen={() =>
                this.setState((prevState) => ({
                  ...prevState,
                  showPauseScreen: false,
                }))
              }
              navigation={this.props.navigation}
              reset={this.resetGame}
            />
          </>
        )}
        {this.state.levelResult.over && (
          <>
            <View style={styles.overlay} />
            <EndScreen
              level={level}
              latest={latest}
              navigation={this.props.navigation}
              levelCompleted={this.state.levelResult.completed}
            />
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rIcon: {
    position: "absolute",
    top: "100%",
    left: "45%",
  },
  overlay: {
    ...gStyles.full,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});

function PauseScreen(props) {
  return (
    <View
      style={[
        {
          position: "absolute",
          width: "80%",
          height: "50%",
          marginHorizontal: "10%",
          marginVertical: "40%",
          backgroundColor: "rgb(40,40,40)",
          borderWidth: 1,
          borderColor: "rgb(100, 100, 100)",
        },
        gStyles.flex,
      ]}
    >
      <Logo />
      <Text style={{ color: sColor, fontSize: 20, fontFamily: "Monoton" }}>
        Paused
      </Text>
      <Button
        title="Continue"
        handler={props.resumeGameScreen}
        pStyles={{
          width: "50%",
          height: "15%",
          marginTop: 20,
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={sColor}
          style={{ marginRight: 5 }}
        />
      </Button>
      <Button
        title="Restart"
        handler={function () {
          props.reset();
          props.resumeGameScreen();
        }}
        pStyles={{
          width: "50%",
          height: "15%",
          marginTop: 20,
        }}
      >
        <MaterialCommunityIcons
          name="gamepad-up"
          size={20}
          color={sColor}
          style={{ marginRight: 5 }}
        />
      </Button>
      <Button
        title="Exit"
        handler={() => props.navigation.navigate("Home")}
        pStyles={{
          width: "50%",
          height: "15%",
          marginTop: 20,
        }}
      >
        <MaterialCommunityIcons
          name="exit-run"
          size={20}
          color={sColor}
          style={{ marginRight: 5 }}
        />
      </Button>
    </View>
  );
}

function EndScreen(props) {
  const saveLevel = async () => {
    const fileURI = FileSystem.documentDirectory + "jumbler.txt";
    await FileSystem.writeAsStringAsync(fileURI, `level=${props.level + 1}`, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  };
  React.useEffect(() => {
    if (props.levelCompleted && props.latest === props.level) saveLevel();
  }, []);
  return (
    <View
      style={[
        {
          position: "absolute",
          width: "80%",
          height: "40%",
          marginHorizontal: "10%",
          marginVertical: "50%",
          backgroundColor: "rgb(40,40,40)",
          borderWidth: 1,
          borderColor: "rgb(100, 100, 100)",
        },
        gStyles.flex,
      ]}
    >
      <Logo />
      <Text
        style={{
          color: !props.levelCompleted ? "rgb(180, 0, 0)" : "rgb(0, 180, 0)",
          fontSize: 17,
          marginTop: 5,
          fontFamily: "Monoton",
        }}
      >
        Level
        {"      "}
        {props.levelCompleted ? "Completed" : "Failed"}!
      </Text>
      {props.levelCompleted ? (
        <Button
          title="Next Level"
          handler={() =>
            props.navigation.push("Game", { level: props.level + 1 })
          }
          pStyles={{
            width: "50%",
            height: "20%",
            marginTop: 20,
          }}
        >
          <MaterialIcons
            name="navigate-next"
            size={30}
            color={sColor}
            style={{ marginRight: 5 }}
          />
        </Button>
      ) : (
        <Button
          title="Try Again"
          handler={() => props.navigation.push("Game", { level: props.level })}
          pStyles={{
            width: "50%",
            height: "20%",
            marginTop: 20,
          }}
        >
          <FontAwesome
            name="repeat"
            size={24}
            color={sColor}
            style={{ marginRight: 10 }}
          />
        </Button>
      )}
      <Button
        title="Main Menu"
        handler={() => props.navigation.navigate("Home")}
        pStyles={{
          width: "50%",
          height: "20%",
          marginTop: 20,
        }}
      >
        <Entypo
          name="home"
          size={20}
          color={sColor}
          style={{ marginRight: 10 }}
        />
      </Button>
    </View>
  );
}

export default GameScreen;
