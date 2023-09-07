import { ColorType } from "native-base/lib/typescript/components/types";

export const getCancelRateTextColor = (rate: number): ColorType => {
  if (rate <= 0.25) {
    return "green.500";
  } else if (rate <= 0.5) {
    return "orange.500";
  } else {
    return "red.500";
  }
};
