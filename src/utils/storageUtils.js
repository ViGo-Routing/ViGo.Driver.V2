import EncryptedStorage from "react-native-encrypted-storage";

export const setData = async (key, value) => {
  try {
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
