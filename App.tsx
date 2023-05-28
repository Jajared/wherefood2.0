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
  const [userType, setUserType] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const userInfoRef = useRef<DocumentReference>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const [isNotificationReset, setIsNotificationReset] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  const fetchUserData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userQuerySnapshot = await getDoc(userInfoRef.current.withConverter(userDataConverter));
      const userInfoData = userQuerySnapshot.data();
      setUserInformation(userInfoData);
      console.log("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchFoodData = async (foodInfoRef: DocumentReference): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("2");
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

  const fetchAllFoodData = async (foodInfoRef: CollectionReference): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("1");
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

  useEffect(() => {
    if (userId && isSignUpComplete) {
      fetchUserData();
      if (userInformation.UserType === "Establishment") {
        userInfoRef.current = doc(firestorage, "UsersData", userId);
        fetchFoodData(doc(firestorage, "AllFoodItems", userId));
      } else {
        userInfoRef.current = doc(firestorage, "UsersData", userId);
        fetchAllFoodData(collection(firestorage, "AllFoodItems"));
      }
    }
  }, [userId, isSignUpComplete]);

  // Sign up handler
  const handleSignUpHome = (userId: string) => {
    setUserId(userId);
  };

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
      userInfoRef.current = doc(firestorage, "UsersData", user.uid);
      fetchUserData().then(async () => {
        console.log(userInformation);
        if (userInformation.UserType === "Establishment") {
          await fetchFoodData(doc(firestorage, "AllFoodItems", user.uid));
        } else {
          await fetchAllFoodData(collection(firestorage, "AllFoodItems"));
        }
      });
      setUserLoggedIn(true);
      console.log("Successfully logged in");
      return true;
    } catch (error) {
      console.log("Error logging in:", error);
      return false;
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      signOut(auth).then(() => {
        setUserLoggedIn(false);
        setIsSignUpComplete(false);
        setUserId("");
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

  // Deletes medication item from list and updates database
  const deleteMedicationFromList = async (foodItem: FoodItem) => {
    var newAllFoodItems = [...allFoodItems];
    for (var i = 0; i < newAllFoodItems.length; i++) {
      if (newAllFoodItems[i].foodName == foodItem.foodName) {
        newAllFoodItems.splice(i, 1);
      }
    }
    await updateDoc(doc(firestorage, "AllFoodItems", userId), { MedicationItems: newAllFoodItems })
      .then((docRef) => {
        console.log("Data changed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    fetchFoodData(doc(firestorage, "AllFoodItems", userId));
  };

  // Add medication item
  const addMedication = async (foodItem: FoodItem) => {
    try {
      const newFoodItems = [...allFoodItems, foodItem];
      setAllFoodItems(newFoodItems);
      // Update firebase
      await updateDoc(doc(firestorage, "AllFoodItems", userId), {
        FoodItems: newFoodItems,
      });
      console.log("Medication added successfully.");
    } catch (error) {
      console.error("Error adding medication:", error);
    }
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
            {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
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
              {(props) => <HomeScreenBusiness {...props} allFoodItems={allFoodItems} userName={userInformation.Name} />}
            </Stack.Screen>
            <Stack.Screen name="Add Medication Details" options={{ headerShown: false }}>
              {(props) => <AddFoodDetails {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Profile Page" options={{ headerShown: false }}>
              {(props) => <MenuPage {...props} userInformation={userInformation} setIsNotificationReset={setIsNotificationReset} onSignOut={handleSignOut} />}
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
              {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <HomeScreenCustomer {...props} allFoodItems={allFoodItems} userName={userInformation.Name} />}
            </Stack.Screen>
            <Stack.Screen name="Profile Page" options={{ headerShown: false }}>
              {(props) => <MenuPage {...props} userInformation={userInformation} setIsNotificationReset={setIsNotificationReset} onSignOut={handleSignOut} />}
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
              {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
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
