import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { Fab, View } from "native-base";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import Map from "../../components/Map/Map";
import { getErrorMessage } from "../../utils/alertUtils";
import { StyleSheet } from "react-native";
import { themeColors } from "../../../assets/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getBookingDetailByDriverId } from "../../services/bookingDetailService";
import { generateMapPoint } from "../../utils/mapUtils";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const ScheduleInDateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { date } = route.params;
  // console.log(date);
  const [tripsInDate, setTripsInDate] = useState(null);
  const formattedDate = moment(date).format("YYYY-MM-DD").toString();
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  async function getTripsInDate() {
    setIsLoading(true);
    try {
      const tripsResponse = await getBookingDetailByDriverId(
        user.id,
        formattedDate,
        formattedDate,
        null,
        "ASSIGNED",
        -1,
        1 /*, formattedPreviousDate*/
      );

      setTripsInDate(
        tripsResponse.data.data.map((trip) => {
          return {
            firstPosition: generateMapPoint(trip.startStation),
            secondPosition: generateMapPoint(trip.endStation),
            // strokeColor: "#00A1A1",
            // strokeWidth: 3,
            bookingDetailId: trip.id,
          };
        })
      );

      // driverSchedules.push({
      //   firstPosition: generateMapPoint(schedules.previousTrip.startStation),
      //   secondPosition: generateMapPoint(schedules.previousTrip.endStation),
      //   // strokeColor: "#00A1A1",
      //   // strokeWidth: 3,
      //   bookingDetailId: schedules.previousTrip.id,
      // });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTripsInDate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {tripsInDate && (
            <>
              <Map
                // pickupPosition={pickupPosition}
                // destinationPosition={destinationPosition}
                // sendRouteId={(routeId) =>
                //   console.log("Received Route ID:", routeId)
                // }
                directions={tripsInDate}
                // setDistance={setDistance}
                // distance={distance}
                // duration={duration}
                // setDuration={setDuration}
                isPickingSchedules={false}
                // onCurrentTripPress={() => {
                //   panelRef.current.openLargePanel();
                //   // console.log("Current PRessed!");
                // }}
                setIsLoading={setIsLoading}
              />
              <Fab
                renderInPortal={false}
                shadow={2}
                size="sm"
                backgroundColor="white"
                icon={<ArrowLeftIcon color={themeColors.primary} size={24} />}
                onPress={() => navigation.goBack()}
                placement="bottom-left"
              />
            </>
          )}
        </ErrorAlert>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    // paddingLeft: 10,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
});

export default ScheduleInDateScreen;
