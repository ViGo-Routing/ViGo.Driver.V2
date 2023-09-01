import axios from "axios";

export const getImageData = async (uri) => {
  try {
    const response = await axios.get(uri, { responseType: "blob" });

    const blob = new File([response.data], "image.png");
    return blob;
  } catch (err) {
    throw err;
  }
};

export const generateImageName = (length) => {
  var imageName = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (let index = 0; index < length; index++) {
    imageName += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  imageName += Date.now();
  return imageName;
};
