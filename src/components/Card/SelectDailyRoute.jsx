import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { themeColors } from "../../../assets/theme";
import ComboBox from "./ComboBoxCard";
import { Button } from "react-native-paper";
// import { TextInput } from 'react-native-gesture-handler';

const SelectDailyRoute = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedDays, setSelectedDays] = useState([]);

  const handleSelectDays = (selectedOptions) => {
    setSelectedDays(selectedOptions);
  };
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(2);
  const [monthCount, setMonthCount] = useState(3);
  const [routeRoutines, setRouteRoutines] = useState([]);

  const handleGenerateDates = () => {
    const currentDate = new Date();
    const futureDates = [];

    for (let i = 0; i < monthCount; i++) {
      let date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );

      while (date.getMonth() === currentDate.getMonth() + i) {
        if (date.getDay() === selectedDayOfWeek) {
          futureDates.push(date.toISOString().split("T")[0]);
        }
        date.setDate(date.getDate() + 1);
      }
    }

    const newRouteRoutines = futureDates.map((date) => ({
      routineDate: date,
      startTime: "string",
      endTime: "string",
      status: "ACTIVE",
    }));

    setRouteRoutines(newRouteRoutines);

    const token =
      "eyJhbGciOiJIUzI1NieyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVmOTRkZDg2LTM3YjItNDNhMy05NjJiLTAzNmEzYzAzZDNjOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwianRpIjoiMDM5ZmY5NzQtMTlkYS00ZmM3LWFhYzQtY2VhNjE0ZDNiYzliIiwiZXhwIjoxNjg3NTA0MjY4LCJpc3MiOiJodHRwczovL3ZpZ28tYXBpLmF6dXJld2Vic2l0ZXMubmV0LyIsImF1ZCI6Imh0dHBzOi8vdmlnby1hcGkuYXp1cmV3ZWJzaXRlcy5uZXQvIn0.qqIBod9enNj5Nf8IeK0sG3sEM_fm7LKL5HDbVzscAEEIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVmOTRkZDg2LTM3YjItNDNhMy05NjJiLTAzNmEzYzAzZDNjOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwianRpIjoiMzE1NTU3NDMtNTRiYy00NzU2LWIxMTEtZDkwNmRmMTFjZmE1IiwiZXhwIjoxNjg3NTExNDY5LCJpc3MiOiJodHRwczovL3ZpZ28tYXBpLmF6dXJld2Vic2l0ZXMubmV0LyIsImF1ZCI6Imh0dHBzOi8vdmlnby1hcGkuYXp1cmV3ZWJzaXRlcy5uZXQvIn0.rKvBaesGjo0GfALeRk0O0cG5R6K7C3h3JhJ37n4I7rU";
    const requestData = {
      // Request body data
      routeId: data.id,
      routeRoutines: newRouteRoutines,
    };

    console.log("send ", requestData);
    axios
      .post("https://vigo-api.azurewebsites.net/api/Route", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json-patch+json",
        },
      })
      .then((response) => {
        // Handle successful response
        const sendData = response.data;
        navigation.navigate("BikeSettingSchedule", { sendData });
        console.log("API Route response:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("API Route error:", error);
      });
  };

  return (
    <View style={styles.card}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 5,
          marginBottom: 10,
        }}
        placeholder="Selected Day of Week (0-6)"
        keyboardType="numeric"
        value={selectedDayOfWeek.toString()}
        onChangeText={(text) => setSelectedDayOfWeek(parseInt(text))}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 5,
          marginBottom: 10,
        }}
        placeholder="Month Count"
        keyboardType="numeric"
        value={monthCount.toString()}
        onChangeText={(text) => setMonthCount(parseInt(text))}
      />
      <Button
        style={styles.button}
        title="Generate Dates"
        onPress={handleGenerateDates}
      />
      {routeRoutines.length > 0 && (
        <View>
          <Text>Generated Route Routines:</Text>
          {routeRoutines.map((route, index) => (
            <Text key={index}>{JSON.stringify(route)}</Text>
          ))}
        </View>
      )}
    </View>
    // <View style={styles.card}>
    //   <ComboBox options={days} selectedOptions={selectedDays} onSelect={handleSelectDays} />
    //   {days.map((day) => (
    //     <TouchableOpacity
    //       key={day}
    //       style={[styles.button, day === selectedDay && styles.selectedButton]}
    //       onPress={() => setSelectedDay(day)}
    //     >
    //       <Text>{`Every ${day}`}</Text>
    //     </TouchableOpacity>
    //   ))}
    // </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 0.2,
  },
  selectedButton: {
    backgroundColor: themeColors.linear,
  },
});

export default SelectDailyRoute;
