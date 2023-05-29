import { StyleSheet, SafeAreaView, View, StatusBar } from "react-native";
import FoodItem from "../components/FoodItem/FoodItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

export default function HomeScreenBusiness({ navigation, allFoodItems, userName, userType, foodItemAction }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} userName={userName} userType={userType} pressAction={() => alert("ok")} />
      </View>
      <View style={styles.foodSection}>{allFoodItems && <FlatList data={allFoodItems.filter((data) => data.stillAvailable === true)} renderItem={(data) => <FoodItem title={data.Name} props={data} navigation={navigation} userType={userType} foodItemAction={foodItemAction} />} keyExtractor={(item) => item.itemId} />}</View>
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
  foodSection: {
    flex: 7,
    width: "100%",
  },
});
