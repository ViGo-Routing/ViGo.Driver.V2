import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  NativeEventEmitter,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import MapViewDirections from "react-native-maps-directions";
import { createRoute } from "../../services/routeService";
import { useNavigation } from "@react-navigation/native";
import {
  Badge,
  Box,
  HStack,
  Image,
  Popover,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { themeColors } from "../../../assets/theme";
import { googleMapsApi } from "../../utils/mapUtils";
import { eventNames, handleError } from "../../utils/alertUtils";
import { getBookingDetail } from "../../services/bookingDetailService";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { ClockIcon as ClockOutlineIcon } from "react-native-heroicons/outline";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { SwipeablePanel } from "../SwipeablePanel";
import BookingDetailPanel from "../../screens/BookingDetail/BookingDetailPanel";
import { getBookingDetailCustomer } from "../../services/userService";
import {
  TripFullInformation,
  TripTransition,
} from "../TripInformation/TripInformation";

interface MapDirections {
  firstPosition: any;
  secondPosition: any;
  bookingDetailId: string;
  // strokeColor: string;
  // strokeWidth: number;
}

interface MapProps {
  directions: Array<MapDirections>;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  // distance: {};
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  // duration: {};
  isPickingSchedules: boolean | null;
  isViewToStartTrip: boolean | null;
  onCurrentTripPress: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  firstPositionIcon?: any;
  secondPositionIcon?: any;
  showCurrentLocation?: boolean;
  tracksViewChanges?: boolean;
}

export const mapDirectionLine = {
  primary: {
    color: themeColors.primary,
    stroke: 5,
  },
  dashed: {
    // color: "#95B1B0",
    color: "#F97B22",
    stroke: 3.5,
  },
  secondary: {
    color: "#5DD8D8",
    stroke: 4,
  },
};

const Map = ({
  directions,
  setDistance,
  // distance,
  setDuration,
  // duration,
  isPickingSchedules = false,
  isViewToStartTrip = false,
  onCurrentTripPress = () => {},
  setIsLoading,
  firstPositionIcon,
  secondPositionIcon,
  showCurrentLocation = false,
  tracksViewChanges = false,
}: MapProps) => {
  const eventEmitter = new NativeEventEmitter();
  const navigation = useNavigation();

  const getRegion = () => {
    const currentPoint = isPickingSchedules ? directions[1] : directions[0];
    // const lastPoint = directions[-1];

    const { lat: currentFirstLat, lng: currentFirstLong } =
      currentPoint.firstPosition?.geometry?.location || {};
    const currentFirstCoords =
      currentFirstLat && currentFirstLong
        ? { latitude: currentFirstLat, longitude: currentFirstLong }
        : null;
    // const lastCoords = lastLat && lastLong ? {lastLat, lastLong} : null;
    const { lat: currentSecondLat, lng: currentSecondLong } =
      currentPoint.secondPosition?.geometry?.location || {};
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

  const dashPattern = [5, 5];

  const initialRegion = getRegion();

  // console.log(initialRegion);

  const [region, setRegion] = useState(initialRegion);

  const [distances, setDistances] = useState({});
  const [durations, setDurations] = useState({});
  var tempDistance = {} as any,
    tempDuration = {} as any;
  // const [trips, setTrips] = useState(null);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [markerRefs, setMarkerRefs] = useState([]);

  useEffect(() => {
    setRegion(getRegion());
  }, [directions]);

  const handleDirectionsReady = async (
    result: any,
    directionIndex: string | number
  ) => {
    if (directionIndex == "current") {
      setDistance(result.distance);
      setDuration(result.duration);
    } else {
      tempDistance[`${directionIndex}`] = result.distance;
      // console.log(distance);
      setDistances(tempDistance);

      tempDuration[`${directionIndex}`] = result.duration;
      // console.log(duration);
      setDurations(tempDuration);
    }
  };

  const displayAddressDialog = (position: any) => {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      // title: "Đăng nhập không thành công",
      description: `${position.name}, ${position.formatted_address}`,
      status: "info",
      // placement: "top-right",
      isDialog: true,
      primaryButtonText: "OK",
      displayCloseButton: false,
    });
  };

  const renderMarkers = (directions: Array<MapDirections>) => {
    let markerCount = 0;
    const directionsCount = directions.filter(
      (direction) => direction != null
    ).length;

    let newMarkerRefs = [];

    return directions.map((direction, index) => {
      let currentRefLength = newMarkerRefs.length;
      newMarkerRefs[currentRefLength] = useRef(null);
      newMarkerRefs[currentRefLength + 1] = useRef(null);

      return (
        direction && (
          <Box key={`markers-${index}`}>
            {direction.firstPosition && (
              <Marker
                coordinate={{
                  latitude: direction.firstPosition.geometry.location.lat,
                  longitude: direction.firstPosition.geometry.location.lng,
                }}
                key={`first-position-marker-${index}-${Date.now()}`}
                onPress={() => displayAddressDialog(direction.firstPosition)}
                // icon={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                tracksViewChanges={tracksViewChanges}
              >
                {/* <HStack> */}
                {firstPositionIcon && firstPositionIcon}
                {!firstPositionIcon && (
                  <Image
                    size={"xs"}
                    resizeMode="contain"
                    source={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                    alt={"Điểm đi"}
                  />
                )}
                {directionsCount > 1 && (
                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    // mb={-4}
                    // mr={-4}
                    zIndex={1}
                    variant="solid"
                    // alignSelf="flex-end"
                    _text={{
                      fontSize: 15,
                    }}
                  >
                    {++markerCount}
                  </Badge>
                )}
              </Marker>
              // </Pressable>
            )}
            {direction.secondPosition && (
              <Marker
                coordinate={{
                  latitude: direction.secondPosition.geometry.location.lat,
                  longitude: direction.secondPosition.geometry.location.lng,
                }}
                // image={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                key={`second-position-marker-${index}-${Date.now()}`}
                onPress={() => displayAddressDialog(direction.secondPosition)}
                tracksViewChanges={tracksViewChanges}
              >
                {secondPositionIcon && secondPositionIcon}
                {!secondPositionIcon && (
                  <Image
                    size={"xs"}
                    resizeMode="contain"
                    source={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                    alt={"Điểm đến"}
                  />
                )}
                {directionsCount > 1 && (
                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    zIndex={1}
                    variant="solid"
                    // alignSelf="flex-end"
                    _text={{
                      fontSize: 15,
                    }}
                  >
                    {++markerCount}
                  </Badge>
                )}
              </Marker>
            )}
          </Box>
        )
      );
    });
  };

  const onDirectionPress = async (
    bookingDetailId: string,
    tripName: string = "",
    index: string | number
  ) => {
    setIsLoading(true);
    try {
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      if (isPickingSchedules) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: tripName
            ? `Thông tin chuyến đi - ${tripName}`
            : "Thông tin chuyến đi",
          description: (
            <TripFullInformation
              item={bookingDetailResponse}
              distance={distances[`${index}`]}
              duration={durations[`${index}`]}
              customer={null}
            />
          ),
          status: "info",
          // placement: "top-right",
          isDialog: true,
          primaryButtonText: "OK",
          displayCloseButton: false,
          size: "xl",
        });
      } else {
        setSelectedIndex(index);
        setBookingDetail(bookingDetailResponse);
        const customer = await getBookingDetailCustomer(bookingDetailId);
        setCustomer(customer);
        setIsPanelActive(true);
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDashedPress = (
    firstPoint: any,
    secondPoint: any,
    index: string | number
  ) => {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      title: "Thông tin đường đi",
      description: (
        <TripTransition
          firstPoint={firstPoint}
          secondPoint={secondPoint}
          duration={durations[`${index}`]}
          distance={distances[`${index}`]}
        />
      ),
      status: "info",
      // placement: "top-right",
      isDialog: true,
      primaryButtonText: "OK",
      displayCloseButton: false,
      size: "xl",
    });
  };

  const renderDirections = (
    directions: Array<MapDirections>,
    isPickingSchedules: boolean | undefined = false
  ) => {
    if (isPickingSchedules) {
      const previousTrip = directions[0];
      const currentTrip = directions[1];
      const nextTrip = directions[2];

      return (
        currentTrip &&
        currentTrip.firstPosition &&
        currentTrip.secondPosition && (
          <Box key={`directions-picking-bookingdetails`}>
            <MapViewDirections
              origin={{
                latitude: currentTrip.firstPosition.geometry.location.lat,
                longitude: currentTrip.firstPosition.geometry.location.lng,
              }}
              destination={{
                latitude: currentTrip.secondPosition.geometry.location.lat,
                longitude: currentTrip.secondPosition.geometry.location.lng,
              }}
              apikey={googleMapsApi}
              strokeWidth={mapDirectionLine.primary.stroke}
              strokeColor={mapDirectionLine.primary.color}
              mode="DRIVING"
              onReady={(result) => handleDirectionsReady(result, "current")}
              key={`maps-directions-curent`}
              // lineDashPattern={[5, 5, 5, 5, 5]}
              tappable={true}
              onPress={() => {
                onCurrentTripPress();
              }}
            />
            {previousTrip && (
              <>
                <MapViewDirections
                  origin={{
                    latitude: previousTrip.firstPosition.geometry.location.lat,
                    longitude: previousTrip.firstPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: previousTrip.secondPosition.geometry.location.lat,
                    longitude:
                      previousTrip.secondPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.secondary.stroke}
                  strokeColor={mapDirectionLine.secondary.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, "previous")
                  }
                  key={`maps-directions-previous`}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDirectionPress(
                      previousTrip.bookingDetailId,
                      "Chuyến đi trước đó",
                      "previous"
                    );
                  }}
                  // lineDashPattern={[5, 5, 5, 5, 5]}
                />
                <MapViewDirections
                  origin={{
                    latitude: previousTrip.secondPosition.geometry.location.lat,
                    longitude:
                      previousTrip.secondPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: currentTrip.firstPosition.geometry.location.lat,
                    longitude: currentTrip.firstPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.dashed.stroke}
                  strokeColor={mapDirectionLine.dashed.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, "previous-dashed")
                  }
                  key={`maps-directions-previous-dashed`}
                  lineDashPattern={dashPattern}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDashedPress(
                      previousTrip.secondPosition,
                      currentTrip.firstPosition,
                      "previous-dashed"
                    );
                  }}
                />
              </>
            )}
            {nextTrip && (
              <>
                <MapViewDirections
                  origin={{
                    latitude: nextTrip.firstPosition.geometry.location.lat,
                    longitude: nextTrip.firstPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: nextTrip.secondPosition.geometry.location.lat,
                    longitude: nextTrip.secondPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.secondary.stroke}
                  strokeColor={mapDirectionLine.secondary.color}
                  mode="DRIVING"
                  onReady={(result) => handleDirectionsReady(result, "next")}
                  key={`maps-directions-previous`}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDirectionPress(
                      nextTrip.bookingDetailId,
                      "Chuyến đi tiếp sau đó",
                      "next"
                    );
                  }}
                  // lineDashPattern={[5, 5, 5, 5, 5]}
                />
                <MapViewDirections
                  origin={{
                    latitude: currentTrip.secondPosition.geometry.location.lat,
                    longitude: currentTrip.secondPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: nextTrip.firstPosition.geometry.location.lat,
                    longitude: nextTrip.firstPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.dashed.stroke}
                  strokeColor={mapDirectionLine.dashed.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, "next-dashed")
                  }
                  key={`maps-directions-previous-dashed`}
                  lineDashPattern={dashPattern}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDashedPress(
                      currentTrip.secondPosition,
                      nextTrip.firstPosition,
                      "next-dashed"
                    );
                  }}
                />
              </>
            )}
          </Box>
        )
      );
    } else if (isViewToStartTrip) {
      const currentTrip = directions[0];
      // console.log(currentTrip);
      // console.log(currentTrip.firstPosition);
      return (
        currentTrip &&
        currentTrip.firstPosition &&
        currentTrip.secondPosition && (
          <Box key={`directions-view-bookingdetails`}>
            <MapViewDirections
              origin={{
                latitude: currentTrip?.firstPosition?.geometry?.location.lat,
                longitude: currentTrip?.firstPosition?.geometry?.location.lng,
              }}
              destination={{
                latitude: currentTrip?.secondPosition?.geometry?.location.lat,
                longitude: currentTrip?.secondPosition?.geometry?.location.lng,
              }}
              apikey={googleMapsApi}
              strokeWidth={mapDirectionLine.primary.stroke}
              strokeColor={mapDirectionLine.primary.color}
              mode="DRIVING"
              onReady={(result) => handleDirectionsReady(result, "current")}
              key={`maps-directions-curent`}
              // lineDashPattern={[5, 5, 5, 5, 5]}
              tappable={true}
              onPress={() => {
                onCurrentTripPress();
              }}
            />
          </Box>
        )
      );
    } else {
      return directions.map((direction, index, array) => {
        let previousTrip: MapDirections | null = null;

        if (index > 0) {
          // Has preivous trip
          previousTrip = array[index - 1];
        }

        return (
          direction &&
          direction.firstPosition &&
          direction.secondPosition && (
            <Box key={`directions-${index}`}>
              <MapViewDirections
                origin={{
                  latitude: direction.firstPosition.geometry.location.lat,
                  longitude: direction.firstPosition.geometry.location.lng,
                }}
                destination={{
                  latitude: direction.secondPosition.geometry.location.lat,
                  longitude: direction.secondPosition.geometry.location.lng,
                }}
                apikey={googleMapsApi}
                strokeWidth={mapDirectionLine.primary.stroke}
                strokeColor={mapDirectionLine.primary.color}
                mode="DRIVING"
                key={`maps-directions-${index}`}
                onReady={(result) => handleDirectionsReady(result, index)}
                tappable={true}
                onPress={() => {
                  onDirectionPress(direction.bookingDetailId, "", index);
                }}
                // lineDashPattern={[5, 5, 5, 5, 5]}
              />
              {previousTrip && (
                <MapViewDirections
                  origin={{
                    latitude: previousTrip.secondPosition.geometry.location.lat,
                    longitude:
                      previousTrip.secondPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: direction.firstPosition.geometry.location.lat,
                    longitude: direction.firstPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.dashed.stroke}
                  strokeColor={mapDirectionLine.dashed.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, `previous-dashed-${index}`)
                  }
                  key={`maps-directions-previous-dashed-${index}`}
                  lineDashPattern={dashPattern}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDashedPress(
                      previousTrip.secondPosition,
                      direction.firstPosition,
                      `previous-dashed-${index}`
                    );
                  }}
                />
              )}
            </Box>
          )
        );
      });
    }
  };

  // console.log(firstPositionIcon);
  const mapRef = useRef();

  const fitMap = () => {
    // console.log(results);
    const coords = directions
      .map((direction: any) => {
        if (direction == null) {
          return [];
        }
        return [
          {
            latitude: direction.firstPosition?.geometry?.location.lat,
            longitude: direction.firstPosition?.geometry?.location.lng,
          },
          {
            latitude: direction.secondPosition?.geometry?.location.lat,
            longitude: direction.secondPosition?.geometry?.location.lng,
          },
        ];
      })
      .flat();
    // const coords = [
    //   {
    //     latitude: firstPosition?.geometry?.location.lat,
    //     longitude: firstPosition?.geometry?.location.lng,
    //   },
    //   {
    //     latitude: secondPosition?.geometry?.location.lat,
    //     longitude: secondPosition?.geometry?.location.lng,
    //   },
    // ];
    // console.log(coords);
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: {
        top: 0,
        right: 5,
        bottom: 50,
        left: 5,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation={showCurrentLocation}
        // onLayout={() => fitMap()}
        ref={mapRef}

        // loadingEnabled={true}
      >
        {renderMarkers(directions)}
        {renderDirections(directions, isPickingSchedules)}
      </MapView>
      {!isPickingSchedules && (
        <SwipeablePanel
          isActive={isPanelActive}
          fullWidth={true}
          noBackgroundOpacity
          showCloseButton
          allowTouchOutside
          smallPanelHeight={360}
          openLarge={true}
          onClose={() => setIsPanelActive(false)}
        >
          <Box px="6">
            <BookingDetailPanel
              customer={customer}
              item={bookingDetail}
              navigation={navigation}
              // toggleBottomSheet={toggleBottomSheet}
              duration={durations[`${selectedIndex}`]}
              distance={distances[`${selectedIndex}`]}
              displayButtons={false}
            />
          </Box>
        </SwipeablePanel>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
