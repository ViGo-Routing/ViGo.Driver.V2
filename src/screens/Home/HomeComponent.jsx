import { memo, useCallback, useContext, useEffect, useState } from "react";
import WelcomeDriverHeader from "../../components/Header/WelcomeDriverHeader";
import { Box, FlatList, HStack, Heading, Text, View } from "native-base";
import { vigoStyles } from "../../../assets/theme";
import HomeTripInformationCard from "../../components/Card/HomeTripInformationCard";
import { useNavigation } from "@react-navigation/native";
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
import { FunnelIcon } from "react-native-heroicons/outline";
import FilterBookingModal from "./FilterBookingModal";

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

  // Filter
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [filterStartPickupTime, setFilterStartPickupTime] = useState(null);
  const [filterEndPickupTime, setFilterEndPickupTime] = useState(null);
  const [filterStartLocation, setFilterStartLocation] = useState(null);
  const [filterEndLocation, setFilterEndLocation] = useState(null);
  const [filterStartLocationRadius, setFilterStartLocationRadius] = useState(5);
  const [filterEndLocationRadius, setFilterEndLocationRadius] = useState(5);

  const pageSize = 10;

  const fetchRouteData = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const availableBookings = await getAvailableBookings(
        user.id,
        pageSize,
        1
      );
      const bookings = availableBookings.data;
      // console.log(availableBookings);

      setBookingsAvailable(bookings);
      // console.log(details.length);

      if (availableBookings.data.hasNextPage == true) {
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
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      let moreDataResponse = await getAvailableBookings(
        user.id,
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
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchRouteData();
    });

    return unsubscribe;
  }, []);

  const handleSendData = useCallback(
    (item) => {
      // navigation.navigate("DetailBooking", { item, user });
      navigation.navigate("DetailBooking", { bookingId: item.id });
      // console.log(item);
    },
    [bookingsAvailable]
  );

  const renderListItem = (item, index) => {
    return <BookingCard element={item} handleBookingClick={handleSendData} />;
  };

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

          {bookingsAvailable.length > 0 && (
            <HStack justifyContent="flex-end">
              <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                <HStack mx={2} marginTop="2" alignItems="center">
                  <FunnelIcon size={20} color={"black"} />

                  <Text marginLeft="3">Lọc hành trình</Text>
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
              return <>{renderListItem(item, index)}</>;
            }}
            ListEmptyComponent={
              <InfoAlert message="Không có hành trình nào còn trống" />
            }
            refreshing={isLoading}
            onRefresh={() => fetchRouteData()}
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
            modalVisible={filterModalVisible}
            setModalVisible={setFilterModalVisible}
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
            setIsLoading={setIsLoading}
            navigation={navigation}
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
