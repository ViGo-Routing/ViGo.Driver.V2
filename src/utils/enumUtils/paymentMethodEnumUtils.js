export const renderPaymentMethod = (paymentMethod) => {
  switch (paymentMethod) {
    case "WALLET":
      return "Ví của tôi";
    case "VNPAY":
      return "Thanh toán VNPAY";
    case "ZALO":
      return "Thanh toán ZaloPay";
  }
};
