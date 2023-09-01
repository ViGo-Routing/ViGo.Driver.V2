import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { Ionicons } from '@expo/vector-icons'
import { themeColors } from "../../../assets/theme/index";
import {
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  MapIcon,
  QueueListIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { Box, HStack, Pressable, Text, VStack } from "native-base";

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState(route.name);
  // console.log(route.name);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setSelected(route.name);
    });
    return unsubscribe;
  });

  return (
    <Box
      bg="white"
      safeAreaTop
      width="100%"
      // alignSeft="center"
      // alignItems="center"
    >
      <HStack
        backgroundColor={themeColors.primary}
        alignItems="center"
        // justifyContent="center"
        justifyContent="space-between"
        safeAreaBottom
        height={"60"}
        px="5"
      >
        <Pressable
          opacity={selected === "Home" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("Home");
            navigation.navigate("Home");
          }}
        >
          <VStack justifyContent="center">
            <HomeIcon size={24} color="white" alignSelf="center" />
            <Text fontSize="xs" color="white" alignSelf="center">
              TRANG CHỦ
            </Text>
          </VStack>
          {/* <Ionicons name="home" size={24} color="white" /> */}
        </Pressable>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Promotion')}>
            <Ionicons name="pricetags" size={24} color="white" />
          </TouchableOpacity> */}
        <Pressable
          opacity={selected === "Schedule" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("Schedule");
            navigation.navigate("Schedule");
          }}
        >
          <VStack justifyContent="center">
            <MapIcon size={24} color="white" alignSelf="center" />
            <Text fontSize="xs" color="white" alignSelf="center">
              LỊCH TRÌNH
            </Text>
            {/* <Ionicons name="git-branch" size={24} color="white" /> */}
          </VStack>
        </Pressable>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Message")}>
            <ChatBubbleLeftRightIcon size={24} color="white" />
          </TouchableOpacity> */}

        <Pressable
          opacity={selected === "History" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("History");
            navigation.navigate("History");
          }}
        >
          <VStack justifyContent="center">
            <QueueListIcon size={24} color="white" alignSelf="center" />
            <Text fontSize="xs" color="white" alignSelf="center">
              LỊCH SỬ
            </Text>
            {/* <Ionicons name="git-branch" size={24} color="white" /> */}
          </VStack>
        </Pressable>
        <Pressable
          opacity={selected === "Profile" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("Profile");
            navigation.navigate("Profile");
          }}
        >
          {/* <Ionicons name="person" size={24} color="white" /> */}
          <VStack justifyContent="center">
            <UserIcon size={24} color="white" alignSelf="center" />
            <Text fontSize="xs" color="white" alignSelf="center">
              CÁ NHÂN
            </Text>
          </VStack>
        </Pressable>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: themeColors.primary,
  },
});

export default BottomNavigationBar;
