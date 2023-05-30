import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Button, StatusBar, Image, Keyboard, TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import Modal from "react-native-modal";
import { doc, collection, setDoc } from "firebase/firestore";
import { firestorage, storage } from "../firebaseConfig";
import DropDownPicker from "react-native-dropdown-picker";
import CalendarPicker from "react-native-calendar-picker";
import { UserInformation } from "../utils/types";

/**https://firebasestorage.googleapis.com/v0/b/medalert-386812.appspot.com/o/profilePictures%2FcLNeJdkRJkfEzLMugJipcamAWwb2?alt=media&token=e2ea4d15-ec26-410e-b584-3aac020bfe15 */

export default function SignUpDetailsPage({ navigation, route, setIsSignUpComplete }) {
  const userId = route.params.userId;
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    Name: "",
    EmailAddress: route.params.EmailAddress,
    UserType: "",
    Location: "",
  });

  function handleSubmit() {
    if (personalDetails.Name.trim() == "") {
      alert("Please enter a Name");
      return false;
    } else if (personalDetails.UserType.trim() == "") {
      alert("Please choose a specific User Tyoe");
      return false;
    } else if (personalDetails.Location.trim() == "") {
      alert("Please enter the location");
      return false;
    } else {
      return true;
    }
  }

  const handleFormSubmit = async () => {
    const userInfoRef = doc(collection(firestorage, "UsersData"), userId);
    // Update user information in Firestore
    await setDoc(userInfoRef, { ...personalDetails })
      .then((docRef) => {
        console.log("Data pushed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    if (personalDetails.UserType === "Establishment") {
      const foodInfoRef = doc(collection(firestorage, "AllFoodItems"), userId);
      setDoc(foodInfoRef, { FoodItems: [] })
        .then((docRef) => {
          console.log("Data pushed successfully.");
        })
        .catch((error) => {
          console.error("Error pushing data:", error);
        });
    }

    if (handleSubmit() == true) {
      await setIsSignUpComplete(true)
      navigation.navigate("Home");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.header}>More about you!</Text>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput style={styles.inputBox} value={personalDetails.Name} placeholder="Name" onChangeText={(text) => setPersonalDetails({ ...personalDetails, Name: text })}></TextInput>
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Location</Text>
          <TextInput style={styles.inputBox} value={personalDetails.Location} placeholder="Location" onChangeText={(text) => setPersonalDetails({ ...personalDetails, Location: text })}></TextInput>
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>User type</Text>
          <DropDownPicker
            placeholder="Select One"
            open={dropDownOpen}
            setOpen={setDropDownOpen}
            items={[
              { label: "Customer", value: "Customer" },
              { label: "Establishment", value: "Establishment" },
            ]}
            value={personalDetails.UserType}
            onSelectItem={(item) => {
              setPersonalDetails({ ...personalDetails, UserType: item.value });
            }}
            textStyle={{ color: "grey", fontSize: 15 }}
            style={[styles.inputBox, { borderWidth: 0, borderRadius: 0 }]}
            dropDownContainerStyle={{ borderWidth: 0 }}
          />
        </View>

        <View style={styles.emptySection}></View>
        <TouchableOpacity onPress={() => handleFormSubmit()} style={styles.buttonContainer}>
          <LinearGradient colors={["#50C878", "#228B22"]} style={styles.gradient}>
            <Text style={styles.buttonText}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginTop: 30,
  },
  header: {
    fontSize: 18,
    marginLeft: "5%",
    color: "grey",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  inputItem: {
    flex: 2,
    width: "90%",
    flexDirection: "column",
    margin: 15,
  },
  inputTitle: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: "bold",
  },
  inputBox: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    color: "grey",
    fontSize: 15,
    marginVertical: 15,
    padding: 10,
  },
  emptySection: {
    flex: 5,
  },
  buttonContainer: {
    flex: 2,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  calendar: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
