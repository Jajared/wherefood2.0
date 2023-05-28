import { FoodItem } from "../utils/types";

interface FirestoreData {
  FoodItems: FoodItem[];
}

export const foodDataConverter = {
  toFirestore(data: FirestoreData) {
    return { FoodItems: data.FoodItems };
  },
  fromFirestore(snapshot): FirestoreData {
    const data = snapshot.data();
    return {
      FoodItems: data.FoodItems,
    };
  },
};
