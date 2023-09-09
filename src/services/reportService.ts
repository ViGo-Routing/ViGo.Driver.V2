import apiManager from "../utils/apiManager";

export const createReport = async (
  type: "BOOKER_NOT_COMING" | "OTHER",
  title: string,
  content: string,
  bookingDetailId?: string
) => {
  const response = await apiManager.post(`api/Report`, {
    title: title,
    content: content,
    type: type,
    bookingDetailId: bookingDetailId,
  });

  return response.data;
};

export const getReports = async (pageNumber = 1, pageSize = 10) => {
  const response = await apiManager.get(
    `api/Report/User?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  return response.data;
};

export const getReport = async (reportId: string) => {
  const response = await apiManager.get(`api/Report/${reportId}`);

  return response.data;
};
