import apiManager from "../utils/apiManager";

export const getAvailableBookings = async (
  userId,
  pageSize = 10,
  pageNumber = 10
) => {
  const response = await apiManager.get(
    `api/Booking/Driver/Available/${userId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await apiManager.get(`api/Booking/${bookingId}`);
  return response.data;
};
