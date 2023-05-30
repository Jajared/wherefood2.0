import { StyleSheet, SafeAreaView, View, StatusBar, TextInput, ScrollView } from "react-native";
import FoodItem from "../components/FoodItem/FoodItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";
import { useState } from "react";
import DietaryButton from "../components/Buttons/DietaryButton";

export default function HomeScreenCustomer({ navigation, allFoodItems, userName, refreshData, userType, foodItemAction }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoodItems, setFilteredFoodItems] = useState(allFoodItems);
  const [search, setSearch] = useState(false);

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    setSearch(true);
    const filteredItems = allFoodItems.filter((data) => {
      return data.foodName.toLowerCase().includes(query.toLowerCase()) || data.location.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredFoodItems(filteredItems);
  };

  const handleHalal = () => {
    const filteredItems = allFoodItems.filter((data) => {
      return data.dietaryRestriction === "Halal";
    });
    setSearch(true);
    setFilteredFoodItems(filteredItems);
  };
  const handleVegetarian = () => {
    const filteredItems = allFoodItems.filter((data) => {
      return data.dietaryRestriction === "Vegetarian";
    });
    setSearch(true);
    setFilteredFoodItems(filteredItems);
  };
  const handleVegan = () => {
    const filteredItems = allFoodItems.filter((data) => {
      return data.dietaryRestriction === "Vegan";
    });
    setSearch(true);
    setFilteredFoodItems(filteredItems);
  };
  const handleNoRestrictions = () => {
    const filteredItems = allFoodItems.filter((data) => {
      return data.dietaryRestriction === "NIL";
    });
    setSearch(true);
    setFilteredFoodItems(filteredItems);
  };

  return search ? (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} userName={userName} userType={userType} pressAction={refreshData()} />
      </View>
      <TextInput style={styles.searchBar} placeholder="Search for food by location or name..." value={searchQuery} onChangeText={handleSearchQueryChange} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1, flexDirection: "row" }}>
        <DietaryButton title="HALAL" onPress={handleHalal} />
        <DietaryButton title="VEGETARIAN" onPress={handleVegetarian} />
        <DietaryButton title="VEGAN" onPress={handleVegan} />
        <DietaryButton title="NO RESTRICTIONS" onPress={handleNoRestrictions} />
      </ScrollView>
      <View style={styles.medicationSection}>{filteredFoodItems && <FlatList data={filteredFoodItems.filter((data) => data.stillAvailable === true)} renderItem={(data) => <FoodItem title={data.Name} props={data} navigation={navigation} userType={userType} foodItemAction={foodItemAction} />} keyExtractor={(item) => item.itemId} />}</View>
      <View style={styles.bottomNavBar}>
        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} userName={userName} userType={userType} pressAction={refreshData()} />
      </View>
      <TextInput style={styles.searchBar} placeholder="Search for food by location or name..." value={searchQuery} onChangeText={handleSearchQueryChange} />
      <View style={{ flexDirection: "row" }}>
        <DietaryButton title="HALAL" onPress={handleHalal} />
        <DietaryButton title="VEGETARIAN" onPress={handleVegetarian} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <DietaryButton title="VEGAN" onPress={handleVegan} />
        <DietaryButton title="NO RESTRICTIONS" onPress={handleNoRestrictions} />
      </View>
      <View style={styles.medicationSection}>{allFoodItems && <FlatList data={allFoodItems.filter((data) => data.stillAvailable === true)} renderItem={(data) => <FoodItem title={data.Name} props={data} navigation={navigation} userType={userType} foodItemAction={foodItemAction} />} keyExtractor={(item) => item.itemId} />}</View>
      <View style={styles.bottomNavBar}>
        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
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
  topNavBar: {
    flex: 2,
  },
  bottomNavBar: {
    flex: 1,
  },
  medicationSection: {
    flex: 7,
    width: "100%",
  },
  searchBar: {
    height: 40,
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
