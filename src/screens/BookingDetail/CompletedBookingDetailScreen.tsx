import { useRoute } from "@react-navigation/native";
import { SafeAreaView, StyleSheet } from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import {
  Badge,
  Box,
  Center,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { useState, useEffect, useRef } from "react";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { getErrorMessage } from "../../utils/alertUtils";
import { getBookingDetail } from "../../services/bookingDetailService";
import MapView, { Marker, Region } from "react-native-maps";
import { generateMapPoint, googleMapsApi } from "../../utils/mapUtils";
import MapViewDirections from "react-native-maps-directions";
import { mapDirectionLine } from "../../components/Map/Map";
import { vndFormat } from "../../utils/numberUtils";
import { getBookingDetailTransactions } from "../../services/walletService";
import {
  EllipsisHorizontalIcon,
  MapPinIcon,
  StarIcon,
} from "react-native-heroicons/solid";
import { StarIcon as StarOutlineIcon } from "react-native-heroicons/outline";

import { getDifference } from "../../utils/datetimeUtils";
import moment from "moment";
import { getBookingDetailCustomer } from "../../services/userService";
import CustomerInformationCard from "../../components/Card/CustomerInformationCard";
import Accordion from "react-native-collapsible/Accordion";
import TransactionItem from "../../components/WalletTransaction/TransactionItem";
import {
  renderTransacionType,
  renderTransactionTypeOperator,
} from "../../utils/enumUtils/walletEnumUtils";

interface CompletedBookingDetailScreenProps {}

const CompletedBookingDetailScreen =
  ({}: CompletedBookingDetailScreenProps) => {
    const route = useRoute();
    const { bookingDetailId } = route.params as any;

    const [isLoading, setIsLoading] = useState(false);
    const { isError, setIsError, errorMessage, setErrorMessage } =
      useErrorHandlingHook();

    const [region, setRegion] = useState(null as unknown as Region);
    const [firstPosition, setFirstPosition] = useState(null as any);
    const [secondPosition, setSecondPosition] = useState(null as any);

    const [bookingDetail, setBookingDetail] = useState(null as any);
    const [transactions, setTransactions] = useState(null as any);

    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);

    const [customer, setCustomer] = useState(null as any);

    const mapRef = useRef();

    const getBookingDetailData = async () => {
      try {
        setIsLoading(true);
        const bookingDetailResponse = await getBookingDetail(bookingDetailId);
        setBookingDetail(bookingDetailResponse);

        const transactionsResponse = await getBookingDetailTransactions(
          bookingDetailId
        );
        setTransactions(transactionsResponse);
        // console.log(transactionsResponse);

        const customerResponse = await getBookingDetailCustomer(
          bookingDetailId
        );
        setCustomer(customerResponse);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const getRegion = (firstPosition: any, secondPosition: any) => {
      // const lastPoint = directions[-1];

      const { lat: currentFirstLat, lng: currentFirstLong } =
        firstPosition?.geometry?.location || {};
      const currentFirstCoords =
        currentFirstLat && currentFirstLong
          ? { latitude: currentFirstLat, longitude: currentFirstLong }
          : null;
      // const lastCoords = lastLat && lastLong ? {lastLat, lastLong} : null;
      const { lat: currentSecondLat, lng: currentSecondLong } =
        secondPosition?.geometry?.location || {};
      const currentSecondCoords =
        currentSecondLat && currentSecondLong
          ? { latitude: currentSecondLat, longitude: currentSecondLong }
          : null;

      let sumLat = currentFirstCoords?.latitude + currentSecondCoords?.latitude;
      let sumLong =
        currentFirstCoords?.longitude + currentSecondCoords?.longitude;

      let avgLat = sumLat / 2 || 0;
      let avgLong = sumLong / 2 || 0;
      return {
        latitude: avgLat - 0.003 || 10.762622,
        longitude: avgLong || 106.660172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      } as Region;
    };

    const fitMap = () => {
      // console.log(results);
      const coords = [
        {
          latitude: firstPosition?.geometry?.location.lat,
          longitude: firstPosition?.geometry?.location.lng,
        },
        {
          latitude: secondPosition?.geometry?.location.lat,
          longitude: secondPosition?.geometry?.location.lng,
        },
      ];
      // console.log(coords);
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: {
          top: 40,
          right: 20,
          bottom: 20,
          left: 20,
        },
      });
    };

    const handleDirectionReady = async (result: any) => {
      setDistance(result.distance);
      setDuration(result.duration);
    };

    const renderRateStar = (rate: number) => {
      let stars = [];
      for (let i = 0; i < 5; i++) {
        const starElement = (
          <Box>
            {i > rate - 1 ? (
              <StarOutlineIcon key={`star-${i}`} size={15} color="#FDCC0D" />
            ) : (
              <StarIcon key={`star-${i}`} size={15} color="#FDCC0D" />
            )}
          </Box>
        );
        stars.push(starElement);
      }

      return stars;
    };

    useEffect(() => {
      getBookingDetailData();
    }, []);

    useEffect(() => {
      if (bookingDetail) {
        const firstPosition = generateMapPoint(bookingDetail.startStation);
        const secondPosition = generateMapPoint(bookingDetail.endStation);

        setFirstPosition(firstPosition);
        setSecondPosition(secondPosition);

        const initialRegion = getRegion(firstPosition, secondPosition);
        setRegion(initialRegion);
      }
    }, [bookingDetail]);

    // Accordion
    const [activeSections, setActiveSections] = useState([] as any);
    // const renderSectionTitle = (section: any) => {
    //   return (
    //     <Box>
    //       <Text>{section.content}</Text>
    //     </Box>
    //   );
    // };

    const renderHeader = (section: any) => {
      return (
        <HStack justifyContent="space-between" alignItems="center" mx="5">
          <VStack>
            <Text bold fontSize={"3xl"} color={themeColors.primary}>
              {vndFormat(transactions.totalAmount)}
            </Text>
            <Text fontSize={"xs"}>Tổng tiền nhận được</Text>
          </VStack>

          <HStack>
            <EllipsisHorizontalIcon size={25} color={themeColors.primary} />
          </HStack>
        </HStack>
      );
    };

    const getTransactionColor = (transaction: any) => {
      if (renderTransactionTypeOperator(transaction.type) == "+") {
        return "green.600";
      }
      return "red.500";
    };

    const renderContent = (section: any) => {
      // console.log(
      //   transactions.transactions.map((transaction: any) => transaction.amount)
      // );

      return (
        <Box mt="3" pr="5">
          {transactions.transactions.map((transaction: any) => {
            return (
              <HStack key={transaction.id} justifyContent="flex-end" mb="2">
                {/* <Box width={"10%"}>
            {renderTransactionStatus(transaction.status, "list")}
          </Box> */}
                <Box>{renderTransacionType(transaction, "trip")}</Box>
                <Box paddingLeft={5} alignItems="flex-end">
                  <Text
                    bold
                    color={getTransactionColor(transaction)}
                    style={{ fontSize: 16 }}
                  >
                    {`${renderTransactionTypeOperator(
                      transaction.type
                    )}${vndFormat(transaction.amount)}`}
                  </Text>
                </Box>
              </HStack>
            );
          })}
        </Box>
      );
    };

    return (
      <SafeAreaView style={vigoStyles.container}>
        <Header title="Chi tiết chuyến đi" backButtonDirection="down" />
        {/* <Text>{trip.id}</Text> */}
        <View
          style={[
            vigoStyles.body,
            // { paddingTop: 5, paddingLeft: 0, paddingRight: 0 },
          ]}
        >
          <ViGoSpinner isLoading={isLoading} />

          <ErrorAlert isError={isError} errorMessage={errorMessage}>
            {bookingDetail &&
              firstPosition &&
              secondPosition &&
              region &&
              transactions && (
                <ScrollView>
                  <VStack>
                    {/* <HStack justifyContent="flex-end">
                      <Badge colorScheme="success">
                        <Text fontSize="sm">Đã hoàn thành</Text>
                      </Badge>
                    </HStack> */}

                    <View style={styles.container}>
                      {/* <View style={vigoStyles.textContainer}> */}
                      <Accordion
                        sections={[
                          {
                            title: "Tổng tiền",
                            content: transactions.totalAmount,
                          },
                        ]}
                        activeSections={activeSections}
                        // renderSectionTitle={renderSectionTitle}
                        renderHeader={renderHeader}
                        renderContent={renderContent}
                        onChange={setActiveSections}
                        touchableComponent={Pressable}
                      />

                      {/* </View> */}
                    </View>
                    {/* <Text alignSelf="flex-start">Mã chuyến đi</Text>
                    <Text alignSelf="flex-end">{bookingDetail.id}</Text> */}
                    {/* <Text>Mã chuyến đi: {bookingDetail.id}</Text> */}

                    <MapView
                      style={{ height: 200, ...styles.maps, marginTop: 20 }}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      scrollEnabled={false}
                      initialRegion={region}
                      zoomTapEnabled={false}
                      zoomControlEnabled={false}
                      rotateEnabled={false}
                      scrollDuringRotateOrZoomEnabled={false}
                      toolbarEnabled={false}
                      // loadingEnabled={true}
                      moveOnMarkerPress={false}
                      ref={mapRef}
                      onLayout={() => fitMap()}
                    >
                      <Box key={`markers`}>
                        <Marker
                          coordinate={{
                            latitude: firstPosition.geometry.location.lat,
                            longitude: firstPosition.geometry.location.lng,
                          }}
                          key={`first-position-marker`}
                          tappable={false}
                        >
                          <Image
                            size={"xs"}
                            resizeMode="contain"
                            source={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                            alt={"Điểm đi"}
                          />
                        </Marker>
                        <Marker
                          coordinate={{
                            latitude: secondPosition.geometry.location.lat,
                            longitude: secondPosition.geometry.location.lng,
                          }}
                          key={`second-position-marker`}
                          tappable={false}
                        >
                          <Image
                            size={"xs"}
                            resizeMode="contain"
                            source={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                            alt={"Điểm đến"}
                          />
                        </Marker>
                      </Box>

                      <Box key={`directions-booking`}>
                        <MapViewDirections
                          origin={{
                            latitude: firstPosition.geometry.location.lat,
                            longitude: firstPosition.geometry.location.lng,
                          }}
                          destination={{
                            latitude: secondPosition.geometry.location.lat,
                            longitude: secondPosition.geometry.location.lng,
                          }}
                          apikey={googleMapsApi}
                          strokeWidth={mapDirectionLine.primary.stroke}
                          strokeColor={mapDirectionLine.primary.color}
                          mode="DRIVING"
                          onReady={(result) => handleDirectionReady(result)}
                          key={`maps-directions`}
                          // lineDashPattern={[5, 5, 5, 5, 5]}
                          // tappable={true}
                          // onPress={() => {
                          //   panelRef.current.openLargePanel();
                          // }}
                        />
                      </Box>
                    </MapView>

                    <View style={styles.container}>
                      <VStack>
                        <HStack alignItems="center">
                          <MapPinIcon size={20} color={themeColors.primary} />
                          <VStack ml="2">
                            <Text color={themeColors.primary} bold>
                              Điểm đón
                            </Text>
                            <Text fontSize="md">
                              {bookingDetail.startStation.name}
                            </Text>
                          </VStack>
                        </HStack>
                        <HStack alignItems="center" mt="3">
                          <MapPinIcon size={20} color={themeColors.primary} />
                          <VStack ml="2">
                            <Text color={themeColors.primary} bold>
                              Điểm đến
                            </Text>
                            <Text fontSize="md">
                              {bookingDetail.endStation.name}
                            </Text>
                          </VStack>
                        </HStack>
                        <HStack alignSelf="flex-end">
                          <Text>
                            {distance.toFixed(1)} km -{" "}
                            {getDifference(
                              bookingDetail.pickupTime,

                              bookingDetail.dropoffTime
                            ).diffMinutes.toFixed(0)}{" "}
                            phút
                          </Text>
                        </HStack>
                      </VStack>
                    </View>

                    {bookingDetail.rate && (
                      <View style={styles.container} mt={5}>
                        <HStack
                          justifyContent={
                            bookingDetail.feedback ? "flex-start" : "center"
                          }
                        >
                          <VStack alignItems="center">
                            <Text pt="5">
                              <Text fontSize={"3xl"} bold>
                                {bookingDetail.rate}
                              </Text>
                              /5
                            </Text>
                            <HStack>{renderRateStar(4)}</HStack>
                          </VStack>
                          {bookingDetail.feedback && (
                            <VStack ml="5">
                              <Text>{bookingDetail.feedback}</Text>
                            </VStack>
                          )}
                        </HStack>
                      </View>
                    )}
                    <View style={styles.container} mt={5} mb={5}>
                      <CustomerInformationCard
                        customer={customer}
                        displayCall={false}
                      />
                    </View>
                    <Box backgroundColor="gray.200" p="2" mb="2">
                      <Center>Mã chuyến đi {bookingDetail.id}</Center>
                    </Box>
                  </VStack>
                </ScrollView>
              )}
          </ErrorAlert>
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  maps: {
    // position: "absolute",
    // top: 50,
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  container: {
    // flexDirection: "row",
    // alignItems: "center",
    padding: 10,
    // backgroundColor: themeColors.linear,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.25,
    elevation: 4,
  },
});

export default CompletedBookingDetailScreen;
