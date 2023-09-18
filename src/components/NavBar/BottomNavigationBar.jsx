import React, { memo, useEffect, useState } from "react";
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

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SchedulerScreen from "../../screens/Scheduler/SchedulerScreen";
import HistoryScreen from "../../screens/History/HistoryScreen";
import ProfileSreen from "../../screens/Profile/ProfileScreen";
import HomeComponent from "../../screens/Home/HomeComponent";

const Tab = createBottomTabNavigator();

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState(route.name);
  // console.log(route.name);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     setSelected(route.name);
  //   });
  //   return unsubscribe;
  // });

  const renderTabBar = ({ state, descriptors, navigation, position }) => {
    return (
      // <Box>
      <View style={{ flexDirection: "row" }}>
        {state.routes.map((route, i) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const tabBarIcon = options.tabBarIcon;

          // const color = index === i ?
          const borderColor =
            state.index === i ? themeColors.primary : "#e5e5e5";
          {
            /* const textColor = state.index === i ? themeColors.primary : "black";
          const isBold = state.index === i; */
          }
          const isFocus = state.index === i;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocus && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <Pressable
              opacity={isFocus ? 1 : 0.75}
              py="3"
              alignItems="center"
              onPress={onPress}
              key={label}
              flex={1}
            >
              <VStack justifyContent="center">
                {/* <HomeIcon size={24} color="white" alignSelf="center" /> */}
                {tabBarIcon(isFocus, "white", 24)}
                <Text fontSize="xs" color="white" alignSelf="center">
                  {label}
                </Text>
              </VStack>
              {/* <Ionicons name="home" size={24} color="white" /> */}
            </Pressable>
          );
        })}
        {/* // </Box> */}
      </View>
    );
  };

  return (
    // <Box
    //   bg="white"
    //   safeAreaTop
    //   width="100%"
    //   // alignSeft="center"
    //   // alignItems="center"
    // >
    // {/* <HStack
    //   backgroundColor={themeColors.primary}
    //   alignItems="center"
    //   // justifyContent="center"
    //   justifyContent="space-between"
    //   safeAreaBottom
    //   height={"60"}
    //   px="5"
    // >
    //   <Pressable
    //     opacity={selected === "Home" ? 1 : 0.75}
    //     py="3"
    //     // flex={1}
    //     onPress={() => {
    //       setSelected("Home");
    //       navigation.navigate("Home");
    //     }}
    //   >
    //     <VStack justifyContent="center">
    //       <HomeIcon size={24} color="white" alignSelf="center" />
    //       <Text fontSize="xs" color="white" alignSelf="center">
    //         TRANG CHỦ
    //       </Text>
    //     </VStack>
    //   </Pressable>
    //   <Pressable
    //     opacity={selected === "Schedule" ? 1 : 0.75}
    //     py="3"
    //     // flex={1}
    //     onPress={() => {
    //       setSelected("Schedule");
    //       navigation.navigate("Schedule");
    //     }}
    //   >
    //     <VStack justifyContent="center">
    //       <MapIcon size={24} color="white" alignSelf="center" />
    //       <Text fontSize="xs" color="white" alignSelf="center">
    //         LỊCH TRÌNH
    //       </Text>
    //     </VStack>
    //   </Pressable>

    //   <Pressable
    //     opacity={selected === "History" ? 1 : 0.75}
    //     py="3"
    //     // flex={1}
    //     onPress={() => {
    //       setSelected("History");
    //       navigation.navigate("History");
    //     }}
    //   >
    //     <VStack justifyContent="center">
    //       <QueueListIcon size={24} color="white" alignSelf="center" />
    //       <Text fontSize="xs" color="white" alignSelf="center">
    //         LỊCH SỬ
    //       </Text>
    //     </VStack>
    //   </Pressable>
    //   <Pressable
    //     opacity={selected === "Profile" ? 1 : 0.75}
    //     py="3"
    //     // flex={1}
    //     onPress={() => {
    //       setSelected("Profile");
    //       navigation.navigate("Profile");
    //     }}
    //   >
    //     <VStack justifyContent="center">
    //       <UserIcon size={24} color="white" alignSelf="center" />
    //       <Text fontSize="xs" color="white" alignSelf="center">
    //         CÁ NHÂN
    //       </Text>
    //     </VStack>
    //   </Pressable>
    // </HStack> */}
    <Tab.Navigator
      // tabBar={(props) => renderTabBar(props)}
      // sceneContainerStyle={{ backgroundColor: themeColors.primary }}
      screenOptions={{
        lazy: true,
        tabBarStyle: {
          backgroundColor: themeColors.primary,
          paddingBottom: 5,
          paddingTop: 5,
          height: 55,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#b1d1d1",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        key="HomeTab"
        component={HomeComponent}
        options={{
          tabBarLabel: "TRANG CHỦ",
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="ScheduleTab"
        key="ScheduleTab"
        component={SchedulerScreen}
        options={{
          tabBarLabel: "LỊCH TRÌNH",
          tabBarIcon: ({ focused, color, size }) => (
            <MapIcon size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        key="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: " LỊCH SỬ ",
          tabBarIcon: ({ focused, color, size }) => (
            <QueueListIcon size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        key="ProfileTab"
        component={ProfileSreen}
        options={{
          tabBarLabel: "CÁ NHÂN",
          tabBarIcon: ({ focused, color, size }) => (
            <UserIcon size={size} color={color} />
          ),
          tabBarBackground: () => <Box backgroundColor={themeColors.primary} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
    // </Box>
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

export default memo(BottomNavigationBar);
