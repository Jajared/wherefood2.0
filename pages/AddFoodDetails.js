import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button, StatusBar } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CustomButton from "../components/Buttons/CustomButton";
import uuid from "react-native-uuid";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddFoodDetails({ navigation, route, establishmentName, addFoodItem, userlocation }) {
  const [state, setState] = useState({ itemId: uuid.v4(), establishmentId: "1", establishmentName: establishmentName, location: userlocation, foodName: "", timeOfPost: 540, stillAvailable: true, dietaryRestriction: "" });
  const [date, setDate] = useState(new Date(2023, 1, 1, 9, 0, 0));
  const [selectedCheck, setSelectedCheck] = useState([]);
  
const handleCheckSelection = (check) => {
  const dietaryRestrictionOptions = {
    1: 'Halal',
    2: 'Vegetarian',
    3: 'Vegan',
    4: 'NIL',
  };

  let updatedSelection = [...selectedCheck];

  if (updatedSelection.includes(check)) {
    updatedSelection = updatedSelection.filter((option) => option !== check);
  } else {
    updatedSelection.push(check);
  }

  setSelectedCheck(updatedSelection);

  const selectedDietaryRestrictions = updatedSelection.map((option) => dietaryRestrictionOptions[option]);
  const dietaryRestrictionsString = selectedDietaryRestrictions.join(', ');
  setState((prevState) => ({ ...prevState, dietaryRestriction: dietaryRestrictionsString }));

  if (updatedSelection.includes(4) && updatedSelection.length > 1) {
    alert("If 'NIL' is selected, other checkboxes should not be selected. Please uncheck the boxes where necessary.");
  }
}

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
  function handleSubmit() {
    if (state.foodName.trim() === "") {
      alert("Please enter the name of the food available");
      return false;
    }

    if (state.dietaryRestriction.trim() === "") {
      alert("Please type in NIL if there are no specific dietary instructions");
      return false;
    }
    return true;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Add Food Details" />
      <View style={styles.purposeSection}>
        <Text style={styles.textHeader}>Food available:</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, foodName: text })} value={state.foodName} placeholder="Food available" />
      </View>
      <View style={styles.frequencySection}>
        <Text style={styles.textHeader}>Dietary Restrictions (can tick more than one):</Text>
        <View>
          <BouncyCheckbox
            text="Halal"
            textStyle={{
              textDecorationLine: 'none',
            }}
            style={styles.frequencyItem}
            isChecked={selectedCheck.includes(1)}
            onPress={() => handleCheckSelection(1)}
          />
          <BouncyCheckbox
            text="Vegetarian"
            textStyle={{
              textDecorationLine: 'none',
            }}
            style={styles.frequencyItem}
            isChecked={selectedCheck.includes(2)}
            onPress={() => handleCheckSelection(2)}
          />
          <BouncyCheckbox
            text="Vegan"
            textStyle={{
              textDecorationLine: 'none',
            }}
            style={styles.frequencyItem}
            isChecked={selectedCheck.includes(3)}
            onPress={() => handleCheckSelection(3)}
          />
          <BouncyCheckbox
            text="NIL"
            textStyle={{
              textDecorationLine: 'none',
            }}
            style={styles.frequencyItem}
            isChecked={selectedCheck.includes(4)}
            onPress={() => handleCheckSelection(4)}
          />
        </View>
      </View>
      <View style={styles.dosageSection}>
        <Text style={styles.textHeader}>Best by:</Text>
        <DateTimePicker testID="dateTimePicker" display="spinner" value={date} mode="time" onChange={onChange} />
      </View>
      <View style={styles.nextSection}>
        <CustomButton
          title="Next"
          onPress={() => {
            if (handleSubmit() == true) {
              addFoodItem(state);
              navigation.navigate("Home");
            }
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
