import Spinner from "react-native-loading-spinner-overlay";
import { themeColors } from "../../../assets/theme";
import { Image } from "native-base";
import { memo } from "react";

const ViGoSpinner = ({ isLoading }) => {
  return (
    <Spinner visible={isLoading} color={themeColors.primary} animation="fade">
      {/* <Image
        size="xs"
        source={require("../../../assets/icons/vigo_icon.png")}
        alt="spinner-vigo-logo"
      /> */}
    </Spinner>
  );
};

export default memo(ViGoSpinner);
