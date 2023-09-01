export const paymentNotificationHandlers = (data, navigation) => {
  if (data) {
    if (data.walletTransactionId) {
      navigation.navigate("WalletTransactionDetail", {
        walletTransactionId: data.walletTransactionId,
      });
    }
  }
};

export const paymentNotificationOnClickHandlers = (data, navigation) => {
  if (data) {
    if (data.walletTransactionId) {
      navigation.navigate("WalletTransactionDetail", {
        walletTransactionId: data.walletTransactionId,
      });
    }
  }
};
