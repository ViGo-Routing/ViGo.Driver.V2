import apiManager from "../utils/apiManager";

export const readIdInformation = async (idImageUrl) => {
  const response = await apiManager.post("/api/Image/ReadText", {
    imageUrl: idImageUrl,
    ocrType: "ID",
  });
  return response.data;
};

export const readDriverInformation = async (driverLicenseImageUrl) => {
  const response = await apiManager.post("/api/Image/ReadText", {
    imageUrl: driverLicenseImageUrl,
    ocrType: "DRIVER_LICENSE",
  });
  return response.data;
};
