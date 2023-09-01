import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { getBookingDetailByDriverId } from "../../services/bookingDetailService";
import { UserContext } from "../../context/UserContext";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import InfoAlert from "../../components/Alert/InfoAlert";
import { Box, Fab, HStack, ScrollView, Text } from "native-base";
import moment from "moment";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage } from "../../utils/alertUtils";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { MapIcon } from "react-native-heroicons/solid";

LocaleConfig.locales["vn"] = {
  monthNames: [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
  ],
  monthNamesShort: [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T6"],
  today: "Hôm nay",
};

LocaleConfig.defaultLocale = "vn";

const SchedulerScreen = () => {
  const { user } = useContext(UserContext);
  const route = useRoute();
  const date = route.params?.date;

  const [items, setItems] = useState({});
  const [tripId, setId] = useState("");
  // const [markedDates, setMarkedDates] = useState([]);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setErrorMessage, setIsError, errorMessage } =
    useErrorHandlingHook();

  const formattedCurrentDate = moment().format("YYYY-MM-DD").toString();
  const maximumViewDate = moment()
    .add(6, "months")
    .format("YYYY-MM-DD")
    .toString();

  const [displayFab, setDisplayFab] = useState(true);
  const [selectedDate, setSelectedDate] = useState(formattedCurrentDate);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    // console.log(user.id);
    try {
      const tripsResponse = await getBookingDetailByDriverId(
        user.id,
        formattedCurrentDate,
        null,
        // moment().format("HH:mm:ss"),
        null,
        "ASSIGNED",
        -1,
        1 /*, formattedPreviousDate*/
      );

      const responseItems = tripsResponse.data.data;
      // console.log(responseItems);
      const agendaItems = {};

      // const itemMarkedDates = {};

      responseItems.forEach((item) => {
        const { startStation, endStation, customerRouteRoutine } = item;
        const dateString = moment(item.date).format("YYYY-MM-DD");

        if (dateString === formattedCurrentDate) {
          if (
            moment(item.customerDesiredPickupTime, "HH:mm:ss").isBefore(
              moment()
            )
          ) {
            return;
          }
        }
        if (!agendaItems[dateString]) {
          agendaItems[dateString] = [];
        }

        const itemData = {
          title: `${startStation.name} - ${endStation.name}`,
          time: `${toVnTimeString(
            item.customerDesiredPickupTime
          )} - ${toVnDateString(item.date)}`,
          item: item,
        };
        agendaItems[dateString].push(itemData);
      });

      setItems(agendaItems);

      // console.log(date);
      if (date) {
        const formattedDate = moment(date).format("YYYY-MM-DD").toString();
        // console.log(displayFab);
        if (
          !agendaItems[formattedDate] ||
          agendaItems[formattedDate].length == 0
        ) {
          setDisplayFab(false);
        }
      } else {
        if (
          !agendaItems[formattedCurrentDate] ||
          agendaItems[formattedCurrentDate].length == 0
        ) {
          setDisplayFab(false);
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const unsubscribe = navigation.addListener("focus", () => {
    fetchData();
    // });

    // return unsubscribe;
    const hardwareBackPress = BackHandler.addEventListener(
      "hardwareBackPress",
      () => navigation.navigate("Home")
    );

    return () => hardwareBackPress.remove();
  }, []);

  useEffect(() => {
    console.log(displayFab);
  }, [displayFab]);

  const handelStartRoute = (item) => {
    navigation.navigate("StartRoute", { item });
    // navigation.navigate("CurrentStartingTrip", { bookingDetailId: item.id });
  };

  const loadItems = (day, items) => {
    // Simulating data fetching
    const events = {}; // This will store the events for each day

    // Filter the events that match the selected day
    items.forEach((item) => {
      const date = item.date;
      const eventDate = new Date(date);
      const dateString = eventDate.toISOString().split("T")[0];

      if (!events[dateString]) {
        events[dateString] = [];
      }
      events[dateString].push(item);
    });

    // Return the events for the selected day
    const selectedDay = day.dateString;
    return events[selectedDay] || [];
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => handelStartRoute(item.item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchData()}
          />
        }
      >
        <Box marginTop="2">
          <InfoAlert message="Bạn không có chuyến xe nào vào hôm nay" />
        </Box>
      </ScrollView>
    );
  };

  const theme = {
    // Customize the agenda styles
    agendaKnobColor: themeColors.primary,
    selectedDayBackgroundColor: themeColors.primary,
    dotColor: "red",
    todayTextColor: "green",
    agendaTodayColor: themeColors.primary,
    // Add more style customizations as needed
  };

  const onDatePress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    const schedules = items[dateString];
    if (!schedules || schedules.length == 0) {
      setDisplayFab(false);
    } else {
      setDisplayFab(true);
    }
    // console.log(date);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Header
          title="Lịch trình của tôi"
          onBackButtonPress={() => navigation.navigate("Home")}
        />
      </View>

      <ErrorAlert isError={isError} errorMessage={errorMessage}>
        <Agenda
          items={items}
          selected={date ? moment(date).format("YYYY-MM-DD") : undefined}
          renderItem={(item) => renderItem(item)}
          // renderEmptyDate={() => renderEmptyDate()}
          renderEmptyData={() => renderEmptyDate()}
          theme={theme} // Apply the custom theme
          showOnlySelectedDayItems
          onRefresh={() => {
            // console.log("Reloading Agenda...");
            fetchData();
          }}
          minDate={formattedCurrentDate}
          refreshing={isLoading}
          onDayPress={onDatePress}
          maxDate={maximumViewDate}
          futureScrollRange={6}
          pastScrollRange={1}
        />
        {displayFab && (
          <Fab
            renderInPortal={false}
            shadow={2}
            size="sm"
            backgroundColor={themeColors.primary}
            icon={<MapIcon color="white" size={24} />}
            onPress={() =>
              navigation.navigate("ScheduleInDate", {
                date: selectedDate,
              })
            }
          />
        )}
      </ErrorAlert>
    </SafeAreaView>
  );
};

const styles = {
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemTime: {
    fontSize: 14,
    color: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
};
export default SchedulerScreen;
