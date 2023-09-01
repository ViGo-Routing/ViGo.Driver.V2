import apiManager from "../utils/apiManager";

export const createRoute = async (requestData) => {
  try {
    console.log("requestData", requestData);
    const response = await apiManager.post("/api/Route", requestData);
    return response;
  } catch (error) {
    console.error("Create Route failed:", error);
    return null;
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await apiManager.get(`/api/Route/${id}`);
    return response;
  } catch (error) {
    console.error("Get Route By Id failed:", error);
  }
};

export const getRouteByUserId = async () => {
  try {
    const response = await apiManager.get(`/api/Route/CurrentUser`);
    return response;
  } catch (error) {
    console.error("Get Route By User Id failed:", error);
  }
};
