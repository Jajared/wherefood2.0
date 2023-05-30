import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DietaryButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient colors={["black", "black"]} style={styles.gradient} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
      flex: 2,
      justifyContent: "center",
      paddingHorizontal: 10,
      paddingTop: 10
    },
    gradient: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    buttonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
      textTransform: "uppercase",
    },
  });

export default DietaryButton;
