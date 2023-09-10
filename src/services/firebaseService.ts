import apiManager from "../utils/apiManager";

export const sendMessage = async (bookingDetailId: string, message: any) => {
  const response = await apiManager.post(
    `api/Firebase/Message/${bookingDetailId}`,
    message
  );

  return response.data;
};
