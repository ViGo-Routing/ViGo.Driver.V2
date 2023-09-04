import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Pressable,
  Image,
} from "native-base";
import { Dispatch, memo } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { themeColors, vigoStyles } from "../../../../assets/theme";
import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/solid";

interface DriverAddDriverLicenseTabProps {
  handlePickLicense_FrontSide: () => void;
  handlePickLicense_BackSide: () => void;
  setDrivingFrontSide: Dispatch<React.SetStateAction<string>>;
  drivingFrontSide: string;
  setDrivingBackSide: Dispatch<React.SetStateAction<string>>;
  drivingBackSide: string;
  isSubmitted: boolean;
  pickImage: any;

  setPreviousStep: () => void;
  setNextStep: () => void;
  scrollToTop: () => void;

  isDrivingFrontSideChange: boolean;
  handleReadDrivingFrontSideText: (
    drivingFrontSideUrl: string,
    callback: () => void
  ) => void;
}

const DriverAddDriverLicenseTab = ({
  handlePickLicense_FrontSide,
  handlePickLicense_BackSide,
  setDrivingFrontSide,
  drivingFrontSide,
  setDrivingBackSide,
  drivingBackSide,
  isSubmitted,
  pickImage,
  setPreviousStep,
  setNextStep,
  scrollToTop,
  isDrivingFrontSideChange,
  handleReadDrivingFrontSideText,
}: DriverAddDriverLicenseTabProps) => {
  return (
    <VStack pt={4} pb="4">
      <Heading size={"md"} marginBottom={2}>
        Tải lên Giấy phép lái xe
      </Heading>
      {/* <HStack
                    justifyContent={"space-between"}
                    paddingLeft={4}
                    paddingRight={4}
                  > */}
      <VStack>
        <Heading size="sm" marginBottom={1}>
          Mặt trước
        </Heading>
        <HStack justifyContent="center">
          <Pressable
            onPress={() => handlePickLicense_FrontSide()}
            // disabled={isSubmitted == true}
            isDisabled={isSubmitted}
          >
            <Image
              source={
                drivingFrontSide
                  ? {
                      uri: drivingFrontSide,
                    }
                  : pickImage
              }
              style={styles.licenseImage}
              alt="Giấy phép lái xe mặt trước"
            />
          </Pressable>
        </HStack>
      </VStack>
      <VStack mt="10">
        <Heading size="sm" marginBottom={1}>
          Mặt sau
        </Heading>
        <HStack justifyContent="center">
          <Pressable
            onPress={() => handlePickLicense_BackSide()}
            // disabled={isSubmitted == true}
            isDisabled={isSubmitted}
          >
            <Image
              source={
                drivingBackSide
                  ? {
                      uri: drivingBackSide,
                    }
                  : pickImage
              }
              style={styles.licenseImage}
              alt="Giấy phép lái xe mặt sau"
            />
          </Pressable>
        </HStack>
      </VStack>
      {/* </HStack> */}

      <HStack justifyContent="space-between" mt="5">
        <TouchableOpacity
          style={{ ...vigoStyles.buttonWhite }}
          onPress={() => {
            // setCurrentStep(0);
            setPreviousStep();
            scrollToTop();
          }}
          // disabled={isAmountInvalid}
        >
          <HStack>
            <ArrowLeftIcon size={24} color={themeColors.primary} />
            <Text ml="1" style={vigoStyles.buttonWhiteText}>
              Quay lại
            </Text>
          </HStack>
        </TouchableOpacity>
        {drivingFrontSide && drivingBackSide && (
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              if (isDrivingFrontSideChange && !isSubmitted) {
                // handleReadDrivingFrontSideText(drivingFrontSide, () => {
                setNextStep();
                scrollToTop();
                // });
              } else {
                setNextStep();
                scrollToTop();
              }
            }}
            // disabled={isAmountInvalid}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  licenseImage: {
    width: 240,
    height: 160,
  },
  input: {
    height: 40,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default memo(DriverAddDriverLicenseTab);
