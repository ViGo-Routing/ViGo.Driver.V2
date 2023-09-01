import { useContext, useState } from "react";
import {
  Badge,
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Animated, View } from "react-native";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  ListBulletIcon,
  MapIcon,
  MapPinIcon,
  MinusIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import {
  ClockIcon as ClockOutlineIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";
import { themeColors, vigoStyles } from "../../../assets/theme";
import {
  calculateAge,
  toVnDateString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { pickBookingDetailById } from "../../services/bookingDetailService";
import { toPercent, vndFormat } from "../../utils/numberUtils";
import { UserContext } from "../../context/UserContext";
import ConfirmAlert from "../../components/Alert/ConfirmAlert";
import {
  TripBasicInformation,
  TripFullInformation,
} from "../../components/TripInformation/TripInformation";

const PickBookingDetailConfirmAlert = ({
  item,
  items,
  pickingFee,
  handleOkPress,
  confirmOpen,
  setConfirmOpen,
  // key,
}) => {
  const description = () => {
    if (item || (items && items.length == 1)) {
      return (
        <VStack>
          <Text>
            Với việc nhận chuyến xe, bạn sẽ phải trả trước một khoản phí nhận
            chuyến.
          </Text>
          <Text>
            Sau khi hoàn thành chuyến đi, bạn sẽ được trả toàn bộ số tiền của
            chuyến đi.
          </Text>
          <Text marginTop="2">
            Phí nhận chuyến: <Text bold>{vndFormat(pickingFee)}</Text>
          </Text>
        </VStack>
      );
    } else if (items && items.length > 1) {
      return (
        <VStack>
          <Text>
            Với việc nhận {items.length} chuyến xe này, bạn sẽ phải trả trước
            một khoản phí nhận chuyến.
          </Text>
          <Text>
            Sau khi hoàn thành mỗi chuyến đi, bạn sẽ được trả toàn bộ số tiền
            của chuyến đi đó.
          </Text>
          <Text marginTop="2">
            Phí nhận chuyến: <Text bold>{vndFormat(pickingFee)}</Text> cho mỗi
            chuyến đi nhận thành công.
          </Text>
          <Text marginTop="2">
            Ước tính: <Text bold>{vndFormat(pickingFee * items.length)}</Text>
          </Text>
        </VStack>
      );
    }
    return <></>;
  };

  return (
    <ConfirmAlert
      title="Nhận chuyến xe"
      description={description()}
      okButtonText="Xác nhận"
      cancelButtonText="Hủy"
      onOkPress={() => handleOkPress()}
      isOpen={confirmOpen}
      setIsOpen={setConfirmOpen}
      key={`confirm-booking-detail-alert`}
    />
  );
};

const CancelBookingDetailConfirmAlert = ({
  item,
  // items,
  cancelFee,
  handleOkPress,
  confirmOpen,
  setConfirmOpen,
  // key,
}) => {
  const description = () => {
    if (item || (items && items.length == 1)) {
      return (
        <VStack>
          <Text>
            Với việc nhận chuyến xe, bạn sẽ phải trả trước một khoản phí nhận
            chuyến.
          </Text>
          <Text>
            Sau khi hoàn thành chuyến đi, bạn sẽ được trả toàn bộ số tiền của
            chuyến đi.
          </Text>
          <Text marginTop="2">
            Phí nhận chuyến: <Text bold>{vndFormat(pickingFee)}</Text>
          </Text>
        </VStack>
      );
    } else if (items && items.length > 1) {
      return (
        <VStack>
          <Text>
            Với việc nhận {items.length} chuyến xe này, bạn sẽ phải trả trước
            một khoản phí nhận chuyến.
          </Text>
          <Text>
            Sau khi hoàn thành mỗi chuyến đi, bạn sẽ được trả toàn bộ số tiền
            của chuyến đi đó.
          </Text>
          <Text marginTop="2">
            Phí nhận chuyến: <Text bold>{vndFormat(pickingFee)}</Text> cho mỗi
            chuyến đi nhận thành công.
          </Text>
          <Text marginTop="2">
            Ước tính: <Text bold>{vndFormat(pickingFee * items.length)}</Text>
          </Text>
        </VStack>
      );
    }
    return <></>;
  };

  return (
    <ConfirmAlert
      title="Nhận chuyến xe"
      description={description()}
      okButtonText="Xác nhận"
      cancelButtonText="Hủy"
      onOkPress={() => handleOkPress()}
      isOpen={confirmOpen}
      setIsOpen={setConfirmOpen}
      key={`confirm-booking-detail-alert`}
    />
  );
};

const BookingDetailPanel = ({
  item,
  actionButton = undefined,
  customer,
  navigation,
  // toggleBottomSheet,
  duration,
  distance,
  displayButtons = true,
}) => {
  const { user } = useContext(UserContext);
  // console.log(item.status);
  return (
    <Box>
      <TripFullInformation
        item={item}
        distance={distance}
        duration={duration}
        customer={customer}
      />
      {displayButtons && (
        <VStack>
          <HStack>
            <View
              style={[
                styles.cardInsideLocation,
                {
                  backgroundColor: themeColors.primary,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                },
                vigoStyles.buttonWhite,
              ]}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <HStack alignItems="center">
                  <ArrowLeftIcon size={20} color={themeColors.primary} />
                  <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                    Quay lại
                  </Text>
                </HStack>
              </TouchableOpacity>
            </View>
            {actionButton && actionButton}
          </HStack>
          {item.status == "ASSIGNED" && (
            <HStack>
              <View
                flex={1}
                style={[
                  styles.cardInsideLocation,
                  {
                    backgroundColor: "red",
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  vigoStyles.buttonWhite,
                ]}
              >
                <TouchableOpacity onPress={() => {}}>
                  <HStack alignItems="center">
                    <XCircleIcon size={20} color={"red"} />
                    <Text marginLeft={2} color="red.500" bold>
                      Hủy nhận chuyến
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </View>
            </HStack>
          )}
        </VStack>
      )}
    </Box>
  );
};

const BookingDetailSmallPanel = ({ item, actionButton, navigation }) => {
  const { user } = useContext(UserContext);
  // console.log(item);
  return (
    <Box>
      <TripBasicInformation item={item} />
      <HStack>
        <View
          style={[
            styles.cardInsideLocation,
            {
              backgroundColor: themeColors.primary,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            },
            vigoStyles.buttonWhite,
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HStack alignItems="center">
              <ArrowLeftIcon size={20} color={themeColors.primary} />
              <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                Quay lại
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>
        {actionButton && actionButton}
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    // flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    // flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 20,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    margin: 5,
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    // paddingLeft: 10,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
  titlePrice: {
    // fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export { BookingDetailSmallPanel, PickBookingDetailConfirmAlert };
export default BookingDetailPanel;
