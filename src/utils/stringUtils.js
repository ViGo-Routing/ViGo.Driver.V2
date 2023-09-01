export const isPhoneNumber = (text) => {
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(text);
};
