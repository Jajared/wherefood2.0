import { UserInformation } from "../utils/types";

export const userDataConverter = {
  toFirestore(userInformation: UserInformation) {
    return { ...userInformation };
  },
  fromFirestore(snapshot): UserInformation {
    const data = snapshot.data();
    return {
      Name: data.Name,
      EmailAddress: data.EmailAddress,
      UserType: data.UserType,
    };
  },
};
