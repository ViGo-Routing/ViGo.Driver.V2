import apiManager from "../utils/apiManager";

export const getNotifications = async (userId, pageSize, pageNumber) => {
  try {
    const response = await apiManager.get(
      `api/Notification/User/${userId}
      ?pageNumber=${pageNumber}&pageSize=${pageSize}
      &orderBy=createdTime desc`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
