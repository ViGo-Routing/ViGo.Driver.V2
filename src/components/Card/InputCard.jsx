import { MapPinIcon, UserCircleIcon } from "react-native-heroicons/solid";
// import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { themeColors } from "../../../assets/theme";
// import axios from 'axios';

const InputCard = () => {
  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);

  // axios.get(`https://vigo-api.azurewebsites.net/api/Station/${data.startStationId}`, {
  //     headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json-patch+json'
  //     }
  // })
  //     .then(response => {
  //         setStartStation(response.name)
  //         console.log('API Station Response:', response.data);
  //         // You can update your component state or perform any other necessary actions with the response data
  //     })
  //     .catch(error => {

  //         console.log('API Station Error:', error);
  //         // You can display an error message or perform any other necessary error handling
  //     });
  // axios.get(`https://vigo-api.azurewebsites.net/api/Station/${data.endStationId}`, {
  //     headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json-patch+json'
  //     }
  // })
  //     .then(response => {
  //         setEndStation(response.name)
  //         // Handle the response data
  //         console.log('API Station Response:', response.data);
  //         // You can update your component state or perform any other necessary actions with the response data
  //     })
  //     .catch(error => {
  //         // Handle the error
  //         console.log('API Station Error:', error);
  //         // You can display an error message or perform any other necessary error handling
  //     });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <UserCircleIcon size={20} color="blue" />
        {/* <Ionicons name="trail-sign" size={20} color={themeColors.primary} /> */}
        <TextInput style={styles.input1} placeholder={startStation} />
      </View>
      <View style={styles.row}>
        <MapPinIcon size={18} color="orange" />
        {/* <Ionicons name="navigate-circle" size={20} color={themeColors.primary} /> */}
        <TextInput style={styles.input} placeholder={endStation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input1: {
    height: 40,
    borderColor: "gray",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
});

export default InputCard;
