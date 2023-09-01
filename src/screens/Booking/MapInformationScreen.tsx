import { useState, useRef } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { NativeEventEmitter, StyleSheet } from "react-native";
import { eventNames } from "../../utils/alertUtils";
import {
  Box,
  Image,
  ScrollView,
  Text,
  HStack,
  VStack,
  Button,
} from "native-base";
import {
  ArrowLeftIcon,
  MapIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ClockIcon as ClockOutlineIcon } from "react-native-heroicons/outline";
import { SwipeablePanel } from "../../components/SwipeablePanel";
import {
  TripBasicInformation,
  TripFullInformation,
} from "../../components/TripInformation/TripInformation";
import { themeColors, vigoStyles } from "../../../assets/theme";
import MapViewDirections from "react-native-maps-directions";
import { googleMapsApi } from "../../utils/mapUtils";
import { mapDirectionLine } from "../../components/Map/Map";

interface MapInformationScreenProps {
  firstPosition: any;
  secondPosition: any;
}

const MapInformationScreen = (/*{
  firstPosition,
  secondPosition,
}: MapInformationScreenProps*/) => {
  const route = useRoute();
  const { firstPosition, secondPosition } = route.params as any;

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const navigation = useNavigation();

  const eventEmitter = new NativeEventEmitter();

  const getRegion = () => {
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

  const initialRegion = getRegion();

  const [region, setRegion] = useState(initialRegion);

  const panelRef = useRef(null as any);

  const handleDirectionReady = async (result: any) => {
    setDistance(result.distance);
    setDuration(result.duration);
  };

  const displayAddressDialog = (position: any) => {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      description: `${position.name}, ${position.formatted_address}`,
      status: "info",
      isDialog: true,
      primaryButtonText: "OK",
      displayCloseButton: false,
    });
  };

  const renderSmallTripInformation = () => {
    return (
      <Box>
        <TripBasicInformation
          firstPosition={firstPosition}
          secondPosition={secondPosition}
        />

        <Button
          style={vigoStyles.buttonWhite}
          onPress={() => {
            navigation.goBack();
          }}
          leftIcon={<ArrowLeftIcon size={20} color={themeColors.primary} />}
        >
          <Text style={vigoStyles.buttonWhiteText}>Quay lại</Text>
        </Button>
      </Box>
    );
  };

  const renderFullTripInformation = () => {
    return (
      <Box>
        <TripFullInformation
          firstPosition={firstPosition}
          secondPosition={secondPosition}
          duration={duration}
          distance={distance}
          // displayFull
        />
        <Button
          style={vigoStyles.buttonWhite}
          onPress={() => {
            navigation.goBack();
          }}
          leftIcon={<ArrowLeftIcon size={20} color={themeColors.primary} />}
        >
          <Text style={vigoStyles.buttonWhiteText}>Quay lại</Text>
        </Button>
      </Box>
    );
  };

  const mapRef = useRef();
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
        top: 0,
        right: 20,
        bottom: 80,
        left: 20,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      {/* <VStack> */}
      <Box flex={1} position="relative">
        <MapView
          style={{ minHeight: "80%", ...styles.maps }}
          initialRegion={initialRegion}
          ref={mapRef}
          // onLayout={() => fitMap()}
        >
          <Box key={`markers`}>
            <Marker
              coordinate={{
                latitude: firstPosition.geometry.location.lat,
                longitude: firstPosition.geometry.location.lng,
              }}
              key={`first-position-marker`}
              onPress={() => displayAddressDialog(firstPosition)}
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
              onPress={() => displayAddressDialog(secondPosition)}
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
              tappable={true}
              onPress={() => {
                panelRef.current.openLargePanel();
              }}
            />
          </Box>
        </MapView>
      </Box>

      <Box>
        <SwipeablePanel
          isActive={true}
          fullWidth={true}
          noBackgroundOpacity
          // showCloseButton
          allowTouchOutside
          smallPanelItem={<Box px="6">{renderSmallTripInformation()}</Box>}
          smallPanelHeight={300}
          // openLarge={openLargePanel}
          ref={panelRef}
          largePanelHeight={510}
          // onlySmall
        >
          {<Box px="6">{renderFullTripInformation()}</Box>}
        </SwipeablePanel>
      </Box>
      {/* </VStack> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  maps: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapInformationScreen;
