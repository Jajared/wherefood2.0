import React, { PureComponent } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import TextTicker from "react-native-text-ticker";

export default function FoodItem({ props, navigation, userType, foodItemAction }) {
  const foodData = props.item;
  const imageURL = foodData.pictureURL;
  const placeholder = userType === "Establishment" ? "Mark as unavailable" : "Favourite";
  const rightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity onPress={() => foodItemAction(foodData.itemId)}>
        <View style={styles.rightAction}>
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>{placeholder}</Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  function getTime() {
    const time = foodData.timeOfPost;
    const date = new Date();
    date.setHours(Math.floor(time / 60), time % 60);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Swipeable renderRightActions={rightActions}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageURL }} style={styles.image} />
          </View>
          <View style={styles.keyInfoContainer}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Entypo name="location-pin" size={20} color="black" style={{ flex: 1 }} />
              <View style={{ flex: 5 }}>
                <TextTicker style={{ fontWeight: "bold", fontSize: 18 }} duration={3000} loop bounceDelay={50} repeatSpacer={50} marqueeDelay={1000}>
                  {foodData.establishmentName}, {foodData.location}
                </TextTicker>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="fast-food" size={20} color="black" style={{ flex: 1 }} />
              <Text style={{ flex: 5, fontSize: 16, flexWrap: "wrap", flexShrink: 1 }}>{foodData.foodName}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="warning" size={20} color="black" style={{ flex: 1 }} />
              <Text style={{ flex: 5, fontSize: 16, color: "red" }}>{foodData.dietaryRestriction}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginLeft: 2 }}>
              <AntDesign name="clockcircleo" size={20} color="black" style={{ flex: 1 }} />
              <Text style={styles.timeText}>Best by: {getTime()}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  timeSection: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
    width: "90%",
    marginBottom: 10,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  icon: {
    flex: 1,
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    marginLeft: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    margin: 15,
    alignItems: "center",
    height: 110,
    width: "90%",
  },
  timeText: {
    flex: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    marginRight: 10,
  },
  keyInfoContainer: {
    flex: 2,
    flexDirection: "column",
  },
  rightAction: {
    backgroundColor: "red",
    justifyContent: "center",
    height: 100,
    margin: 15,
    borderRadius: 15,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    padding: 10,
  },
});
