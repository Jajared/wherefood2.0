import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button, StatusBar } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import CustomButton from "../components/Buttons/CustomButton";
import uuid from "react-native-uuid";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddFoodDetails({ navigation, route, addFoodItem, userlocation }) {
  const [state, setState] = useState({ itemId: uuid.v4(), establishmentId: "1", establishmentName: "Mcdonalds", location: userlocation, foodName: "", timeOfPost: 540, stillAvailable: true, dietaryRestriction: "" });
  const [date, setDate] = useState(new Date(2023, 1, 1, 9, 0, 0));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setBestByTiming(currentDate);
  };
  function setBestByTiming(date) {
    setState((prevState) => ({ ...prevState, timeOfPost: convertTimeStringtoInteger(date) }));
  }
  function convertTimeStringtoInteger(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var time = hours * 60 + minutes;
    return time;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Add Food Details" />
      <View style={styles.purposeSection}>
        <Text style={styles.textHeader}>Food available:</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, foodName: text })} value={state.foodName} placeholder="Food available" />
      </View>
      <View style={styles.purposeSection}>
        <Text style={styles.textHeader}>Dietary Restrictions:</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, dietaryRestriction: text })} value={state.dietaryRestriction} placeholder="Dietary Restrictrions" />
      </View>
      <View style={styles.dosageSection}>
        <Text style={styles.textHeader}>Best by:</Text>
        <DateTimePicker testID="dateTimePicker" display="spinner" value={date} mode="time" onChange={onChange} />
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
