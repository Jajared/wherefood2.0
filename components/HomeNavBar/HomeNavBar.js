import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { firestorage } from "../../firebaseConfig";
const allFoodItemCollection = collection(firestorage, "AllFoodItems");

export default function HomeNavBar({ props, navigation, userName, userType, pressAction }) {
  return (
    <View style={styles.container}>
      {userType == "Establishment" ? (
        <TouchableOpacity onPress={() => navigation.navigate("Add Food Details")} style={styles.addButton}>
          <AntDesign name="plus" size={25} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            console.log("Refreshing");
            pressAction(allFoodItemCollection);
          }}
          style={styles.addButton}
        >
          <Feather name="refresh-cw" size={25} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.userSection}>Hey {userName}!</Text>
      <Text style={styles.daySection}>{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())}</Text>
      <Text style={styles.upcomingRemindersSection}>Food available: </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userSection: {
    flex: 1,
    width: "90%",
    fontSize: 20,
    fontWeight: "300",
  },
  upcomingRemindersSection: {
    flex: 1,
    fontSize: 25,
    fontWeight: "bold",
    width: "90%",
  },
  daySection: {
    fontSize: 30,
    fontWeight: "bold",
    width: "90%",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 30,
    width: "100%",
  },
});
