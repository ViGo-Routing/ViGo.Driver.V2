import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { themeColors } from "../../../assets/theme";

const RoutineGenerator = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [chosenTime, setChosenTime] = useState("");
  const [numberOfMonths, setNumberOfMonths] = useState("");

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleTimeConfirm = (time) => {
    const isoTime = time.toISOString();
    const formattedTime = isoTime.substring(11, 19);
    setChosenTime(formattedTime);
    setTimePickerVisible(false);
  };

  const handleMonthsChange = (text) => {
    setNumberOfMonths(text);
  };

  const generateRoutines = () => {
    const routines = [];
    const currentDate = new Date(); // Get the current date

    const targetDays = selectedDays.map((day) =>
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(day)
    );

    for (let i = 0; i < numberOfMonths; i++) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      ); // Get the target date for the current month

      const currentMonth = targetDate.getMonth();
      let currentDay = targetDate.getDay();

      while (targetDate.getMonth() === currentMonth) {
        if (targetDays.includes(currentDay)) {
          // Format the routine date as "YYYY-MM-DD" (e.g., "2023-07-07")
          const formattedDate = targetDate.toISOString().split("T")[0];

          routines.push({
            routineDate: formattedDate,
            pickupTime: chosenTime,
            status: "ACTIVE",
          });
        }

        targetDate.setDate(targetDate.getDate() + 1);
        currentDay = targetDate.getDay();
      }
    }

    console.log(routines);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainerDays}>
        <View style={styles.horizontalContainer}>
          <Text style={styles.inputTitle}>Select days:</Text>
          <View style={styles.inputBorderDays}>
            <TouchableOpacity
              onPress={() => handleDayToggle("Sunday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Sunday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>Su</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDayToggle("Monday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Monday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>Mo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDayToggle("Tuesday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Tuesday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>Tu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDayToggle("Wednesday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Wednesday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>We</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDayToggle("Thursday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Thursday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>Th</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDayToggle("Friday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Friday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>Fr</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDayToggle("Saturday")}
              style={[
                styles.circleButton,
                {
                  backgroundColor: selectedDays.includes("Saturday")
                    ? themeColors.primary
                    : "white",
                },
              ]}
            >
              <Text style={styles.circleButtonText}>Sa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Number of months:</Text>
        <View style={styles.inputBorder}>
          <TextInput
            value={numberOfMonths}
            onChangeText={handleMonthsChange}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: "gray", padding: 5 }}
          />
        </View>
      </View>

      <View
        style={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          margin: "10%",
          width: "90%",
        }}
      >
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => setTimePickerVisible(true)}
        >
          <Text style={styles.continueButtonText}>Chọn thời gian</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />
      <Text onPress={generateRoutines}>Generate Routines</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: themeColors.primary,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  inputContainerDays: {
    marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  inputTitle: {
    borderRadius: 10,
    color: themeColors.linear,
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: themeColors.primary,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  inputBorderDays: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center", // Center children horizontally
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  horizontalContainer: {},
  input: {
    height: 40,
    padding: 10,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  circleButtonText: {
    fontSize: 20,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: themeColors.primary,
    borderRadius: 15,
    justifyContent: "center",
    width: "90%",
    height: 50,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RoutineGenerator;
