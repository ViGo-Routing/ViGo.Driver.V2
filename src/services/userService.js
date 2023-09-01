import { Alert } from "react-native";
import apiManager from "../utils/apiManager";
import { getErrorMessage } from "../utils/alertUtils";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVmOTRkZDg2LTM3YjItNDNhMy05NjJiLTAzNmEzYzAzZDNjOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwianRpIjoiZjVlNjFhOTQtZDE4OC00Y2FmLTgxZmUtMGJkNDRiZThjM2UzIiwiZXhwIjoxNjg4Mzk4NTgzLCJpc3MiOiJodHRwczovL3ZpZ28tYXBpLmF6dXJld2Vic2l0ZXMubmV0LyIsImF1ZCI6Imh0dHBzOi8vdmlnby1hcGkuYXp1cmV3ZWJzaXRlcy5uZXQvIn0.lScZHYYE9SDFkuvhVXDbHW-xSe5YUAci0586xf8aMew";

export const editProfile = async (id, requestData) => {
  console.log("requestData", requestData);
  try {
    const response = await apiManager.put(`/api/User/${id}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return response;
  } catch (error) {
    console.error("Edit profile failed:", error);
  }
};

export const getProfile = async (id) => {
  try {
    const response = await apiManager.get(`/api/User/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json-patch+json",
      },
    });
    // console.log("aaaaaaas", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Profile failed:", getErrorMessage(error));
  }
};

export const updateUserFcmToken = async (userId, fcmToken) => {
  console.log(fcmToken);
  try {
    const response = await apiManager.put(`api/User/UpdateFcm/${userId}`, {
      id: userId,
      fcmToken: fcmToken,
    });
    if (response.status != 200) {
      throw new Error(response.data);
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      console.error(err.response.data);
      console.error(err.response.status);
      // console.error(err.response.headers);
    }
  }
};

export const getBookingDetailCustomer = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/User/BookingDetail/${bookingDetailId}`
  );
  return response.data;
};
