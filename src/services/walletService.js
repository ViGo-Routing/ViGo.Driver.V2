import apiManager from "../utils/apiManager";

export const getWalletByUserId = async (id) => {
  try {
    const response = await apiManager.get(`/api/Wallet/User/${id}`);

    // console.log("Wallet\n");
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Get Wallet By User Id failed: ${error}`);
  }
};

export const getWalletTransactions = async (walletId, pageSize, pageNumber) => {
  try {
    const response = await apiManager.get(
      `api/WalletTransaction/Wallet/${walletId}
      ?pageNumber=${pageNumber}&pageSize=${pageSize}
      &orderBy=createdTime desc`
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Get Wallet's Transactions error: ${error} `);
  }
};

export const getWalletTransactionDetail = async (walletTransactionId) => {
  try {
    const response = await apiManager.get(
      `api/WalletTransaction/${walletTransactionId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(`Get Wallet Transaction details error: ${error}`);
  }
};

export const getBookingDetailTransactions = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/WalletTransaction/BookingDetail/${bookingDetailId}`
  );
  return response.data;
};
