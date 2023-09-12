import {
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Pressable,
  Image,
  View,
  FormControl,
  Input,
  Select,
} from "native-base";
import { Dispatch, memo, useContext, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { themeColors, vigoStyles } from "../../../../assets/theme";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { getMaximumDob } from "../../../utils/datetimeUtils";
import { UserContext } from "../../../context/UserContext";
import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/solid";
import { logUserOut } from "../../../services/userService";

interface DriverAddIdTabProps {
  handlePickId_FrontSide: () => void;
  handlePickId_BackSide: () => void;
  handlePickAvatar: () => void;
  // setIdFrontSide: Dispatch<React.SetStateAction<string>>;
  idFrontSide: string;
  // setIdBackSide: Dispatch<React.SetStateAction<string>>;
  idBackSide: string;
  isSubmitted: boolean;
  pickImage: any;

  name: string;
  setName: Dispatch<React.SetStateAction<string>>;
  gender: boolean;
  setGender: Dispatch<React.SetStateAction<boolean>>;
  dob: Date | undefined;
  setDob: Dispatch<React.SetStateAction<Date | undefined>>;
  email: string;
  setEmail: Dispatch<React.SetStateAction<string>>;
  avatarSource: any;
  // setAvatarSource: Dispatch<React.SetStateAction<any>>;

  setNextStep: () => void;

  scrollToTop: () => void;

  isIdFrontSideChange: boolean;
  handleReadIdFrontSideText: (
    idFrontSideUrl: string,
    callback: () => void
  ) => void;

  navigation: any;
}

const availableGender = [
  { label: "Nam", value: true },
  { label: "Nữ", value: false },
];

const DriverAddIdTab = ({
  handlePickId_FrontSide,
  handlePickId_BackSide,
  handlePickAvatar,
  // setIdFrontSide,
  idFrontSide,
  // setIdBackSide,
  idBackSide,
  pickImage,
  isSubmitted = false,
  name,
  setName,
  gender,
  setGender,
  dob,
  setDob,
  email,
  setEmail,
  avatarSource,
  // setAvatarSource,
  setNextStep,
  scrollToTop,
  isIdFrontSideChange,
  handleReadIdFrontSideText,
  navigation,
}: DriverAddIdTabProps) => {
  const { user, setUser } = useContext(UserContext);

  const [currentStep, setCurrentStep] = useState(0);

  const [showPicker, setShowpicker] = useState(false);

  const formatDate = (rawDate: any) => {
    let date = new Date(rawDate);
    // console.log(dob);

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  const toggleDatepicker = () => {
    setShowpicker(!showPicker);
  };

  let dobRef = useRef();

  // console.log(dob);

  return currentStep == 0 ? (
    <VStack pt={4} pb="4">
      <Heading size={"md"} marginBottom={2}>
        Tải lên ảnh CCCD / CMND
      </Heading>
      {/* <HStack justifyContent={"space-between"} paddingLeft={4} paddingRight={4}> */}
      <VStack>
        <Heading size="sm" marginBottom={1}>
          Mặt trước
        </Heading>
        <HStack justifyContent="center">
          <Pressable
            onPress={() => handlePickId_FrontSide()}
            // disabled={isSubmitted == true}
            isDisabled={isSubmitted}
          >
            <Image
              source={
                idFrontSide
                  ? {
                      uri: idFrontSide,
                    }
                  : pickImage
              }
              style={styles.licenseImage}
              alt="Ảnh CCCD mặt trước"
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
            onPress={() => handlePickId_BackSide()}
            // disabled={isSubmitted == true}
            isDisabled={isSubmitted}
          >
            <Image
              source={
                idBackSide
                  ? {
                      uri: idBackSide,
                    }
                  : pickImage
              }
              style={styles.licenseImage}
              alt="Ảnh CCCD mặt sau"
            />
          </Pressable>
        </HStack>
      </VStack>
      <HStack justifyContent="space-between" mt="5">
        <TouchableOpacity
          style={[vigoStyles.buttonWhite, { borderColor: "red" }]}
          onPress={() => {
            // setCurrentStep(0);
            // scrollToTop();
            logUserOut(setUser, navigation);
          }}
          // disabled={isAmountInvalid}
        >
          <HStack>
            <ArrowLeftOnRectangleIcon size={24} color={"red"} />
            <Text ml="1" style={{ color: "red" }}>
              Đăng xuất
            </Text>
          </HStack>
        </TouchableOpacity>
        {idFrontSide && idBackSide && (
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              if (isIdFrontSideChange && !isSubmitted) {
                handleReadIdFrontSideText(idFrontSide, () => {
                  setCurrentStep(1);
                  scrollToTop();
                });
              } else {
                setCurrentStep(1);
                scrollToTop();
              }
            }}
            // disabled={isAmountInvalid}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
      </HStack>
      {/* </HStack> */}
    </VStack>
  ) : currentStep == 1 ? (
    <VStack pt={4} pb="4">
      <View style={{ alignItems: "center" }}>
        <Pressable onPress={() => handlePickAvatar()} isDisabled={isSubmitted}>
          <Image
            source={
              avatarSource
                ? { uri: avatarSource }
                : require("../../../../assets/images/no-image.jpg")
            }
            // style={styles.image}
            alt="Ảnh đại diện"
            size={100}
            borderRadius={100}
          />
        </Pressable>
      </View>

      <Box>
        <Box marginTop={3}>
          <FormControl>
            <FormControl.Label>Số điện thoại</FormControl.Label>
            <Input
              value={user?.phone}
              // editable={false}
              isReadOnly={true}
              variant={"filled"}
              // style={styles.input}
            />
          </FormControl>
        </Box>

        <Box marginTop={3}>
          <FormControl>
            <FormControl.Label>Họ và tên</FormControl.Label>
            <Input
              placeholder="Nhập họ và tên"
              value={name}
              autoComplete="name"
              keyboardType="default"
              textContentType="name"
              onChangeText={setName}
              isReadOnly={isSubmitted}
              // variant={"filled"}
              // style={{ backgroundColor: "white" }}
              style={styles.input}
            />
          </FormControl>
        </Box>

        <Box marginTop={3}>
          <FormControl>
            <FormControl.Label>Giới tính</FormControl.Label>
            <Select
              accessibilityLabel="Nam hoặc nữ"
              placeholder="Nam hoặc nữ"
              selectedValue={`${gender}`}
              onValueChange={(item) => setGender(item == "true")}
              // color={"white"}
              isDisabled={isSubmitted}
              backgroundColor={"white"}
            >
              {availableGender.map((item) => (
                <Select.Item
                  label={item.label}
                  value={`${item.value}`}
                  key={`${item.value}`}
                />
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box marginTop={3}>
          <FormControl>
            <FormControl.Label>Ngày sinh</FormControl.Label>
            <Pressable
              // disabled={isSubmitted == true}
              isDisabled={isSubmitted}
              onPress={toggleDatepicker}
            >
              <Input
                placeholder="Nhập ngày sinh"
                value={dob ? formatDate(dob) : ""}
                // onChangeText={setDob}
                ref={dobRef}
                style={styles.input}
                isReadOnly={true}
              />
            </Pressable>
            {showPicker && (
              <RNDateTimePicker
                mode="date"
                onChange={(event, date) => {
                  toggleDatepicker();
                  // console.log(date);
                  setDob(date);
                }}
                value={dob}
                maximumDate={getMaximumDob()}
                negativeButton={{ label: "Hủy" }}
                positiveButton={{ label: "Xác nhận" }}
              />
            )}
          </FormControl>
        </Box>

        <Box marginTop={3}>
          <FormControl>
            <FormControl.Label>Địa chỉ email</FormControl.Label>
            <Input
              placeholder="Nhập địa chỉ email"
              value={email}
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={setEmail}
              isReadOnly={isSubmitted == true}
              // variant={"filled"}
              // style={{ backgroundColor: "white" }}
              style={styles.input}
            />
          </FormControl>
        </Box>
      </Box>

      <HStack justifyContent="space-between" mt="5">
        <TouchableOpacity
          style={{ ...vigoStyles.buttonWhite }}
          onPress={() => {
            setCurrentStep(0);
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
        {avatarSource && name && gender && dob && email && (
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              setNextStep();
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
export default memo(DriverAddIdTab);
