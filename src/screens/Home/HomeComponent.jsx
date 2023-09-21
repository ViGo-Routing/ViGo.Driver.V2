import { memo, useCallback, useContext, useEffect, useState } from "react";
import WelcomeDriverHeader from "../../components/Header/WelcomeDriverHeader";
import { Box, FlatList, HStack, Heading, Text, View } from "native-base";
import { vigoStyles } from "../../../assets/theme";
import HomeTripInformationCard from "../../components/Card/HomeTripInformationCard";
import { StackActions, useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getAvailableBookings } from "../../services/bookingService";
import { getErrorMessage } from "../../utils/alertUtils";
import BookingCard from "../../components/Card/BookingCard";
import InfoAlert from "../../components/Alert/InfoAlert";
import {
  getCurrentTrip,
  getUpcomingTrip,
} from "../../services/bookingDetailService";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { TouchableOpacity } from "react-native";
import { FunnelIcon as FunnelOutlineIcon } from "react-native-heroicons/outline";
import { FunnelIcon } from "react-native-heroicons/solid";
import FilterBookingModal, { filterKeys } from "./FilterBookingModal";
import { getData, removeItem, setData } from "../../utils/storageUtils";
import { useFilterBookingHook } from "../../hooks/useFilterBookingHook";

const HomeComponent = ({}) => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [bookingsAvailable, setBookingsAvailable] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const [currentTrip, setCurrentTrip] = useState(null);
  const [upcomingTrip, setUpcomingTrip] = useState(null);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const {
    filterStartDate,
    setFilterStartDate,
    filterEndDate,
    setFilterEndDate,
    filterStartPickupTime,
    setFilterStartPickupTime,
    filterEndPickupTime,
    setFilterEndPickupTime,
    filterStartLocation,
    setFilterStartLocation,
    filterEndLocation,
    setFilterEndLocation,
    filterStartLocationRadius,
    setFilterStartLocationRadius,
    filterEndLocationRadius,
    setFilterEndLocationRadius,
    isDate,
    setIsDate,
    isPickupTime,
    setIsPickupTime,
    isStartStation,
    setIsStartStation,
    isEndStation,
    setIsEndStation,
  } = useFilterBookingHook();

  const pageSize = 10;

  const fetchRouteData = useCallback(async () => {
    // console.log(isDate);
    try {
      const availableBookings = await getAvailableBookings(
        user.id,
        isDate,
        filterStartDate,
        filterEndDate,
        isPickupTime,
        filterStartPickupTime,
        filterEndPickupTime,
        isStartStation,
        filterStartLocation?.latitude,
        filterStartLocation?.longitude,
        filterStartLocationRadius,
        isEndStation,
        filterEndLocation?.latitude,
        filterEndLocation?.longitude,
        filterEndLocationRadius,
        pageSize,
        1
      );

      const bookings = availableBookings.data;
      console.log(availableBookings.totalPages);

      setBookingsAvailable(bookings);
      // console.log(details.length);

      if (availableBookings.hasNextPage == true) {
        setNextPageNumber(2);
      } else {
        setNextPageNumber(null);
      }

      const currentTrip = await getCurrentTrip(user.id);
      setCurrentTrip(currentTrip);
      if (currentTrip == null) {
        // Has no Current trip
        const upcomingTrip = await getUpcomingTrip(user.id);
        setUpcomingTrip(upcomingTrip);
      } else {
        navigation.navigate("CurrentStartingTrip", {
          bookingDetailId: currentTrip.id,
        });
      }
    } catch (err) {
      throw err;
    }
  }, [
    isDate,
    filterStartDate,
    filterEndDate,
    isPickupTime,
    filterStartPickupTime,
    filterEndPickupTime,
    isStartStation,
    filterStartLocation,
    filterStartLocationRadius,
    isEndStation,
    filterEndLocation,
    filterEndLocationRadius,
  ]);

  const loadMoreData = useCallback(async () => {
    // console.log(nextPageNumber);
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      // console.log("Load more");
      let moreDataResponse = await getAvailableBookings(
        user.id,
        isDate,
        filterStartDate,
        filterEndDate,
        isPickupTime,
        filterStartPickupTime,
        filterEndPickupTime,
        isStartStation,
        filterStartLocation?.latitude,
        filterStartLocation?.longitude,
        filterStartLocationRadius,
        isEndStation,
        filterEndLocation?.latitude,
        filterEndLocation?.longitude,
        filterEndLocationRadius,
        pageSize,
        nextPageNumber
      );

      const moreData = [...bookingsAvailable, ...moreDataResponse.data];

      setBookingsAvailable(moreData);

      if (moreDataResponse.hasNextPage == true) {
        setNextPageNumber(nextPageNumber + 1);
      } else {
        setNextPageNumber(null);
      }
    }
  }, [
    [
      nextPageNumber,
      isDate,
      filterStartDate,
      filterEndDate,
      isPickupTime,
      filterStartPickupTime,
      filterEndPickupTime,
      isStartStation,
      filterStartLocation,
      filterStartLocationRadius,
      isEndStation,
      filterEndLocation,
      filterEndLocationRadius,
    ],
  ]);

  const loadFilter = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      // setIsDate(await getData(filterKeys.isDate));
      setFilterStartDate(await getData(filterKeys.filterStartDate));
      setFilterEndDate(await getData(filterKeys.filterEndDate));
      // setIsPickupTime(await getData(filterKeys.isPickupTime));
      // console.log(await getData(filterKeys.isPickupTime));
      setFilterStartPickupTime(await getData(filterKeys.filterStartPickupTime));
      setFilterEndPickupTime(await getData(filterKeys.filterEndPickupTime));

      // setIsStartStation(await getData(filterKeys.isStartStation));
      setFilterStartLocation(await getData(filterKeys.filterStartStation));
      setFilterStartLocationRadius(
        (await getData(filterKeys.filterStartStationRadius)) ?? 5
      );

      // setIsEndStation(await getData(filterKeys.isEndStation));
      setFilterEndLocation(await getData(filterKeys.filterEndStation));
      setFilterEndLocationRadius(
        (await getData(filterKeys.filterEndStationRadius)) ?? 5
      );

      await fetchRouteData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // const unloadFilter = async () => {
  //   Object.keys(filterKeys).forEach(async (key, index) => {
  //     await removeItem(filterKeys[key]);
  //   });
  // };

  useEffect(() => {
    // const unsubscribe = navigation.addListener("focus", () => {
    //   loadFilter();
    // });
    loadFilter();

    return () => {
      // unsubscribe();
      // unloadFilter();
    };
  }, []);

  useEffect(() => {
    if (isFilterModalVisible === false && isConfirm === true) {
      loadFilter();
    }
  }, [isFilterModalVisible, isConfirm]);

  // useEffect(() => {
  //   console.log("STart: " + isStartStation);
  // }, [isStartStation]);

  const handleSendData = useCallback(
    (item) => {
      // navigation.navigate("DetailBooking", { item, user });
      navigation.navigate("DetailBooking", {
        bookingId: item.id,
        isDate,
        filterStartDate,
        filterEndDate,
        isPickupTime,
        filterStartPickupTime,
        filterEndPickupTime,
      });
      // console.log(item);
    },
    [
      isDate,
      filterStartDate,
      filterEndDate,
      isPickupTime,
      filterStartPickupTime,
      filterEndPickupTime,
      isStartStation,
      filterStartLocation,
      filterStartLocationRadius,
      isEndStation,
      filterEndLocation,
      filterEndLocationRadius,
    ]
  );

  const renderListItem = (item, index) => {
    return <BookingCard element={item} handleBookingClick={handleSendData} />;
  };

  const openFilterBookingModal = useCallback(() => {
    setIsFilterModalVisible(true);
  }, []);

  return (
    <>
      <View backgroundColor={"white"}>
        <WelcomeDriverHeader
          title={`Chào mừng ${user && user.name ? user.name : ""}`}
          // subtitle="..."
          onBack={() => navigation.goBack()}
        />
      </View>
      <View style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <Heading fontSize="2xl" marginTop="0" marginLeft="0">
            Các hành trình còn trống
          </Heading>

          {(bookingsAvailable.length > 0 || isConfirm === true) && (
            <HStack justifyContent="flex-end">
              <TouchableOpacity onPress={() => openFilterBookingModal()}>
                <HStack mx={2} marginTop="2" alignItems="center">
                  {(isDate || isPickupTime || isStartStation || isEndStation) &&
                    isConfirm === true && (
                      <>
                        <FunnelIcon size={20} color={"black"} />

                        <Text marginLeft="3">Đã áp dụng bộ lọc</Text>
                      </>
                    )}
                  {((!isDate &&
                    !isPickupTime &&
                    !isStartStation &&
                    !isEndStation) ||
                    !isConfirm) && (
                    <>
                      <FunnelOutlineIcon size={20} color={"black"} />

                      <Text marginLeft="3">Lọc hành trình</Text>
                    </>
                  )}
                </HStack>
              </TouchableOpacity>
            </HStack>
          )}
          <FlatList
            // style={vigoStyles.list}
            marginTop="3"
            // paddingBottom="5"
            // px="3"
            data={bookingsAvailable}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return renderListItem(item, index);
            }}
            ListEmptyComponent={
              <InfoAlert
                message={
                  (isDate || isPickupTime || isStartStation || isEndStation) &&
                  isConfirm
                    ? "Không có hành trình thỏa mãn bộ lọc"
                    : "Không có hành trình nào còn trống"
                }
              />
            }
            refreshing={isLoading}
            onRefresh={() => loadFilter()}
            onEndReached={loadMoreData}
            onScroll={() => {
              setOnScroll(true);
            }}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
              // paddingHorizontal: 20,
              paddingVertical: 5,
              paddingBottom: currentTrip || upcomingTrip ? 60 : 10,
            }}
          />
          <FilterBookingModal
            modalVisible={isFilterModalVisible}
            setModalVisible={setIsFilterModalVisible}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            setFilterStartDate={setFilterStartDate}
            setFilterEndDate={setFilterEndDate}
            filterStartPickupTime={filterStartPickupTime}
            setFilterStartPickupTime={setFilterStartPickupTime}
            filterEndPickupTime={filterEndPickupTime}
            setFilterEndPickupTime={setFilterEndPickupTime}
            filterStartLocation={filterStartLocation}
            setFilterStartLocation={setFilterStartLocation}
            filterStartLocationRadius={filterStartLocationRadius}
            setFilterStartLocationRadius={setFilterStartLocationRadius}
            filterEndLocation={filterEndLocation}
            setFilterEndLocation={setFilterEndLocation}
            filterEndLocationRadius={filterEndLocationRadius}
            setFilterEndLocationRadius={setFilterEndLocationRadius}
            isDate={isDate}
            setIsDate={setIsDate}
            isPickupTime={isPickupTime}
            setIsPickupTime={setIsPickupTime}
            isStartStation={isStartStation}
            setIsStartStation={setIsStartStation}
            isEndStation={isEndStation}
            setIsEndStation={setIsEndStation}
            setIsConfirm={setIsConfirm}
            setIsLoading={setIsLoading}
          />
        </ErrorAlert>
      </View>
      <HomeTripInformationCard
        currentTrip={currentTrip}
        upcomingTrip={upcomingTrip}
        navigation={navigation}
      />
    </>
  );
};

export default memo(HomeComponent);
