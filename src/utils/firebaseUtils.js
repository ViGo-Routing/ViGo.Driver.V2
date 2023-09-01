import storage from "@react-native-firebase/storage";
import { getImageData } from "./imageUtils";

export const uploadFile = async (imageUri, fileName) => {
  const blob = await getImageData(imageUri);

  const ref = storage().ref("images/" + fileName);
  const task = ref.put(blob);
  return { task, ref };
};
