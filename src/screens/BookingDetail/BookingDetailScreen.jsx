import React, { useEffect, useRef, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Animated,
  NativeEventEmitter,
  TouchableOpacity,
} from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { themeColors, vigoStyles } from "../../../assets/theme/index";
import Map from "../../components/Map/Map";
import { Box, Button, ScrollView, HStack, Text } from "native-base";
import BookingDetailPanel, {
  BookingDetailSmallPanel,
  PickBookingDetailConfirmAlert,
} from "./BookingDetailPanel";
import { SwipeablePanel } from "../../components/SwipeablePanel/Panel";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { getBookingDetailCustomer } from "../../services/userService";
import {
  eventNames,
  getErrorMessage,
  handleError,
} from "../../utils/alertUtils";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import {
  getBookingDetail,
  getBookingDetailPickFee,
  getDriverSchedulesForPickingTrip,
  pickBookingDetailById,
} from "../../services/bookingDetailService";
import { generateMapPoint } from "../../utils/mapUtils";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
import { UserContext } from "../../context/UserContext";
// import { SwipeablePanel } from "react-native-swipe-up-panel";

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { user } = useContext(UserContext);

  // const [isBottomSheetVisible, setBottomSheetVisible] = useState(true);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const [isLoading, setIsLoading] = useState(false);
  // Move this block below the 'isBottomSheetVisible' state declaration
  // const translateY = new Animated.Value(400);

  const [customer, setCustomer] = useState({});

  const [duration, setDuration] = useState({});
  const [distance, setDistance] = useState({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [previousTrip, setPreviousTrip] = useState(null);
  const [nextTrip, setNextTrip] = useState(null);

  const [directions, setDirections] = useState(null);

  const [pickingFee, setPickingFee] = useState(0);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  const panelRef = useRef(null);

  const getBookingDetailData = async () => {
    setIsLoading(true);
    try {
      const bookingDetailId = item.id;
      // console.log(bookingDetailId);
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      // console.log(bookingDetailResponse);
      setBookingDetail(bookingDetailResponse);

      setPickupPosition(
        bookingDetailResponse?.startStation?.latitude &&
          bookingDetailResponse?.startStation?.longitude
          ? generateMapPoint(bookingDetailResponse.startStation)
          : null
      );

      setDestinationPosition(
        bookingDetailResponse?.endStation?.latitude &&
          bookingDetailResponse?.endStation?.longitude
          ? generateMapPoint(bookingDetailResponse.endStation)
          : null
      );

      const customerResponse = await getBookingDetailCustomer(bookingDetailId);
      setCustomer(customerResponse);

      const schedules = await getDriverSchedulesForPickingTrip(bookingDetailId);
      setPreviousTrip(schedules.previousTrip);
      setNextTrip(schedules.nextTrip);
      // console.log(schedules);

      let driverSchedules = [];
      if (schedules.previousTrip) {
        driverSchedules.push({
          firstPosition: generateMapPoint(schedules.previousTrip.startStation),
          secondPosition: generateMapPoint(schedules.previousTrip.endStation),
          // strokeColor: "#00A1A1",
          // strokeWidth: 3,
          bookingDetailId: schedules.previousTrip.id,
        });
        // console.log("Previous Trip");
      } else {
        driverSchedules.push(null);
      }
      // console.log(driverSchedules);
      driverSchedules.push({
        firstPosition: generateMapPoint(bookingDetailResponse.startStation),
        secondPosition: generateMapPoint(bookingDetailResponse.endStation),
        // strokeColor: "#00A1A1",
        // strokeWidth: 3,
        bookingDetailId: bookingDetailResponse.id,
      });
      // console.log(driverSchedules);
      if (schedules.nextTrip) {
        // console.log("Next Trip");
        driverSchedules.push({
          firstPosition: generateMapPoint(schedules.nextTrip.startStation),
          secondPosition: generateMapPoint(schedules.nextTrip.endStation),
          // strokeColor: "#00A1A1",
          // strokeWidth: 3,
          bookingDetailId: schedules.nextTrip.id,
        });
      } else {
        driverSchedules.push(null);
      }
      // console.log(driverSchedules);

      setDirections(driverSchedules);
    } catch (error) {
      // console.error(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookingDetailData();
  }, []);

  const handleCustomerDetail = async () => {
    navigation.navigate("CustomerDetail");
  };

  const openConfirmPickBooking = async () => {
    try {
      setIsLoading(true);
      const bookingDetailId = bookingDetail.id;
      const pickingFee = await getBookingDetailPickFee(bookingDetailId);
      setPickingFee(pickingFee);
      setIsConfirmOpen(true);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const eventEmitter = new NativeEventEmitter();

  // const
  const handleConfirmPickBooking = async () => {
    const bookingId = bookingDetail.bookingId;

    try {
      setIsLoading(true);
      const requestData = {
        bookingId: bookingDetail.bookingId,
        driverId: user.id,
      };
      const response = await pickBookingDetailById(bookingDetail.id);
      if (response && response.data) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          // title: "Xác nhận chuyến đi",
          title: "Bạn vừa nhận chuyến thành công!",
          description: "",
          status: "success",
          // placement: "top",
          // isDialog: true,
          isSlide: true,
          duration: 5000,
        });
        navigation.navigate("Schedule", { date: bookingDetail.date });
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = () => {
    return (
      <View
        style={[
          styles.cardInsideLocation,
          {
            backgroundColor: themeColors.primary,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => openConfirmPickBooking()}
        >
          <HStack alignItems="center">
            <PaperAirplaneIcon size={20} color={"white"} />
            <Text marginLeft={3} style={{ color: "white", fontWeight: "bold" }}>
              Nhận chuyến
            </Text>
          </HStack>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {pickupPosition && destinationPosition && directions && (
            <Map
              directions={directions}
              setDistance={setDistance}
              distance={distance}
              duration={duration}
              setDuration={setDuration}
              isPickingSchedules={true}
              onCurrentTripPress={() => {
                panelRef.current.openLargePanel();
                // console.log("Current PRessed!");
              }}
              setIsLoading={setIsLoading}
            />
          )}
          {bookingDetail && (
            <SwipeablePanel
              isActive={true}
              fullWidth={true}
              noBackgroundOpacity
              // showCloseButton
              allowTouchOutside
              smallPanelItem={
                <Box px="6">
                  <BookingDetailSmallPanel
                    item={bookingDetail}
                    navigation={navigation}
                    actionButton={renderActionButton()}
                    // handlePickBooking={openConfirmPickBooking}
                  />
                </Box>
              }
              smallPanelHeight={360}
              // openLarge={openLargePanel}
              ref={panelRef}
              // largePanelHeight={680}
              scrollViewProps={{
                scrollEnabled: true,
              }}
            >
              <Box px="6">
                <BookingDetailPanel
                  customer={customer}
                  item={bookingDetail}
                  navigation={navigation}
                  // toggleBottomSheet={toggleBottomSheet}
                  duration={duration}
                  distance={distance}
                  // handlePickBooking={openConfirmPickBooking}
                  actionButton={renderActionButton()}
                />
              </Box>
            </SwipeablePanel>
          )}
          {/* )} */}
        </ErrorAlert>
      </View>

      <PickBookingDetailConfirmAlert
        key={"detail-screen"}
        confirmOpen={isConfirmOpen}
        setConfirmOpen={setIsConfirmOpen}
        item={bookingDetail}
        handleOkPress={handleConfirmPickBooking}
        pickingFee={pickingFee}
      />

      <View style={styles.footer}>{/* <BottomNavigationBar /> */}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  cardInsideLocation: {
    flexGrow: 1,
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
});

export default BookingDetailScreen;
