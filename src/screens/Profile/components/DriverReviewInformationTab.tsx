import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  VStack,
  Heading,
  View,
  Pressable,
  Image,
  Box,
  FormControl,
  Input,
  HStack,
  Select,
  Text,
} from "native-base";
import { memo, useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { themeColors, vigoStyles } from "../../../../assets/theme";
import { UserContext } from "../../../context/UserContext";
import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/solid";
import { logUserOut } from "../../../services/userService";

interface DriverReviewInformationTabProps {
  name: string;
  gender: boolean;
  dob: Date | undefined;
  email: string;
  avatarSource: any;
  vehicleTypeText: string;
  vehiclePlate: string;
  setPreviousStep: () => void;
  scrollToTop: () => void;
  handleOpenConfirm: () => void;
  isSubmitted: boolean;
  navigation: any;
}

const DriverReviewInformationTab = ({
  name,
  gender,
  dob,
  email,
  avatarSource,
  vehicleTypeText,
  vehiclePlate,
  setPreviousStep,
  scrollToTop,
  handleOpenConfirm,
  isSubmitted,
  navigation,
}: DriverReviewInformationTabProps) => {
  const { user, setUser } = useContext(UserContext);

  const formatDate = (rawDate: any) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return `${day}-${month + 1}-${year}`;
  };

  return (
    <VStack pt={4} pb="4">
      <VStack pb="4">
        <View style={{ alignItems: "center" }}>
          {/* <Pressable onPress={() => handlePickAvatar()} isDisabled={isSubmitted}> */}
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
          {/* </Pressable> */}
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
                // onChangeText={setName}
                // isReadOnly={isSubmitted}
                isReadOnly
                // variant={"filled"}
                // style={{ backgroundColor: "white" }}
                style={styles.input}
              />
            </FormControl>
          </Box>

          <Box marginTop={3}>
            <FormControl>
              <FormControl.Label>Giới tính</FormControl.Label>
              {/* <Select
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
            </Select> */}
              <Input
                placeholder="Nam hoặc nữ"
                value={gender == true ? "Nam" : "Nữ"}
                // autoComplete="gender"
                // keyboardType="default"
                // textContentType="name"
                // onChangeText={setName}
                // isReadOnly={isSubmitted}
                isReadOnly
                // variant={"filled"}
                // style={{ backgroundColor: "white" }}
                style={styles.input}
              />
            </FormControl>
          </Box>

          <Box marginTop={3}>
            <FormControl>
              <FormControl.Label>Ngày sinh</FormControl.Label>
              {/* <Pressable
              // disabled={isSubmitted == true}
              isDisabled={isSubmitted}
              onPress={toggleDatepicker}
            > */}
              <Input
                placeholder="Nhập ngày sinh"
                value={dob ? formatDate(dob) : ""}
                // onChangeText={setDob}
                // ref={dobRef}
                style={styles.input}
                isReadOnly={true}
              />
              {/* </Pressable>
            {showPicker && (
              <RNDateTimePicker
                mode="date"
                onChange={(event, date) => {
                  toggleDatepicker();
                  setDob(date);
                }}
                value={dob}
                maximumDate={getMaximumDob()}
                negativeButton={{ label: "Hủy" }}
                positiveButton={{ label: "Xác nhận" }}
              />
            )} */}
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
                // onChangeText={setEmail}
                // isReadOnly={isSubmitted == true}
                isReadOnly
                // variant={"filled"}
                // style={{ backgroundColor: "white" }}
                style={styles.input}
              />
            </FormControl>
          </Box>
        </Box>
      </VStack>

      <VStack pt={4} pb="4">
        <Heading size={"md"} marginBottom={2}>
          Phương tiện
        </Heading>
        <Box>
          <FormControl>
            <FormControl.Label>Loại phương tiện</FormControl.Label>
            {/* <Select
      accessibilityLabel="Loại phương tiện"
      placeholder="Loại phương tiện"
      selectedValue={vehicleType}
      // onValueChange={(vehicleTypeId) => setVehicleType(vehicleTypeId)}
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
    </Select> */}
            <Input
              placeholder="Loại phương tiện"
              value={vehicleTypeText}
              // autoComplete="email"
              // keyboardType="email-address"
              // textContentType="emailAddress"
              // onChangeText={setEmail}
              // isReadOnly={isSubmitted == true}
              isReadOnly
              // variant={"filled"}
              // style={{ backgroundColor: "white" }}
              style={styles.input}
            />
          </FormControl>
        </Box>
        <Box marginTop={3}>
          <FormControl>
            <FormControl.Label>Biển số xe</FormControl.Label>
            <Input
              placeholder="72A-852.312"
              value={vehiclePlate}
              keyboardType="default"
              // onChangeText={setVehiclePlate}
              // isReadOnly={isSubmitted}
              isReadOnly
              // variant={"filled"}
              // style={{ backgroundColor: "white" }}
              style={styles.input}
            />
          </FormControl>
        </Box>
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
          <HStack>
            <ArrowLeftIcon size={24} color={themeColors.primary} />
            <Text ml="1" style={vigoStyles.buttonWhiteText}>
              Quay lại
            </Text>
          </HStack>
        </TouchableOpacity>
        {!isSubmitted && (
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              // setNextStep();
              // setCurrentStep(1);
              // scrollToTop();
              handleOpenConfirm();
            }}
            // disabled={isAmountInvalid}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
        {isSubmitted && (
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

export default memo(DriverReviewInformationTab);
