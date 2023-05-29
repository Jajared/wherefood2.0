import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import HomeScreenBusiness from "./pages/HomeScreenBusiness";
import HomeScreenCustomer from "./pages/HomeScreenCustomer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddFoodDetails from "./pages/AddFoodDetails";
import MenuPage from "./pages/MenuPage";
import UpdateAccountPage from "./pages/UpdateAccountPage";
import { UserInformation, FoodItem } from "./utils/types";
import { collection, doc, getDoc, updateDoc, getDocs, query, CollectionReference } from "firebase/firestore";
import { firestorage } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import { userDataConverter } from "./converters/userDataConverter";
import { foodDataConverter } from "./converters/medDataConverter";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignUpHomePage from "./pages/SignUpHomePage";
import SignUpDetailsPage from "./pages/SignUpDetailsPage";
import { DocumentReference } from "firebase/firestore";
import { Subscription } from "expo-modules-core";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userInformation, setUserInformation] = useState<UserInformation>();
  const [allFoodItems, setAllFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const userInfoRef = useRef<DocumentReference>();
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  const fetchFoodData = async (foodInfoRef: DocumentReference): Promise<void> => {
    console.log("Fetching food data");
    try {
      setIsLoading(true);
      const foodInfoQuerySnapshot = await getDoc(foodInfoRef.withConverter(foodDataConverter));
      const foodInfoData = foodInfoQuerySnapshot.data();
      setAllFoodItems(foodInfoData.FoodItems);
      console.log("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpComplete = () => {
    getInitialData();
    setIsSignUpComplete(true);
  };

  const fetchAllFoodData = async (foodInfoRef: CollectionReference): Promise<void> => {
    console.log("Fetching all food data");
    try {
      setIsLoading(true);
      const foodInfoQuerySnapshot = await getDocs(query(foodInfoRef));
      const tempFoodItems: FoodItem[] = [];
      foodInfoQuerySnapshot.forEach((doc) => {
        const foodInfoData = doc.data();
        tempFoodItems.push(...foodInfoData.FoodItems);
      });
      setAllFoodItems(tempFoodItems);
      console.log("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialData = async () => {
    try {
      if (userId) {
        setIsLoading(true);
        userInfoRef.current = doc(firestorage, "UsersData", userId);
        const userQuerySnapshot = await getDoc(userInfoRef.current.withConverter(userDataConverter));
        const userInfoData = userQuerySnapshot.data();
        setUserInformation(userInfoData);
        if (userInfoData.UserType === "Establishment") {
          userInfoRef.current = doc(firestorage, "UsersData", userId);
          fetchFoodData(doc(firestorage, "AllFoodItems", userId));
        } else {
          userInfoRef.current = doc(firestorage, "UsersData", userId);
          fetchAllFoodData(collection(firestorage, "AllFoodItems"));
        }
      }
    } catch (error) {
      console.log("Error getting initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up handler
  const handleSignUpHome = (userId: string) => {
    setUserId(userId);
  };

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
      const userRef = doc(firestorage, "UsersData", user.uid);
      userInfoRef.current = userRef;
      const userQuerySnapshot = await getDoc(userRef.withConverter(userDataConverter));
      const userInfoData = userQuerySnapshot.data();
      setUserInformation(userInfoData);
      if (userInfoData.UserType === "Establishment") {
        fetchFoodData(doc(firestorage, "AllFoodItems", user.uid));
      } else {
        fetchAllFoodData(collection(firestorage, "AllFoodItems"));
      }
      setUserLoggedIn(true);

      console.log("Successfully logged in");
      return true;
    } catch (error) {
      console.log("Error logging in:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      signOut(auth).then(() => {
        setUserLoggedIn(false);
        setIsSignUpComplete(false);
        setUserId("");
        setAllFoodItems([]);
        console.log("Successfully signed out");
      });
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  // Update user information on database
  const updateUserInformation = async (updatedUserData: UserInformation) => {
    try {
      setUserInformation(updatedUserData);
      await updateDoc(userInfoRef.current, { ...updatedUserData });
      console.log("User information updated to Firestore successfully");
    } catch (error) {
      console.error("Error adding user information to Firestore:", error);
    }
  };

  // Deletes food item from list and updates database
  const deleteFoodItem = async (itemId: string) => {
    var newAllFoodItems = [...allFoodItems];
    for (var i = 0; i < newAllFoodItems.length; i++) {
      console.log(newAllFoodItems[i]);
      if (newAllFoodItems[i].itemId == itemId) {
        newAllFoodItems.splice(i, 1);
      }
    }
    await updateDoc(doc(firestorage, "AllFoodItems", userId), { FoodItems: newAllFoodItems })
      .then((docRef) => {
        console.log("Data changed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    fetchFoodData(doc(firestorage, "AllFoodItems", userId));
  };

  // Add food item
  const addFoodItem = async (foodItem: FoodItem) => {
    try {
      const newFoodItems = [...allFoodItems, foodItem];
      setAllFoodItems(newFoodItems);
      // Update firebase
      await updateDoc(doc(firestorage, "AllFoodItems", userId), {
        FoodItems: newFoodItems,
      });
      console.log("Food added successfully.");
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };

  const favouriteFoodItem = async (itemId: string) => {
    alert("You have added this to your favourites");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (!isUserLoggedIn && !isSignUpComplete) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginPage {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="Reset Password" options={{ headerShown: false }}>
            {(props) => <ResetPasswordPage {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
            {(props) => <SignUpHomePage {...props} onSignUpHome={handleSignUpHome} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
            {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={handleSignUpComplete} />}
          </Stack.Screen>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <HomeScreenCustomer {...props} allFoodItems={allFoodItems} userName={userInformation.Name} refreshData={() => {}} userType={"Customer"} foodItemAction={favouriteFoodItem} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    if (userInformation.UserType == "Establishment") {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <HomeScreenBusiness {...props} allFoodItems={allFoodItems} userName={userInformation.Name} userType={userInformation.UserType} foodItemAction={deleteFoodItem} />}
            </Stack.Screen>
            <Stack.Screen name="Add Food Details" options={{ headerShown: false }}>
              {(props) => <AddFoodDetails {...props} addFoodItem={addFoodItem} establishmentName={userInformation.Name} userlocation={userInformation.Location} />}
            </Stack.Screen>
            <Stack.Screen name="Profile Page" options={{ headerShown: false }}>
              {(props) => <MenuPage {...props} userInformation={userInformation} onSignOut={handleSignOut} />}
            </Stack.Screen>
            <Stack.Screen name="Update Account" options={{ headerShown: false }}>
              {(props) => <UpdateAccountPage {...props} userInformation={userInformation} updateUserInformation={updateUserInformation} />}
            </Stack.Screen>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <LoginPage {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
              {(props) => <SignUpHomePage {...props} onSignUpHome={handleSignUpHome} />}
            </Stack.Screen>
            <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
              {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={handleSignUpComplete} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <HomeScreenCustomer {...props} allFoodItems={allFoodItems} userName={userInformation.Name} refreshData={() => fetchAllFoodData} userType={userInformation.UserType} foodItemAction={favouriteFoodItem} />}
            </Stack.Screen>
            <Stack.Screen name="Profile Page" options={{ headerShown: false }}>
              {(props) => <MenuPage {...props} userInformation={userInformation} onSignOut={handleSignOut} />}
            </Stack.Screen>
            <Stack.Screen name="Update Account" options={{ headerShown: false }}>
              {(props) => <UpdateAccountPage {...props} userInformation={userInformation} updateUserInformation={updateUserInformation} />}
            </Stack.Screen>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <LoginPage {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
              {(props) => <SignUpHomePage {...props} onSignUpHome={handleSignUpHome} />}
            </Stack.Screen>
            <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
              {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={handleSignUpComplete} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
