import apiManager from "../utils/apiManager";

export const getSettings = async () => {
  const response = await apiManager.get(`api/Setting/`);

  return response.data;
};

export const settingKeys = {
  DriverWagePercent: "DriverWagePercent",
};
