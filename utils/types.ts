export interface UserInformation {
  Name: string;
  EmailAddress: string;
  UserType: "Customer" | "Establishment";
  Location: string;
}

export interface FoodItem {
  itemId: string;
  establishmentId: string;
  establishmentName: string;
  location: string;
  foodName: string;
  timeOfPost: number;
  stillAvailable: boolean;
  dietaryRestriction: string;
  pictureURL: string;
}
