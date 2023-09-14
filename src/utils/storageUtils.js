import EncryptedStorage from "react-native-encrypted-storage";
import { filterKeys } from "../screens/Home/FilterBookingModal";

export const setData = async (key, value) => {
  try {
    // if (key == filterKeys.isStartStation) {
    //   console.log("Set Filter: ", value);
    // }
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw error;
  }
};

export const getData = async (key) => {
  try {
    const value = await EncryptedStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    throw error;
  }
};

export const setString = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {
    throw error;
  }
};

export const getString = async (key) => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeItem = async (key) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    throw error;
  }
};

// export const getUserData = async () => {
//   try {
//     const user = await getData("user");
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

// export const setUserData = async (user) => {
//   try {
//     setData("user", user);
//   } catch (error) {
//     throw error;
//   }
// };
