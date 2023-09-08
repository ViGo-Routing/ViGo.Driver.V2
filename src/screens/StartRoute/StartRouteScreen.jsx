import React, { useEffect, useState, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  NativeEventEmitter,
} from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import { themeColors } from "../../../assets/theme/index";
import Map from "../../components/Map/Map";
import { getRouteById } from "../../services/routeService";
import {
  cancelBookingDetail,
  getBookingDetail,
  getCancelFee,
  pickBookingDetailById,
  updateStatusBookingDetail,
} from "../../services/bookingDetailService";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { UserContext } from "../../context/UserContext";
import { generateMapPoint } from "../../utils/mapUtils";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { SwipeablePanel } from "../../components/SwipeablePanel";
import BookingDetailPanel, {
  BookingDetailSmallPanel,
  CancelBookingDetailConfirmAlert,
} from "../BookingDetail/BookingDetailPanel";
import { eventNames, getErrorMessage } from "../../utils/alertUtils";
import { Box, HStack, Text } from "native-base";
import { getBookingDetailCustomer } from "../../services/userService";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
import StartRouteConfirmAlert from "./StartRouteAlerts";

const StartRouteScreen = () => {
  const navigation = useNavigation();
  const [isViewVisible, setViewVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const route = useRoute();
  const { item } = route.params;
  const { user } = useContext(UserContext);

  const [customer, setCustomer] = useState({});
  const [duration, setDuration] = useState({});
  const [distance, setDistance] = useState({});

  const [bookingDetail, setBookingDetail] = useState(null);
  const panelRef = useRef(null);

  const [directions, setDirections] = useState(null);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelFee, setCancelFee] = useState(0);

  const eventEmitter = new NativeEventEmitter();

  const getBookingDetailData = async () => {
    setIsLoading(true);
    try {
      const bookingDetailId = item.id;
      // console.log(bookingDetailId);
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      // console.log(bookingDetailResponse);
      setBookingDetail(bookingDetailResponse);

      console.log(bookingDetailResponse.status);
      if (bookingDetailResponse.status != "ASSIGNED") {
        if (bookingDetailResponse.status == "CANCELLED") {
          // navigation.navigate("CanceledBookingDetail", {
          //   bookingDetailId: bookingDetailResponse.id,
          // });
          navigation.reset({
            index: 1,
            routes: [
              {
                name: "Home",
                // params: {
                //   bookingDetailId: bookingDetail.id,
                // },
              },
              {
                name: "CanceledBookingDetail",
                params: {
                  bookingDetailId: bookingDetail.id,
                },
              },
            ],
          });
        } else if (bookingDetailResponse.status == "COMPLETED") {
          // navigation.navigate("CompletedBookingDetail", {
          //   bookingDetailId: bookingDetailResponse.id,
          // });
          navigation.reset({
            index: 1,
            routes: [
              {
                name: "Home",
                // params: {
                //   bookingDetailId: bookingDetail.id,
                // },
              },
              {
                name: "CompletedBookingDetail",
                params: {
                  bookingDetailId: bookingDetail.id,
                },
              },
            ],
          });
        } else {
          // navigation.navigate("CurrentStartingTrip", {
          //   bookingDetailId: bookingDetailResponse.id,
          // });

          navigation.reset({
            index: 1,
            routes: [
              {
                name: "Home",
                // params: {
                //   bookingDetailId: bookingDetail.id,
                // },
              },
              {
                name: "CurrentStartingTrip",
                params: {
                  bookingDetailId: bookingDetail.id,
                },
              },
            ],
          });
        }

        return;
      }

      setPickupPosition(generateMapPoint(bookingDetailResponse.startStation));

      setDestinationPosition(
        generateMapPoint(bookingDetailResponse.endStation)
      );

      const customerResponse = await getBookingDetailCustomer(bookingDetailId);
      setCustomer(customerResponse);

      let driverSchedules = [
        {
          firstPosition: generateMapPoint(bookingDetailResponse.startStation),
          secondPosition: generateMapPoint(bookingDetailResponse.endStation),
          bookingDetailId: bookingDetailId,
        },
      ];

      setDirections(driverSchedules);
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookingDetailData();
  }, []);

  const handleStartRoute = async () => {
    setIsLoading(true);
    try {
      const time = new Date();

      const requestData = {
        bookingDetailId: item.id,
        status: "GOING_TO_PICKUP",
        time: time.toISOString(),
      };
      await updateStatusBookingDetail(item.id, requestData).then((response) => {
        if (response && response.data) {
          eventEmitter.emit(eventNames.SHOW_TOAST, {
            title: "Xác nhận chuyến đi",
            description: (
              <>
                <Text>
                  Bắt đầu chuyến thành công. Bạn hãy đi đón khách đúng giờ nhé!
                </Text>
              </>
            ),
            status: "success",
            // placement: "top",
            primaryButtonText: "Đã hiểu",
            isDialog: true,
            onOkPress: () => {
              navigation.navigate("CurrentStartingTrip", {
                bookingDetailId: item.id,
              });
            },
          });
          // navigation.navigate("PickCus", { response });
          // Alert.alert(
          //   "Xác nhận nhận chuyến đi",
          //   `Bạn hãy đi đón khách đúng giờ nhé!`,
          //   [
          //     {
          //       text: "OK",
          //       onPress: () => {
          //       },
          //     },
          //   ]
          // );
        } else {
          throw new Error("Không bắt đầu được chuyến đi!");
        }
      });
    } catch (error) {
      // console.error("Tài xế bắt đầu chuyến đi", error);
      // Alert.alert("Tài xế bắt đầu", "Bắt đầu không thành công");
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmStartTrip = async () => {
    try {
      setIsLoading(true);
      setIsConfirmOpen(true);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmCancelTrip = async () => {
    try {
      setIsLoading(true);
      const bookingDetailId = bookingDetail.id;
      const cancelFee = await getCancelFee(bookingDetailId);
      setCancelFee(cancelFee);
      setIsCancelConfirmOpen(true);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancelTrip = async () => {
    // const bookingId = bookingDetail.bookingId;

    try {
      setIsLoading(true);
      const response = await cancelBookingDetail(bookingDetail.id);
      if (response) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          // title: "Xác nhận chuyến đi",
          title: "Hủy chuyến thành công!",
          description: "",
          status: "success",
          // placement: "top",
          // isDialog: true,
          isSlide: true,
          duration: 5000,
        });
        // navigation.navigate("Schedule", { date: bookingDetail.date });
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Home",
              // params: {
              //   bookingDetailId: bookingDetail.id,
              // },
            },
          ],
        });
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
          // style={styles.assignButton}
          onPress={() => openConfirmStartTrip()}
        >
          <HStack alignItems="center">
            <PaperAirplaneIcon size={20} color={"white"} />
            <Text ml={2} style={{ color: "white", fontWeight: "bold" }}>
              Bắt đầu chuyến đi
            </Text>
          </HStack>
        </TouchableOpacity>
      </View>
    );
  };

  // console.log(bookingDetail?.id);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {pickupPosition && destinationPosition && directions && (
            <Map
              directions={directions}
              isPickingSchedules={false}
              setIsLoading={setIsLoading}
              isViewToStartTrip={true}
              setDistance={setDistance}
              setDuration={setDuration}
              onCurrentTripPress={() => {
                panelRef.current.openLargePanel();
                // console.log("Current PRessed!");
              }}
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
                    // handlePickBooking={openConfirmPickBooking}
                    actionButton={renderActionButton()}
                  />
                </Box>
              }
              smallPanelHeight={360}
              // openLarge={openLargePanel}
              ref={panelRef}
              // largePanelHeight={680}
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
                  onCancelClick={openConfirmCancelTrip}
                />
              </Box>
            </SwipeablePanel>
          )}
        </ErrorAlert>
      </View>
      {bookingDetail && duration && (
        <>
          <StartRouteConfirmAlert
            key={"start-route-alert"}
            confirmOpen={isConfirmOpen}
            setConfirmOpen={setIsConfirmOpen}
            // item={bookingDetail}
            handleOkPress={() => {
              handleStartRoute();
            }}
            // pickingFee={pickingFee}
            pickupTime={bookingDetail.customerDesiredPickupTime}
            duration={duration}
            tripDate={bookingDetail.date}
          />

          <CancelBookingDetailConfirmAlert
            key={"cancel-trip-modal"}
            confirmOpen={isCancelConfirmOpen}
            setConfirmOpen={setIsCancelConfirmOpen}
            handleOkPress={() => handleConfirmCancelTrip()}
            cancelFee={cancelFee}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    flexDirection: "row",
    // flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    // paddingHorizontal: 20,
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
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    paddingLeft: 10,
  },
  list: {
    paddingTop: 20,
    fontSize: 20,
  },
});

export default StartRouteScreen;
