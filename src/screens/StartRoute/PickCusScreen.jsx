import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { themeColors } from "../../../assets/theme";
// import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import StepIndicator from "react-native-step-indicator";
import { updateStatusBookingDetail } from "../../services/bookingDetailService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import Geolocation from "@react-native-community/geolocation";
import SignalRService from "../../utils/signalRUtils";

const time = new Date();
const data = [
  {
    label: "Bắt đầu chuyến đi",
    status: "Đang đến điểm đón",
    dateTime: `${time}`,
  },
  {
    label: "Rước khách thành công",
    status: "Bạn hãy đưa khách đến điểm trả",
    dateTime: `${time}`,
  },
  {
    label: "Đang di chuyển",
    status: "Bạn đang đưa khách đến điểm trả",
    dateTime: `${time}`,
  },
  {
    label: "Đã đến điểm trả",
    status: "Xác nhận trả khách thành công",
    dateTime: `${time}`,
  },
];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: themeColors.primary,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: themeColors.primary,
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: themeColors.primary,
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: themeColors.primary,
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: themeColors.primary,
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: themeColors.primary,
};

const PickCusScreen = () => {
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const { response } = route.params;
  console.log("responseresponseresponse", response.data);

  useEffect(() => {
    const locationUpdateInterval = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          SignalRService.sendLocationUpdate(
            response.data.id,
            latitude,
            longitude
          );
        },
        (error) => console.error(error),
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    }, 5000);

    return () => {
      clearInterval(locationUpdateInterval);
    };
  }, []);

  const handlArrivePickUp = async () => {
    setIsLoading(true);
    try {
      const time = new Date();
      const status =
        currentPosition === 0
          ? "ARRIVE_AT_PICKUP"
          : currentPosition === 1
          ? "GOING_TO_DROPOFF"
          : " ARRIVE_AT_DROPOFF";
      const requestData = {
        bookingDetailId: response.data.id,
        status: status,
        time: time.toISOString(),
      };
      await updateStatusBookingDetail(response.data.id, requestData).then(
        (s) => {
          if (s && s.data) {
            if (currentPosition === 0) {
              Alert.alert("Xác nhận đón khách", `Rước khách thành công`, [
                {
                  text: "OK",
                },
              ]);
            } else if (currentPosition === 1) {
              Alert.alert(
                "Xác nhận đang di chuyển",
                `Bạn đang đưa khách đến điểm trả`,
                [
                  {
                    text: "OK",
                  },
                ]
              );
            } else if (currentPosition === 2) {
              Alert.alert("Đã đến điểm trả", `Xác nhận trả khách thành công`, [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Home"),
                },
              ]);
            }
            setCurrentPosition(currentPosition + 1);
          } else {
            Alert.alert("Xác nhận chuyến", "Lỗi: Không bắt đầu được chuyến!");
          }
        }
      );
    } catch (error) {
      console.error("Tài xế bắt đầu chuyến đi", error);
      Alert.alert("Tài xế bắt đầu", "Bắt đầu không thành công");
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = useNavigation();
  const [stepIndicatorPosition, setStepIndicatorPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const onStepPress = () => {
    console.log(currentPosition);
    if (currentPosition < 3) {
      handlArrivePickUp();
    } else {
      console.log("thành công");
    }
  };
  const onBackPress = () => {
    navigation.goBack();
  };

  console.disableYellowBox = true;
  return (
    <View style={styles.container}>
      <ViGoSpinner isLoading={isLoading} />
      <View style={styles.indicatorContainer}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentPosition}
          labels={data.map((item) => item.label)}
          direction="vertical"
          stepCount={data.length}
          style={styles.stepIndicator}
          renderLabel={({ label, currentPosition }) => (
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.dateTime}>
                {data[currentPosition].status}
              </Text>
              <Text style={styles.dateTime}>
                {data[currentPosition].dateTime}
              </Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={onStepPress}>
          {currentPosition === 0 && <Text>Đã rước khách</Text>}
          {currentPosition === 1 && <Text>Bắt đầu di chuyển</Text>}
          {currentPosition === 2 && <Text>Đã đến điểm trả</Text>}
          {currentPosition === 3 && <Text>Hoàn thành</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stepIndicator: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  labelContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 12,
    color: "#666666",
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    alignItems: "center",
  },
});

export default PickCusScreen;
