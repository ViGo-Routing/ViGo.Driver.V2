import apiManager from "../utils/apiManager";

export const createTopupTransaction = async (userId, amount, paymentMethod) => {
  try {
    const response = await apiManager.post(`/api/Payment/Generate/Topup`, {
      userId: userId,
      amount: amount,
      paymentMethod: paymentMethod,
    });

    // console.log("Wallet\n");
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Create topup transaction failed: ${error}`);
  }
};
