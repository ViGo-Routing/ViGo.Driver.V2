import moment from "moment";
import { Badge, Box, HStack, Text, VStack, View } from "native-base";
import {
  getBookingDetailStatusColor,
  getBookingDetailStatusLongString,
} from "../../../utils/enumUtils/bookingEnumUtils";
import {
  ArrowPathRoundedSquareIcon,
  ClockIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import CustomerInformationCard from "../../../components/Card/CustomerInformationCard";
import { Linking, TouchableOpacity, PermissionsAndroid } from "react-native";
import { themeColors, vigoStyles } from "../../../../assets/theme";
import StepIndicator from "react-native-step-indicator";
import { toVnDateTimeString } from "../../../utils/datetimeUtils";
import {
  showFloatingBubble,
  hideFloatingBubble,
  requestPermission,
  initialize,
} from "react-native-floating-bubble";

const googleMapOpenUrl = ({ latitude, longitude, address }: any) => {
  const latLng = `${latitude},${longitude}`;
  return address
    ? `google.navigation:q=${address}`
    : `google.navigation:q=${latLng}`;
};

const renderActionButton = (
  item: any,
  handleActionButtonClick?: () => void,
  destination?: any
) => {
  // console.log("Render Action");
  // console.log(destination);
  const actionButtonText = () => {
    switch (item.status) {
      case "GOING_TO_PICKUP":
        return "Đã đến điểm đón";
      case "ARRIVE_AT_PICKUP":
        return "Đã đón khách";
      case "GOING_TO_DROPOFF":
        return "Đã đến nơi";
      default:
        return "";
    }
  };

  const handleGoogleMapsRoutingClick = async () => {
    // const permission =
    //   PermissionsAndroid.PERMISSIONS.ACTION_MANAGE_OVERLAY_PERMISSION;
    // const results = await PermissionsAndroid.request(permission);
    // // setIsLoading(false);
    // if (results == PermissionsAndroid.RESULTS.GRANTED) {
    // To display the bubble over other apps you need to get 'Draw Over Other Apps' permission from androind.
    // If you initialize without having the permission App could crash
    requestPermission()
      .then(() => {
        console.log("Permission Granted");
        // Initialize bubble manage
        initialize().then(() => console.log("Initialized the bubble mange"));

        Linking.openURL(googleMapOpenUrl(destination)).then(() => {
          hideFloatingBubble();

          showFloatingBubble(10, 10).then(() =>
            console.log("Floating Bubble Added")
          );
        });

        // Show Floating Bubble: x=10, y=10 position of the bubble
      })
      .catch(() => console.log("Permission is not granted"));

    // } else {
    //   console.log("Some permissions denied");
    //   // Handle the case where one or both permissions are denied
    // }
  };

  return (
    <HStack
      justifyContent={destination ? "space-between" : "flex-end"}
      alignItems="center"
      paddingTop="2"
    >
      {destination && (
        <TouchableOpacity
          onPress={() => {
            handleGoogleMapsRoutingClick();
          }}
        >
          <HStack alignItems="center">
            <ArrowPathRoundedSquareIcon size={20} color={themeColors.primary} />
            <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
              Mở Google Maps
            </Text>
          </HStack>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{ ...vigoStyles.buttonPrimary }}
        onPress={() => {
          // openConfirmPicking();
          handleActionButtonClick && handleActionButtonClick();
        }}
      >
        <HStack alignItems="center">
          <PaperAirplaneIcon size={20} color={"white"} />
          <Text marginLeft={2} style={{ ...vigoStyles.buttonPrimaryText }}>
            {actionButtonText()}
          </Text>
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
};

interface StartingTripBasicInformationProps {
  trip: any;
  duration: number;
  distance: number;
  currentStep: number;
  isInFull?: boolean;
  handleActionButtonClick?: () => void;
}

const StartingTripBasicInformation = ({
  trip,
  duration,
  distance,
  currentStep,
  isInFull,
  handleActionButtonClick,
}: StartingTripBasicInformationProps) => {
  const renderInformation = () => {
    let estimatedArriveTime;

    switch (trip.status) {
      case "ASSIGNED":
        return <></>;
      case "GOING_TO_PICKUP":
        estimatedArriveTime = moment()
          .add(duration, "minutes")
          .format("HH:mm")
          .toString();
        return (
          <>
            <HStack>
              <VStack alignItems="center">
                <MapPinIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Địa chỉ</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {`${trip.startStation.name}, ${trip.startStation.address}`}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="center">
              <VStack alignItems="center">
                <ClockIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Thời gian đến (dự kiến)</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {estimatedArriveTime}
                </Text>
              </VStack>
            </HStack>
            {!isInFull &&
              renderActionButton(trip, handleActionButtonClick, {
                latitude: trip.startStation.latitude,
                longitude: trip.startStation.longitude,
                address: trip.startStation.address,
              })}
          </>
        );
      case "ARRIVE_AT_PICKUP":
        return (
          <>
            <HStack>
              <VStack alignItems="center">
                <MapPinIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Địa chỉ</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {`${trip.startStation.name}, ${trip.startStation.address}`}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="center">
              <VStack alignItems="center">
                <ClockIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Thời gian ghi nhận</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  // width="95%"
                  paddingRight="0.5"
                  // maxWidth="95%"
                >
                  {toVnDateTimeString(new Date(trip.arriveAtPickupTime))}
                </Text>
              </VStack>
            </HStack>
            {!isInFull && renderActionButton(trip, handleActionButtonClick)}
          </>
        );
      case "GOING_TO_DROPOFF":
        estimatedArriveTime = moment()
          .add(duration, "minutes")
          .format("HH:mm")
          .toString();
        return (
          <>
            <HStack>
              <VStack alignItems="center">
                <MapPinIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Điểm trả khách</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {`${trip.endStation.name}, ${trip.endStation.address}`}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="center">
              <VStack alignItems="center">
                <ClockIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Thời gian đến (dự kiến)</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {estimatedArriveTime}
                </Text>
              </VStack>
            </HStack>
            {!isInFull &&
              renderActionButton(trip, handleActionButtonClick, {
                latitude: trip.endStation.latitude,
                longitude: trip.endStation.longitude,
                address: trip.endStation.address,
              })}
          </>
        );
        return <></>;
      case "ARRIVE_AT_DROPOFF":
        return <></>;
      default:
        return <></>;
    }
  };

  return <>{renderInformation()}</>;
};

interface StartingTripFullInformationProps {
  trip: any;
  duration: number;
  distance: number;
  customer: any;
  currentStep: number;
  handleActionButtonClick: () => void;
}

const StartingTripFullInformation = ({
  trip,
  duration,
  distance,
  customer,
  currentStep,
  handleActionButtonClick,
}: StartingTripFullInformationProps) => {
  const renderButtons = () => {
    switch (trip.status) {
      case "ASSIGNED":
        return <></>;
      case "GOING_TO_PICKUP":
        return renderActionButton(trip, handleActionButtonClick, {
          latitude: trip.startStation.latitude,
          longitude: trip.startStation.longitude,
          address: trip.startStation.address,
        });
      case "ARRIVE_AT_PICKUP":
        return renderActionButton(trip, handleActionButtonClick);
      case "GOING_TO_DROPOFF":
        return renderActionButton(trip, handleActionButtonClick, {
          latitude: trip.endStation.latitude,
          longitude: trip.endStation.longitude,
          address: trip.endStation.address,
        });
        return <></>;
      case "ARRIVE_AT_DROPOFF":
        return <></>;
      default:
        return <></>;
    }
  };

  return (
    <Box>
      <StartingTripBasicInformation
        trip={trip}
        duration={duration}
        distance={distance}
        currentStep={currentStep}
        isInFull={true}
      />
      <HStack mt="3">
        <VStack alignItems="center">
          <MapPinIcon size={24} color="#00A1A1" />
        </VStack>

        <VStack paddingLeft="3">
          <Text bold>Điểm trả khách</Text>
          <Text
            style={{
              paddingBottom: 5,
              fontSize: 15,
            }}
            width="95%"
            paddingRight="0.5"
            maxWidth="95%"
          >
            {`${trip.endStation.name}, ${trip.endStation.address}`}
          </Text>
        </VStack>
      </HStack>
      <Box mt="5">
        <CustomerInformationCard
          customer={customer}
          displayCustomerText
          displayCall
        />
      </Box>
      {renderButtons()}
    </Box>
  );
};

export { StartingTripBasicInformation, StartingTripFullInformation };
