import { useRoute } from "@react-navigation/native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { getReport } from "../../services/reportService";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage } from "../../utils/alertUtils";
import { SafeAreaView } from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import {
  Badge,
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import {
  getReportStatus,
  getReportStatusBadgeColorScheme,
  getReportText,
} from "../../utils/enumUtils/reportEnumUtils";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  LightBulbIcon,
  RectangleStackIcon,
} from "react-native-heroicons/outline";
import {
  toVnDateString,
  toVnDateTimeString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { getBookingDetail } from "../../services/bookingDetailService";
import MapView, { Marker, Region } from "react-native-maps";
import { generateMapPoint, googleMapsApi } from "../../utils/mapUtils";
import MapViewDirections from "react-native-maps-directions";
import { mapDirectionLine } from "../../components/Map/Map";
import { StyleSheet } from "react-native";
import { MapPinIcon } from "react-native-heroicons/solid";
import CustomerInformationCard from "../../components/Card/CustomerInformationCard";
import { getBookingDetailCustomer } from "../../services/userService";

const ReportDetailScreen = () => {
  const route = useRoute();
  const { reportId } = route.params as any;

  const [loading, setLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const [report, setReport] = useState(null as any);
  const [bookingDetail, setBookingDetail] = useState(null as any);

  const [region, setRegion] = useState(null as unknown as Region);
  const [firstPosition, setFirstPosition] = useState(null as any);
  const [secondPosition, setSecondPosition] = useState(null as any);

  const mapRef = useRef();

  const [customer, setCustomer] = useState(null as any);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const reportResponse = await getReport(reportId);

      setReport(reportResponse);

      if (reportResponse.bookingDetailId) {
        const tripResponse = await getBookingDetail(
          reportResponse.bookingDetailId
        );
        setBookingDetail(tripResponse);

        const customerResponse = await getBookingDetailCustomer(
          reportResponse.bookingDetailId
        );
        setCustomer(customerResponse);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

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

  const fitMap = useCallback(() => {
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
  }, [firstPosition, secondPosition]);

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

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Chi tiết báo cáo" />
      <View style={[vigoStyles.body, { paddingHorizontal: 0 }]}>
        <ViGoSpinner isLoading={loading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {report && (
            <ScrollView>
              <HStack
                style={{ paddingHorizontal: 20 }}
                justifyContent="space-between"
              >
                <Badge colorScheme="info">{getReportText(report.type)}</Badge>
              </HStack>
              <HStack
                alignItems="center"
                mt="3"
                style={{ paddingHorizontal: 20 }}
              >
                <LightBulbIcon size={17} color={"black"} />
                <Text ml="2">
                  Tiêu đề: <Text bold>{report.title}</Text>
                </Text>
              </HStack>
              {report.content && (
                <HStack
                  alignItems="flex-start"
                  mt="3"
                  style={{ paddingHorizontal: 20 }}
                >
                  <RectangleStackIcon
                    style={{ marginTop: 5 }}
                    size={17}
                    color="black"
                  />
                  <Text ml="2" paddingRight="5">
                    Mô tả chi tiết: <Text bold>{report.content}</Text>
                  </Text>
                </HStack>
              )}

              {report.reviewerNote && (
                <HStack
                  alignItems="center"
                  mt="3"
                  style={{ paddingHorizontal: 20 }}
                >
                  <ChatBubbleLeftRightIcon size={17} color="black" />
                  <Text ml="2" paddingRight="5">
                    Ghi chú: <Text bold>{report.reviewerNote}</Text>
                  </Text>
                </HStack>
              )}
              <HStack
                justifyContent="space-between"
                mt="3"
                style={{ paddingHorizontal: 20 }}
              >
                <Text color={"#999"}>
                  {toVnDateTimeString(report.createdTime)}
                </Text>

                <Badge
                  variant="solid"
                  colorScheme={getReportStatusBadgeColorScheme(report.status)}
                >
                  {getReportStatus(report.status)}
                </Badge>
              </HStack>
              {bookingDetail && firstPosition && secondPosition && region && (
                <>
                  <Box mt="3" backgroundColor="gray.200" p="2" mb="2">
                    <Center>Mã chuyến đi {bookingDetail.id}</Center>
                  </Box>
                  <MapView
                    style={{ height: 200, marginTop: 10 }}
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
                        // onReady={(result) => handleDirectionReady(result)}
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

                      <HStack alignItems="center" mt="3">
                        <ClockIcon size={20} color={themeColors.primary} />
                        <VStack ml="2">
                          <Text color={themeColors.primary} bold>
                            Đón khách
                          </Text>
                          <Text fontSize="md">
                            {`${toVnTimeString(
                              bookingDetail.customerDesiredPickupTime
                            )}, ${toVnDateString(bookingDetail.date)}`}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </View>
                  <View style={styles.container} mt={5} mb={5}>
                    <CustomerInformationCard
                      customer={customer}
                      displayCall={false}
                    />
                  </View>
                </>
              )}
              <Box mt="3" backgroundColor="gray.200" p="2" mb="2">
                <Center>Mã báo cáo {report.id}</Center>
              </Box>
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
    marginHorizontal: 10,
    // backgroundColor: themeColors.linear,
    backgroundColor: themeColors.cardColor,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.25,
    elevation: 4,
  },
});

export default memo(ReportDetailScreen);
