import moment from "moment";
import apiManager from "../utils/apiManager";

export const getAvailableBookings = async (
  userId,
  isDate = false,
  minDate = null,
  maxDate = null,
  isPickupTime = false,
  minPickupTime = null,
  maxPickupTime = null,
  isStartLocation = false,
  startLocationLat = null,
  startLocationLong = null,
  startLocationRadius = null,
  isEndLocation = false,
  endLocationLat = null,
  endLocationLong = null,
  endLocationRadius = null,
  pageSize = 10,
  pageNumber = 10
) => {
  let requestUrl = `api/Booking/Driver/Available/${userId}?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  if (isDate && minDate) {
    requestUrl += `&minDate=${moment(minDate).format("YYYY-MM-DD").toString()}`;
  }
  if (isDate && maxDate) {
    requestUrl += `&maxDate=${moment(maxDate).format("YYYY-MM-DD").toString()}`;
  }
  if (isPickupTime && minPickupTime) {
    requestUrl += `&minPickupTime=${moment(minPickupTime)
      .format("HH:mm:ss")
      .toString()}`;
  }
  if (isPickupTime && maxPickupTime) {
    requestUrl += `&maxPickupTime=${moment(maxPickupTime)
      .format("HH:mm:ss")
      .toString()}`;
  }
  if (
    isStartLocation &&
    startLocationLat &&
    startLocationLong &&
    startLocationRadius
  ) {
    requestUrl += `&startLocationLat=${startLocationLat}&startLocationLng=${startLocationLong}&startLocationRadius=${startLocationRadius}`;
  }
  if (isEndLocation && endLocationLat && endLocationLong && endLocationRadius) {
    requestUrl += `&endLocationLat=${endLocationLat}&endLocationLng=${endLocationLong}&endLocationRadius=${endLocationRadius}`;
  }

  console.log(requestUrl);

  const response = await apiManager.get(requestUrl);
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await apiManager.get(`api/Booking/${bookingId}`);
  return response.data;
};
