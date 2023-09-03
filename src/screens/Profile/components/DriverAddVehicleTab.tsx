import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Image,
  Pressable,
  FormControl,
  Select,
  Input,
} from "native-base";
import {
  Dispatch,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { vigoStyles } from "../../../../assets/theme";
import { getVehicleTypes } from "../../../services/vehicleService";
import { handleError } from "../../../utils/alertUtils";

interface DriverAddVehicleTabProps {
  handlePickVehicle_FrontSide: () => void;
  handlePickVehicle_BackSide: () => void;
  setVehicleFrontSide: Dispatch<React.SetStateAction<string>>;
  vehicleFrontSide: string;
  setVehicleBackSide: Dispatch<React.SetStateAction<string>>;
  vehicleBackSide: string;
  isSubmitted: boolean;
  pickImage: any;

  setVehicleType: Dispatch<React.SetStateAction<string>>;
  vehicleType: string;
  vehicleTypes: any[];
  setVehicleTypeText: Dispatch<React.SetStateAction<string>>;
  vehicleTypeText: string;
  vehiclePlate: string;
  setVehiclePlate: Dispatch<React.SetStateAction<string>>;
  loadVehicleTypes: () => void;

  setNextStep: () => void;
  setPreviousStep: () => void;
  scrollToTop: () => void;
  setIsLoading: Dispatch<React.SetStateAction<boolean>>;
}

const DriverAddVehicleTab = ({
  handlePickVehicle_FrontSide,
  handlePickVehicle_BackSide,
  setVehicleFrontSide,
  vehicleFrontSide,
  setVehicleBackSide,
  vehicleBackSide,
  isSubmitted,
  pickImage,
  setVehicleType,
  vehicleType,
  setVehicleTypeText,
  vehicleTypeText,
  vehiclePlate,
  setVehiclePlate,
  setNextStep,
  setPreviousStep,
  scrollToTop,
  setIsLoading,
  loadVehicleTypes,
  vehicleTypes,
}: DriverAddVehicleTabProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [vehicleTypesDropdown, setVehicleTypesDropdown] = useState([] as any[]);

  // useEffect(() => {
  //   loadVehicleTypes();
  // }, []);

  useEffect(() => {
    if (vehicleTypes) {
      setVehicleTypesDropdown(
        vehicleTypes.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
  }, [vehicleTypes]);

  return currentStep == 0 ? (
    <VStack pt={4} pb="4">
      <Heading size={"md"} marginBottom={2}>
        Giấy đăng ký sử dụng xe
      </Heading>
      <VStack>
        <Heading size="sm" marginBottom={1}>
          Mặt trước
        </Heading>
        <HStack justifyContent="center">
          <Pressable
            onPress={() => handlePickVehicle_FrontSide()}
            // disabled={isSubmitted == true}
            isDisabled={isSubmitted}
          >
            <Image
              source={
                vehicleFrontSide
                  ? {
                      uri: vehicleFrontSide,
                    }
                  : pickImage
              }
              style={styles.licenseImage}
              alt="Giấy đăng ký sử dụng xe mặt trước"
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
            onPress={() => handlePickVehicle_BackSide()}
            // disabled={isSubmitted == true}
            isDisabled={isSubmitted}
          >
            <Image
              source={
                vehicleBackSide
                  ? {
                      uri: vehicleBackSide,
                    }
                  : pickImage
              }
              style={styles.licenseImage}
              alt="Giấy đăng ký sử dụng xe mặt sau"
            />
          </Pressable>
        </HStack>
      </VStack>

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
          <Text style={vigoStyles.buttonWhiteText}>Quay lại</Text>
        </TouchableOpacity>
        {vehicleFrontSide && vehicleBackSide && (
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              // setNextStep();
              setCurrentStep(1);
              scrollToTop();
            }}
            // disabled={isAmountInvalid}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
      </HStack>
    </VStack>
  ) : currentStep == 1 ? (
    <VStack pt={4} pb="4">
      <Heading size={"md"} marginBottom={2}>
        Phương tiện
      </Heading>
      <Box>
        <FormControl>
          <FormControl.Label>Loại phương tiện</FormControl.Label>
          <Select
            accessibilityLabel="Loại phương tiện"
            placeholder="Loại phương tiện"
            selectedValue={vehicleType ?? vehicleTypesDropdown[0].value}
            onValueChange={(vehicleTypeId) => {
              setVehicleType(vehicleTypeId);
              console.log(
                vehicleTypesDropdown.find((v: any) => v.value == vehicleTypeId)
                  ?.label
              );
              setVehicleTypeText(
                vehicleTypesDropdown.find((v: any) => v.value == vehicleTypeId)
                  ?.label
              );
            }}
            // color={"white"}
            isDisabled={isSubmitted}
            backgroundColor={"white"}
          >
            {vehicleTypesDropdown.map((item: any) => (
              <Select.Item
                label={item.label}
                value={item.value}
                key={item.value}
              />
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box marginTop={3}>
        <FormControl>
          <FormControl.Label>Biển số xe</FormControl.Label>
          <Input
            placeholder="72A-852.312"
            value={vehiclePlate}
            keyboardType="default"
            onChangeText={setVehiclePlate}
            isReadOnly={isSubmitted}
            // variant={"filled"}
            // style={{ backgroundColor: "white" }}
            style={styles.input}
          />
        </FormControl>
      </Box>

      <HStack justifyContent="space-between" mt="5">
        <TouchableOpacity
          style={{ ...vigoStyles.buttonWhite }}
          onPress={() => {
            setCurrentStep(0);
            // setPreviousStep();
            scrollToTop();
          }}
          // disabled={isAmountInvalid}
        >
          <Text style={vigoStyles.buttonWhiteText}>Quay lại</Text>
        </TouchableOpacity>
        {vehicleType && vehiclePlate && (
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              setNextStep();
              // setCurrentStep(1);
              scrollToTop();
            }}
            // disabled={isAmountInvalid}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
      </HStack>
    </VStack>
  ) : (
    <></>
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

export default memo(DriverAddVehicleTab);
