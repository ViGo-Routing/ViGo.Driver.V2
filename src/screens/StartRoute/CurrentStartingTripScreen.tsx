import { useState, useEffect } from "react";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import {
  getBookingDetail,
  updateStatusBookingDetail,
} from "../../services/bookingDetailService";
import { getBookingDetailCustomer } from "../../services/userService";
import {
  eventNames,
  getErrorMessage,
  handleError,
} from "../../utils/alertUtils";
import { generateMapPoint } from "../../utils/mapUtils";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, Button, Image, Text, View } from "native-base";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import Map from "../../components/Map/Map";
import {
  StyleSheet,
  BackHandler,
  DeviceEventEmitter,
  NativeEventEmitter,
} from "react-native";
import { SwipeablePanel } from "../../components/SwipeablePanel";
import {
  StartingTripBasicInformation,
  StartingTripFullInformation,
} from "./components/StartingTripInformation";
import { getBookingStatusStepNumber } from "../../utils/enumUtils/bookingEnumUtils";
import StepIndicator from "react-native-step-indicator";
import { themeColors } from "../../../assets/theme";
import Geolocation from "react-native-geolocation-service";
import SignalRService from "../../utils/signalRUtils";
import moment from "moment";
import { hideFloatingBubble } from "react-native-floating-bubble";
import invokeApp from "react-native-invoke-app";
import CreateReportModal from "./components/CreateReportModal";
import { createReport } from "../../services/reportService";

interface CurrentStartingTripScreenProps {
  bookingDetailId: string;
}

const CurrentStartingTripScreen = () => {
  const route = useRoute();
  const { bookingDetailId } = route.params as any;

  const [bookingDetail, setBookingDetail] = useState(null as any);
  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const [customer, setCustomer] = useState(null as any);

  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const [directions, setDirections] = useState(null as any);

  const [firstPosition, setFirstPosition] = useState(null as any);
  const [destinationPosition, setDestinationPosition] = useState(null as any);

  const [activeStep, setActiveStep] = useState(0);

  const [firstPositionIcon, setFirstPositionIcon] = useState(<></>);
  const [secondPositionIcon, setSecondPositionIcon] = useState(<></>);

  const navigation = useNavigation();

  const eventEmitter = new NativeEventEmitter();

  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [createReportModalVisible, setCreateReportModalVisible] =
    useState(false);
  let driverLocationTimer: NodeJS.Timeout = {} as NodeJS.Timeout;

  const getBookingDetailData = async () => {
    setIsLoading(true);
    try {
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      // console.log(bookingDetailResponse);
      setBookingDetail(bookingDetailResponse);

      const customerResponse = await getBookingDetailCustomer(bookingDetailId);
      setCustomer(customerResponse);
      // console.log(bookingDetailResponse.status);
    } catch (error) {
      // console.error(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDriverLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setDriverLocation({
          latitude: latitude,
          longitude: longitude,
        });
        // setIsLoading(false);
      },
      (error) => {
        handleError("Có lỗi xảy ra", error, navigation);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    if (bookingDetail) {
      setActiveStep(getBookingStatusStepNumber(bookingDetail.status));

      switch (bookingDetail.status) {
        case "ASSIGNED":
          break;
        case "GOING_TO_PICKUP":
          setDestinationPosition(generateMapPoint(bookingDetail.startStation));
          break;
        case "ARRIVE_AT_PICKUP":
          setFirstPosition(generateMapPoint(bookingDetail.startStation));
          setDestinationPosition(generateMapPoint(bookingDetail.endStation));
          break;
        case "GOING_TO_DROPOFF":
          setDestinationPosition(generateMapPoint(bookingDetail.endStation));
          break;
        case "ARRIVE_AT_DROPOFF":
          break;
        default:
          // handleError("Trạng thái chuyến đi không hợp lệ", "")
          setErrorMessage("Trạng thái chuyến đi không hợp lệ");
          setIsError(true);
          break;
      }

      if (
        bookingDetail &&
        (bookingDetail.status == "GOING_TO_PICKUP" ||
          bookingDetail.status == "GOING_TO_DROPOFF")
      ) {
        handleGetDriverLocation();

        driverLocationTimer = setInterval(() => {
          handleGetDriverLocation();
        }, 5000);
      }
    }

    return () => {
      if (driverLocationTimer) {
        clearInterval(driverLocationTimer);
      }
    };
  }, [bookingDetail]);

  useEffect(() => {
    if (firstPosition && destinationPosition) {
      let driverSchedules = [
        {
          firstPosition: firstPosition,
          secondPosition: destinationPosition,
          bookingDetailId: bookingDetailId,
        },
      ];
      // console.log(driverSchedules);
      setDirections(driverSchedules);
    }
  }, [firstPosition, destinationPosition]);

  useEffect(() => {
    const focus_unsub = navigation.addListener("focus", () => {
      getBookingDetailData();
      hideFloatingBubble();
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    const backToApp = DeviceEventEmitter.addListener(
      "floating-bubble-press",
      (e) => {
        invokeApp();
        hideFloatingBubble();
      }
    );

    return () => {
      focus_unsub();
      backHandler.remove();
      backToApp.remove();
    };
  }, []);

  useEffect(() => {
    if (driverLocation && driverLocation.latitude && driverLocation.longitude) {
      const driverPosition = {
        geometry: {
          location: {
            lat: driverLocation.latitude,
            lng: driverLocation.longitude,
          },
        },
        name: "Vị trí hiện tại của bạn",
        formatted_address: "",
      };

      if (bookingDetail) {
        SignalRService.sendLocationUpdate(
          bookingDetail.id,
          driverLocation.latitude,
          driverLocation.longitude
        );

        if (
          bookingDetail.status == "GOING_TO_PICKUP" ||
          bookingDetail.status == "GOING_TO_DROPOFF"
        ) {
          setFirstPosition(driverPosition);
        }
      }
    }
  }, [driverLocation]);

  const handleActionButtonClick = async () => {
    setIsLoading(true);
    try {
      const time = moment().format("YYYY-MM-DDTHH:mm:ss");

      let updatedStatus = "";
      // console.log(bookingDetail.status);
      switch (bookingDetail.status) {
        case "GOING_TO_PICKUP":
          updatedStatus = "ARRIVE_AT_PICKUP";
          break;
        case "ARRIVE_AT_PICKUP":
          updatedStatus = "GOING_TO_DROPOFF";
          break;
        case "GOING_TO_DROPOFF":
          updatedStatus = "ARRIVE_AT_DROPOFF";
          break;
        default:
          updatedStatus = "";
          break;
      }

      const requestData = {
        bookingDetailId: bookingDetail.id,
        status: updatedStatus,
        time: time.toString(),
      };

      // console.log(requestData);
      const response = await updateStatusBookingDetail(
        bookingDetail.id,
        requestData
      );

      if (response && response.data) {
        if (driverLocationTimer) {
          clearInterval(driverLocationTimer);
        }
        if (updatedStatus == "ARRIVE_AT_DROPOFF") {
          // navigation.navigate("Home");/
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
          await getBookingDetailData();
        }
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error, navigation);
    } finally {
      setIsLoading(false);
    }
  };

  const getPanelFullHeight = () => {
    switch (bookingDetail.status) {
      case "GOING_TO_PICKUP":
        return 630;
      case "ARRIVE_AT_PICKUP":
        return 630;
      case "GOING_TO_DROPOFF":
        return 630;
      default:
        return 600;
    }
  };

  const renderMap = (
    status: string,
    firstPosition: any,
    destinationPosition: any,
    directions: any
  ) => {
    switch (status) {
      case "ASSIGNED":
        return <></>;
      case "GOING_TO_PICKUP":
        return (
          <Map
            directions={directions}
            setDistance={setDistance}
            setDuration={setDuration}
            isPickingSchedules={false}
            onCurrentTripPress={() => {}}
            setIsLoading={setIsLoading}
            isViewToStartTrip={true}
            firstPositionIcon={
              <Image
                size={"xs"}
                resizeMode="contain"
                source={require("../../../assets/icons/vigobike.png")}
                alt={"Điểm đi"}
              />
            }
            secondPositionIcon={
              <Image
                size={"xs"}
                resizeMode="contain"
                source={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                alt={"Điểm đến"}
              />
            }
          />
        );
      case "ARRIVE_AT_PICKUP":
        return (
          <Map
            directions={directions}
            setDistance={setDistance}
            setDuration={setDuration}
            isPickingSchedules={false}
            onCurrentTripPress={() => {}}
            setIsLoading={setIsLoading}
            isViewToStartTrip={true}
            firstPositionIcon={
              <Image
                size={"xs"}
                resizeMode="contain"
                source={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                alt={"Điểm đi"}
              />
            }
            secondPositionIcon={
              <Image
                size={"xs"}
                resizeMode="contain"
                source={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                alt={"Điểm đến"}
              />
            }
            showCurrentLocation
          />
        );
      case "GOING_TO_DROPOFF":
        return (
          <Map
            directions={directions}
            setDistance={setDistance}
            setDuration={setDuration}
            isPickingSchedules={false}
            onCurrentTripPress={() => {}}
            setIsLoading={setIsLoading}
            isViewToStartTrip={true}
            firstPositionIcon={
              <Image
                size={"xs"}
                resizeMode="contain"
                source={require("../../../assets/icons/vigobike.png")}
                alt={"Điểm đi"}
              />
            }
            secondPositionIcon={
              <Image
                size={"xs"}
                resizeMode="contain"
                source={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                alt={"Điểm đến"}
              />
            }
            showCurrentLocation
          />
        );
      case "ARRIVE_AT_DROPOFF":
        break;
      default:
        // handleError("Trạng thái chuyến đi không hợp lệ", "")
        setErrorMessage("Trạng thái chuyến đi không hợp lệ");
        setIsError(true);
        break;
    }
  };

  const handleOpenReportModal = () => {
    setCreateReportModalVisible(true);
  };

  const handleReportModalConfirm = async (
    reportType: "BOOKER_NOT_COMING" | "OTHER",
    title: string,
    description: string
  ) => {
    if (!title || title.length < 5) {
      handleError(
        "Thiếu thông tin",
        "Tiêu đề báo cáo phải có ít nhất 5 kí tự!",
        navigation
      );
    } else {
      try {
        setIsLoading(true);
        const report = await createReport(
          reportType,
          title,
          description,
          bookingDetail.id
        );

        if (report) {
          eventEmitter.emit(eventNames.SHOW_TOAST, {
            title: "Tạo báo cáo thành công",
            description: (
              <Text>
                Báo cáo của bạn đã được gửi đi thành công! Hãy đợi các QTV xem
                xét nhé.
              </Text>
            ),
            status: "success",
            // placement: "top",
            primaryButtonText: "Đã hiểu",
            isDialog: true,
            onOkPress: () => {
              setCreateReportModalVisible(false);
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            },
          });
        }
      } catch (error) {
        handleError("Có lỗi xảy ra", error, navigation);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {firstPosition &&
            destinationPosition &&
            directions &&
            renderMap(
              bookingDetail.status,
              firstPosition,
              destinationPosition,
              directions
            )}

          {bookingDetail && (
            <>
              <SwipeablePanel
                isActive={true}
                fullWidth={true}
                noBackgroundOpacity
                // showCloseButton
                allowTouchOutside
                smallPanelItem={
                  <>
                    <Box mx="2">
                      <StepIndicator
                        customStyles={stepIndicatorCustomStyles}
                        currentPosition={activeStep}
                        labels={stepIndicatorData.map((item) => item.label)}
                        // direction="horizontal"
                        stepCount={stepIndicatorData.length}
                      />
                    </Box>
                    <Box px="6" mt="2">
                      <StartingTripBasicInformation
                        trip={bookingDetail}
                        // navigation={navigation}
                        // actionButton={renderActionButton()}
                        duration={duration}
                        distance={distance}
                        currentStep={activeStep}
                        handleActionButtonClick={handleActionButtonClick}
                        // handlePickBooking={openConfirmPickBooking}
                        handleReportButtonClick={handleOpenReportModal}
                      />
                    </Box>
                  </>
                }
                // smallPanelHeight={380}
                // largePanelHeight={getPanelFullHeight()}
                scrollViewProps={{
                  scrollEnabled: true,
                }}
              >
                <>
                  <Box mx="2">
                    <StepIndicator
                      customStyles={stepIndicatorCustomStyles}
                      currentPosition={activeStep}
                      labels={stepIndicatorData.map((item) => item.label)}
                      stepCount={stepIndicatorData.length}
                    />
                  </Box>
                  <Box px="6" mt="2">
                    <StartingTripFullInformation
                      trip={bookingDetail}
                      duration={duration}
                      distance={distance}
                      currentStep={activeStep}
                      customer={customer}
                      handleActionButtonClick={handleActionButtonClick}
                      handleReportButtonClick={handleOpenReportModal}
                    />
                  </Box>
                </>
              </SwipeablePanel>
              <CreateReportModal
                modalVisible={createReportModalVisible}
                setModalVisible={setCreateReportModalVisible}
                onModalRequestClose={() => {}}
                onModalConfirm={handleReportModalConfirm}
                startStationName={bookingDetail?.startStation.name}
              />
            </>
          )}
        </ErrorAlert>
      </View>
    </View>
  );
};

const stepIndicatorData = [
  {
    label: "Đang đón khách",
    // status: "Đang đến điểm đón",
    // dateTime: `${time}`,
  },
  {
    label: "Đã đến điểm đón",
    // status: "Bạn hãy đưa khách đến điểm trả",
    // dateTime: `${time}`,
  },
  {
    label: "Đang di chuyển",
    // status: "Bạn đang đưa khách đến điểm trả",
    // dateTime: `${time}`,
  },
  {
    label: "Đã đến điểm trả",
    // status: "Xác nhận trả khách thành công",
    // dateTime: `${time}`,
  },
];

const stepIndicatorCustomStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: themeColors.primary,
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: themeColors.primary,
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: themeColors.primary,
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: themeColors.primary,
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 16,
  stepIndicatorLabelCurrentColor: themeColors.primary,
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 12,
  currentStepLabelColor: themeColors.primary,
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

export default CurrentStartingTripScreen;
