import apiManager from "../utils/apiManager";

export const getVehicleTypes = async () => {
  try {
    const response = await apiManager.get("api/VehicleType");
    return response.data.sort((a, b) => a.slot - b.slot);
  } catch (err) {
    throw err;
  }
};

export const getVehicles = async (userId) => {
  try {
    const response = await apiManager.get("api/Vehicles/User/" + userId);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createVehicle = async (vehicle) => {
  try {
    const response = await apiManager.post("api/Vehicles", vehicle);
    return response.data;
  } catch (err) {
    throw err;
  }
};
