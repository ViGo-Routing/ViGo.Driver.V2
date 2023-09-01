import React, { useState, useContext, useEffect, useCallback } from "react";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import {
  NativeEventEmitter,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Text,
  VStack,
  View,
} from "native-base";
import Header from "../../components/Header/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  eventNames,
  getErrorMessage,
  handleError,
} from "../../utils/alertUtils";
import { getBooking } from "../../services/bookingService";
import {
  getAvailableBookingDetailsByBooking,
  getBookingDetailPickFee,
  pickBookingDetails,
} from "../../services/bookingDetailService";
import { UserContext } from "../../context/UserContext";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import RefreshableScrollView from "../../components/List/RefreshableScrollView";
import CustomerInformationCard from "../../components/Card/CustomerInformationCard";
import {
  ArrowLongRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  FunnelIcon,
  MapIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import Divider from "../../components/Divider/Divider";
import { vndFormat } from "../../utils/numberUtils";
import {
  getDayOfWeek,
  toVnDateString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { distinct } from "../../utils/arrayUtils";
import CheckBox from "@react-native-community/checkbox";
import {
  InformationCircleIcon,
  FunnelIcon as FunnelOutlineIcon,
} from "react-native-heroicons/outline";
import FilterTripModal from "./FilterTripModal";
import InfoAlert from "../../components/Alert/InfoAlert";
import { generateMapPoint } from "../../utils/mapUtils";
import { PickBookingDetailConfirmAlert } from "../BookingDetail/BookingDetailPanel";
import BookingDetailSmallCard from "../../components/Card/BookingDetailSmallCard";

const DetailBookingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinner, setIsSpinner] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const route = useRoute();
  const { bookingId } = route.params as any;
  // console.log(bookingId);
  const { user } = useContext(UserContext);

  const navigation = useNavigation() as any;

  const [booking, setBooking] = useState(null as any);
  const [availableDetails, setAvailableDetails] = useState([] as Array<any>);
  const [displayDetails, setDisplayDetails] = useState([] as Array<any>);
  const [customer, setCustomer] = useState(null as any);

  const [selectedDetails, setSelectedDetails] = useState([] as Array<string>);
  // const [selectedCount, setSelectedCount] = useState(0);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [daysOfWeek, setDaysOfWeek] = useState([] as Array<string>);
  const [filterDaysOfWeek, setFilterDaysOfWeek] = useState([] as Array<string>);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pickingFee, setPickingFee] = useState(0);

  const eventEmitter = new NativeEventEmitter();

  const fetchBookingData = async () => {
    setIsLoading(true);
    try {
      const bookingResponse = await getBooking(bookingId);
      setBooking(bookingResponse);
      setCustomer(bookingResponse.customer);

      const detailsResponse = await getAvailableBookingDetailsByBooking(
        user.id,
        bookingId,
        -1,
        1
      );

      let data = detailsResponse.data.map((item: any) => {
        return {
          ...item,
          dayOfWeek: getDayOfWeek(item.date),
        };
      });

      let daysOfWeek = detailsResponse.data
        .map((item: any) => getDayOfWeek(item.date))
        .filter(distinct)
        .sort();

      setDaysOfWeek(daysOfWeek);

      setAvailableDetails(data);
      setDisplayDetails(data);

      // console.log(daysOfWeek);
      // console.log(data);

      setFilterDaysOfWeek([]);

      // let selected = {} as any;
      // detailsResponse.data.forEach((item: any) => {
      //   selected[`${item.id}`] = false;
      // });

      setSelectedDetails([]);
      // setSelectedCount(0);
      // console.log(selected);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const handleClickOnTrip = useCallback(
    (selected: boolean, bookingDetailId: string) => {
      setIsLoading(true);
      try {
        // console.log(selectedDetails);

        // let newSelected = [...selectedDetails];
        // // newSelected[`${bookingDetailId}`] = selected;

        // if (selected == true) {
        //   newSelected.push(bookingDetailId);
        // } else {
        //   const index = newSelected.indexOf(bookingDetailId);
        //   if (index >= 0) {
        //     newSelected.splice(index, 1);
        //   }
        // }
        // setSelectedDetails(newSelected);

        if (selected == true) {
          setSelectedDetails((prev) => [...prev, bookingDetailId]);
        } else {
          setSelectedDetails(
            selectedDetails.filter((id) => id !== bookingDetailId)
          );
        }
      } catch (error) {
        handleError("Có lỗi xảy ra", error);
      } finally {
        setIsLoading(false);
      }

      // console.log(temp);
    },
    [availableDetails]
  );

  useEffect(() => {
    console.log(selectedDetails);
    setIsSelectedAll(selectedDetails.length == displayDetails.length);
  }, [selectedDetails]);

  const handleClickOnSelectAll = (selected: boolean) => {
    let newSelected = [] as Array<string>;
    if (selected == true) {
      newSelected = displayDetails.map((item) => item.id);
    } else {
      newSelected = [];
    }
    setSelectedDetails(newSelected);
    setIsSelectedAll(selected);
  };

  const renderDetailCard = (item: any) => {
    // console.log("Render: " + selectedDetails.length);
    return (
      <BookingDetailSmallCard
        item={item}
        navigation={navigation}
        selectedDetails={selectedDetails}
        handleClickOnTrip={handleClickOnTrip}
        key={`card-${item.id}`}
      />
    );
  };

  const handleLocationPress = (title: string, station: any) => {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      title: title,
      description: `${station.name}, ${station.address}`,
      status: "info",
      // placement: "top-right",
      isDialog: true,
      primaryButtonText: "OK",
      displayCloseButton: false,
    });
  };

  // Modal
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleFilterSelect = (selectedOptions: Array<string>) => {
    selectedOptions.sort();
    setFilterDaysOfWeek(selectedOptions);
    // setSelectedCount(0);
    setSelectedDetails([]);
    setIsSelectedAll(false);
    // console.log(selectedOptions);
    if (selectedOptions.length == 0) {
      setDisplayDetails(availableDetails);
    } else {
      let filteredTrips = availableDetails.filter((trip) =>
        selectedOptions.includes(trip.dayOfWeek)
      );
      setDisplayDetails(filteredTrips);
    }
  };

  const openConfirmPicking = async () => {
    try {
      setIsSpinner(true);
      if (selectedDetails.length == 0) {
        throw new Error("Không có chuyến đi nào được chọn!");
      }
      const bookingDetailId = selectedDetails[0];

      const pickingFee = await getBookingDetailPickFee(bookingDetailId);
      setPickingFee(pickingFee);
      setIsConfirmOpen(true);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsSpinner(false);
    }
  };

  const handlePickTrips = async () => {
    try {
      setIsSpinner(true);
      if (selectedDetails.length == 0) {
        throw new Error("Không có chuyến đi nào được chọn!");
      }

      const response = await pickBookingDetails(selectedDetails);
      if (response && response.errorMessage) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: "Xác nhận chuyến đi",
          description: (
            <>
              <Text>
                Bạn vừa nhận {response.successBookingDetailIds.length} chuyến đi
                thành công!
              </Text>
              <Text marginTop="2">{response.errorMessage}</Text>
            </>
          ),
          status: "warning",
          // placement: "top",
          primaryButtonText: "Đã hiểu",
          isDialog: true,
        });
        await fetchBookingData();
      } else if (response && !response.errorMessage) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: `Bạn vừa nhận ${response.successBookingDetailIds.length} chuyến đi thành công!`,
          description:
            /*(
            <>
              <Text>
                Bạn vừa nhận {response.successBookingDetailIds.length} chuyến đi
                thành công!
              </Text>
            </>
          ),*/ "",
          status: "success",
          placement: "top",
          // primaryButtonText: "Đã hiểu",
          // isDialog: true,
          isSlide: true,
          duration: 5000,
        });

        const firstTrip = displayDetails.filter(
          (trip: any) => trip.id === selectedDetails[0]
        )[0];

        navigation.navigate("Schedule", { date: firstTrip.date });
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsSpinner(false);
    }
  };

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Chi tiết hành trình" />

      <View style={vigoStyles.body}>
        <ViGoSpinner isLoading={isSpinner} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <RefreshableScrollView
            refreshing={isLoading}
            onRefresh={fetchBookingData}
          >
            {booking && (
              <VStack>
                <Box
                  rounded="full"
                  bgColor={"white"}
                  borderColor="coolGray.200"
                  borderWidth="1"
                  px={5}
                  py={3}
                  mt={2}
                  mx={0.5}
                  borderRadius={20}
                  shadow={3}
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleLocationPress(
                        "Thông tin điểm đón",
                        booking.customerRoute.startStation
                      )
                    }
                  >
                    <HStack alignItems="center" justifyContent="space-between">
                      <HStack>
                        <VStack alignSelf="center">
                          <MapPinIcon size={25} color="#00A1A1" />
                        </VStack>

                        <VStack
                          // alignItems="center"
                          // justifyContent="center"
                          marginLeft="3"
                        >
                          <Text fontSize="sm" color={themeColors.primary} bold>
                            Điểm đón
                          </Text>

                          <Text
                            style={{
                              // paddingLeft: 5,
                              paddingBottom: 5,
                              fontSize: 15,
                            }}
                            bold
                            isTruncated
                            // width={"50%"}
                            // width="95%"
                          >
                            {`${booking.customerRoute.startStation.name}`}
                          </Text>
                        </VStack>
                      </HStack>
                      <Box>
                        <InformationCircleIcon
                          color={themeColors.primary}
                          size={20}
                        />
                      </Box>
                    </HStack>
                  </TouchableOpacity>

                  <Divider style={{}} />
                  <TouchableOpacity
                    onPress={() =>
                      handleLocationPress(
                        "Thông tin điểm đến",
                        booking.customerRoute.endStation
                      )
                    }
                  >
                    <HStack
                      marginTop="2"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <HStack>
                        <VStack alignSelf="center">
                          <MapPinIcon size={25} color="#00A1A1" />
                        </VStack>

                        <VStack
                          // alignItems="center"
                          // justifyContent="center"
                          marginLeft="3"
                        >
                          <Text fontSize="sm" color={themeColors.primary} bold>
                            Điểm đến
                          </Text>

                          <Text
                            style={{
                              // paddingLeft: 5,
                              paddingBottom: 5,
                              fontSize: 15,
                            }}
                            bold
                            isTruncated
                            // width={"50%"}
                          >
                            {`${booking.customerRoute.endStation.name}`}
                          </Text>
                        </VStack>
                      </HStack>
                      <Box>
                        <InformationCircleIcon
                          color={themeColors.primary}
                          size={20}
                        />
                      </Box>
                    </HStack>
                  </TouchableOpacity>
                </Box>

                <HStack justifyContent="flex-end" mt="3">
                  <Button
                    style={vigoStyles.buttonWhite}
                    onPress={() => {
                      navigation.navigate("MapInformation", {
                        firstPosition: generateMapPoint(
                          booking.customerRoute.startStation
                        ),
                        secondPosition: generateMapPoint(
                          booking.customerRoute.endStation
                        ),
                      });
                    }}
                    leftIcon={<MapIcon size={20} color={themeColors.primary} />}
                  >
                    <Text style={vigoStyles.buttonWhiteText}>
                      Xem trên bản đồ
                    </Text>
                  </Button>
                </HStack>
                <Box marginTop="6">
                  <Heading fontSize="2xl" marginLeft="0">
                    Khách hàng
                  </Heading>
                  <Box
                    rounded="full"
                    bgColor={"white"}
                    borderColor="coolGray.200"
                    borderWidth="1"
                    // p={5}
                    px={5}
                    py={3}
                    mt={2}
                    borderRadius={20}
                    mx={0.5}
                    shadow={3}
                  >
                    <CustomerInformationCard
                      displayCustomerText={false}
                      customer={customer}
                    />
                  </Box>
                </Box>
                <Box marginTop="6">
                  <Heading fontSize="2xl" marginLeft="0">
                    Các chuyến đi còn trống
                  </Heading>
                  <Box
                    borderWidth="1"
                    borderColor={themeColors.primary}
                    p={2}
                    mt={2}
                    borderRadius={10}
                    alignSelf={"flex-end"}
                    mx={0.5}
                  >
                    <HStack>
                      <HStack alignItems="center">
                        <ArrowLongRightIcon size={25} color="black" />
                        <Text p={1} bold>
                          Một chiều
                        </Text>
                      </HStack>
                      <HStack marginLeft="5" alignItems="center">
                        <CalendarDaysIcon size={25} color="black" />
                        <Text p={1} bold>
                          Theo tháng
                        </Text>
                      </HStack>
                    </HStack>
                  </Box>
                  {availableDetails.length > 0 ? (
                    <>
                      <TouchableOpacity
                        onPress={() => setFilterModalVisible(true)}
                      >
                        <HStack mx={2} marginTop="2" alignItems="center">
                          {filterDaysOfWeek.length === daysOfWeek.length ||
                          filterDaysOfWeek.length === 0 ? (
                            <>
                              <FunnelOutlineIcon size={20} color={"black"} />
                              <Text marginLeft="3">Hiển thị tất cả</Text>
                            </>
                          ) : (
                            <>
                              <FunnelIcon size={20} color={"black"} />

                              <Text marginLeft="3">
                                {filterDaysOfWeek.join(", ")}
                              </Text>
                            </>
                          )}
                        </HStack>
                      </TouchableOpacity>
                      <HStack
                        mx={0.5}
                        marginTop="2"
                        justifyContent="space-between"
                      >
                        <HStack alignItems="center">
                          <CheckBox
                            // alignSelf="stretch"
                            // marginRight={2}
                            aria-label="Chọn chuyến đi"
                            value={isSelectedAll}
                            key={"select-all"}
                            style={{ marginRight: 5 }}
                            onValueChange={(value) =>
                              handleClickOnSelectAll(value)
                            }
                          />
                          <Text>Chọn tất cả</Text>
                        </HStack>
                        <Text>{`Đã chọn ${selectedDetails.length}/${displayDetails.length}`}</Text>
                      </HStack>
                      <VStack mx={0.5}>
                        {displayDetails.map((item) => (
                          <React.Fragment key={item.id}>
                            {renderDetailCard(item)}
                          </React.Fragment>
                        ))}
                      </VStack>
                    </>
                  ) : (
                    <Box mt={2}>
                      <InfoAlert message="Không có chuyến đi nào còn trống" />
                    </Box>
                  )}
                </Box>
              </VStack>
            )}
          </RefreshableScrollView>
          <FilterTripModal
            modalVisible={filterModalVisible}
            initialSelectedOptions={filterDaysOfWeek}
            setModalVisible={setFilterModalVisible}
            onModalRequestClose={() => {}}
            onModalConfirm={handleFilterSelect}
            options={daysOfWeek.map((day) => {
              return {
                text: day,
                value: day,
              };
            })}
          />
          {selectedDetails.length > 0 && (
            <HStack justifyContent="flex-end" paddingTop="2">
              <TouchableOpacity
                style={{ ...vigoStyles.buttonPrimary }}
                onPress={() => {
                  openConfirmPicking();
                }}
                disabled={selectedDetails.length == 0}
              >
                <HStack alignItems="center">
                  <PaperAirplaneIcon size={20} color={"white"} />
                  <Text
                    marginLeft={2}
                    style={{ ...vigoStyles.buttonPrimaryText }}
                  >
                    Nhận chuyến
                  </Text>
                </HStack>
              </TouchableOpacity>
            </HStack>
          )}
        </ErrorAlert>
        <PickBookingDetailConfirmAlert
          key={"detail-booking-screen"}
          confirmOpen={isConfirmOpen}
          setConfirmOpen={setIsConfirmOpen}
          item={null}
          items={selectedDetails}
          handleOkPress={handlePickTrips}
          pickingFee={pickingFee}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardInsideDateTime: {
    // flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    // width: "100%",
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    // flexDirection: "row",
    // margin: 5,
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
  titlePrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export default DetailBookingScreen;
