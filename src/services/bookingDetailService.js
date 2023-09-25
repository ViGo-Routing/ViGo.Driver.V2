import { Alert } from "react-native";
import apiManager from "../utils/apiManager";
import moment from "moment";

export const getAvailableBookingDetails = async (
  driverId,
  pageSize,
  pageNumber
) => {
  // try {
  const response = await apiManager.get(
    `/api/BookingDetail/Driver/Available/${driverId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response;
  // } catch (error) {
  //   console.error("Create Payment failed:", error);
  // }
};

export const getAvailableBookingDetailsByBooking = async (
  driverId,
  bookingId,
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
  pageSize = -1,
  pageNumber = 1
) => {
  let requestUrl = `api/BookingDetail/Driver/Available/${driverId}/${bookingId}?pageSize=${pageSize}&pageNumber=${pageNumber}`;

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

export const pickBookingDetailById = async (bookingDetailId) => {
  // console.log(bookingDetailId);
  // try {
  const response = await apiManager.post(
    `/api/BookingDetail/Driver/Pick/${bookingDetailId}`
  );
  return response;
};

export const pickBookingDetails = async (bookingDetailIds) => {
  const response = await apiManager.post(
    `api/BookingDetail/Driver/Pick`,
    bookingDetailIds
  );
  return response.data;
};

export const getBookingDetailByDriverId = async (
  driverId,
  minDate = null,
  maxDate = null,
  minPickupTime = null,
  status = "",
  pageSize = 10,
  pageNumber = 1,
  orderBy = null
) => {
  // try {
  let endpoint = `/api/BookingDetail/Driver/${driverId}?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  if (minDate != null) {
    endpoint += `&minDate=${minDate}`;
  }
  if (maxDate != null) {
    endpoint += `&maxDate=${maxDate}`;
  }
  if (minPickupTime != null) {
    endpoint += `&minPickupTime=${minPickupTime}`;
  }
  if (status) {
    endpoint += `&status=${status}`;
  }
  if (orderBy) {
    endpoint += `&orderBy=${orderBy}`;
  }

  const response = await apiManager.get(endpoint);
  return response;
  // } catch (error) {
  //   if (error.response && error.response.data) {
  //     // Assuming the error response has a 'data' property containing error details
  //     const errorDetails = error.response.data;
  //     Alert.alert(errorDetails);
  //     return null;
  //   } else {
  //     console.log("Error response structure not recognized.");
  //     return null;
  //   }
  // }
};

export const updateStatusBookingDetail = async (
  bookingDetailId,
  requestData
) => {
  // console.log(requestData);
  // try {
  const response = await apiManager.put(
    `/api/BookingDetail/UpdateStatus/${bookingDetailId}`,
    requestData
  );
  return response;
  // } catch (error) {
  //   console.error("Driver Pick Booking Detail By Id failed:", error);
  //   return null;
  // }
};

export const getBookingDetail = async (bookingDetailId) => {
  const response = await apiManager.get(`api/BookingDetail/${bookingDetailId}`);
  return response.data;
};

export const getBookingDetailPickFee = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/DriverFee/${bookingDetailId}`
  );
  return response.data;
};

export const getDriverSchedulesForPickingTrip = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/Driver/PickSchedules/${bookingDetailId}`
  );
  return response.data;
};

export const getUpcomingTrip = async (driverId) => {
  const response = await apiManager.get(
    `api/BookingDetail/Upcoming/${driverId}`
  );

  return response.status == 204 ? null : response.data;
};

export const getCurrentTrip = async (driverId) => {
  const response = await apiManager.get(
    `api/BookingDetail/Current/${driverId}`
  );

  return response.status == 204 ? null : response.data;
};

export const cancelBookingDetail = async (bookingDetailId) => {
  const response = await apiManager.put(
    `api/BookingDetail/Cancel/${bookingDetailId}`
  );

  return response.data;
};

export const getCancelFee = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/Cancel/Fee/${bookingDetailId}`
  );
  return response.data;
};
