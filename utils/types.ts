export interface UserInformation {
  Name: string;
  EmailAddress: string;
  UserType: "Customer" | "Establishment";
}

export interface FoodItem {
  establishmentId: string;
  establishmentName: string;
  location: string;
  foodName: string[];
  timeOfPost: string;
  stillAvailable: boolean;
  dietaryRestriction: string;
}
