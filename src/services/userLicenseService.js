import apiManager from "../utils/apiManager";

export const createUserLicense = async (license) => {
  try {
    const response = await apiManager.post("api/UserLicense", license);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getUserLicenses = async (userId) => {
  try {
    const response = await apiManager.get("api/UserLicense/User/" + userId);
    return response.data;
  } catch (err) {
    throw err;
  }
};
