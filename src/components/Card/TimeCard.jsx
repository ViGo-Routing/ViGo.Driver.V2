import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { themeColors } from "../../../assets/theme";
import { ClockIcon } from "react-native-heroicons/solid";
// import { Ionicons } from '@expo/vector-icons';

const TimeCard = ({ title }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedTime(date.toLocaleTimeString());
    hideDatePicker();
  };

  return (
    <TouchableOpacity onPress={showDatePicker} style={styles.card}>
      <View style={styles.row}>
        <ClockIcon size={20} color={themeColors.primary} />
        {/* <Ionicons name="time" size={20} color={themeColors.primary} /> */}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.tgd}>{selectedTime}</Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: themeColors.primary,
  },
  tgd: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 25,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TimeCard;
