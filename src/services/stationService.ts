import apiManager from "../utils/apiManager";

export const getMetroStations = async () => {
  const response = await apiManager.get(`api/Station/Metro`);

  return response.data;
};
