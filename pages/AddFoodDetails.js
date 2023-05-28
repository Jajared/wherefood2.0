import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button, StatusBar } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Entypo } from "@expo/vector-icons";
import CameraComponent from "../components/CameraComponent/CameraComponent";
import CustomButton from "../components/Buttons/CustomButton";
import FoodItem from "../components/FoodItem/FoodItem";

export default function AddFoodDetails({ navigation, route, addFoodItem }) {
  const [state, setState] = useState({ establishmentId: "1", establishmentName: "Mcdonalds", location: "", foodName: ["croissant"], timeOfPost: "1000", stillAvailable: true, dietaryRestriction: "Vegetarian" });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={{ position: "absolute", top: 60, right: 40, zIndex: 1 }} onPress={() => setShowCamera(true)}>
        <Entypo name="camera" size={24} color="black" />
      </TouchableOpacity>
      <BackNavBar navigation={navigation} title="Add Medication" />
      <View style={styles.nameSection}>
        <Text style={styles.textHeader}>Location</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, location: text.trim() })} value={state.location} placeholder="Location" />
      </View>
      <View style={styles.purposeSection}>
        <Text style={styles.textHeader}>Food available:</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state })} value={state.foodName[0]} placeholder="Food available" />
      </View>
      <View style={styles.nextSection}>
        <CustomButton
          title="Next"
          onPress={() => {
            addFoodItem(state);
            navigation.navigate("Home");
          }}
        />
      </View>
      <View style={styles.bottomNavBar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
  },
  nameSection: {
    flex: 1,
    width: "80%",
  },
  bottomNavBar: {
    flex: 1,
  },
  purposeSection: {
    flex: 1,
    width: "80%",
  },
  intakeSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    width: "80%",
  },
  frequencySection: {
    flex: 2,
    width: "80%",
  },
  frequencyItem: {
    marginTop: 5,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  nextSection: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
});
