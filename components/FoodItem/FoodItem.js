import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function FoodItem({ props, navigation, userType }) {
  const foodData = props.item;
  const placeholder = userType === "Establishment" ? "Mark as unavailable" : "Favourite";
  const rightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity onPress={() => alert("Slide")}>
        <View style={styles.rightAction}>
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>{placeholder}</Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  function getTime() {
    const time = medicationData.Instructions.FirstDosageTiming;
    const date = new Date();
    date.setHours(Math.floor(time / 60), time % 60);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return (
    <SafeAreaView style={styles.container}>
      {userType === "Establishment" ? (
        <Swipeable renderRightActions={rightActions}>
          <View style={styles.itemContainer}>
            <View style={styles.keyInfoContainer}>
              <Text style={styles.locationText}>{foodData.location}</Text>
              <Text style={styles.timeText}>Best by: {foodData.timeOfPost}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.availableText}>Food available: {foodData.foodName}</Text>
              <Text style={styles.restrictionText}>Dietary Restriction: {foodData.dietaryRestrictions}</Text>
            </View>
          </View>
        </Swipeable>
      ) : (
        <Swipeable renderRightActions={rightActions}>
          <View style={styles.itemContainer}>
            <View style={styles.keyInfoContainer}>
              <Text style={styles.locationText}>{foodData.location}</Text>
              <Text style={styles.timeText}>Best by: {foodData.timeOfPost}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.availableText}>Food available: {foodData.foodName}</Text>
              <Text style={styles.restrictionText}>Dietary Restriction: {foodData.dietaryRestrictions}</Text>
            </View>
          </View>
        </Swipeable>
      )}
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
  icon: {
    flex: 1,
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    marginLeft: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: "90%",
    padding: 5,
  },
  locationText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
  },
  timeText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
  },
  keyInfoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  availableText: {
    flex: 1,
    fontSize: 14,
  },
  restrictionText: {
    flex: 1,
    fontSize: 14,
    color: "red",
  },
  textContainer: {
    flex: 3,
    flexDirection: "column",
    alignSelf: "flex-start",
    marginTop: 5,
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
