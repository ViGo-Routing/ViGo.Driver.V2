import * as React from "react";
import { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import SchedulerScreen from "../screens/Scheduler/SchedulerScreen";
import ProfileSreen from "../screens/Profile/ProfileScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import RoutineScreen from "../screens/Routine/RoutineScreen";
import RoutineGenerator from "../screens/Routine/RoutineScreen";
import Mapbox from "../screens/Mapbox";
import { UserContext, UserProvider } from "../context/UserContext";
import BookingDetailScreen from "../screens/BookingDetail/BookingDetailScreen";
import { useNotificationHook } from "../hooks/useNotificationHook";
import { useOnNotificationClickHook } from "../hooks/useOnNotificationClickHook";
import WalletScreen from "../screens/Wallet/WalletScreen";
import WalletTransactionDetailScreen from "../screens/Wallet/WalletTransactionDetailScreen";
import WalletTransactionsScreen from "../screens/Wallet/WalletTransactionsScreen";
import NewDriverUpdateProfileScreen from "../screens/Profile/NewDriverUpdateProfileScreen";
import StartRouteScreen from "../screens/StartRoute/StartRouteScreen";
import PickCusScreen from "../screens/StartRoute/PickCusScreen";
import { CustomerDetailScreen } from "../screens/BookingDetail/CustomerDetailScreen";
import TopupScreen from "../screens/Wallet/Topup/TopupScreen";
import MyNotifcationScreen from "../screens/Notification/MyNotificationScreen";
import ScheduleInDateScreen from "../screens/Scheduler/ScheduleInDateScreen";
import CurrentStartingTripScreen from "../screens/StartRoute/CurrentStartingTripScreen";
import DetailBookingScreen from "../screens/Booking/DetailBookingScreen";
import MapInformationScreen from "../screens/Booking/MapInformationScreen";
import HistoryScreen from "../screens/History/HistoryScreen";
import CompletedBookingDetailScreen from "../screens/BookingDetail/CompletedBookingDetailScreen";
import CanceledBookingDetailScreen from "../screens/BookingDetail/CanceledBookingDetailScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  useNotificationHook();

  const { initialScreen, initialParams } = useOnNotificationClickHook();

  // useEffect(() => {
  //   if (user) {
  //     if (user.status == "PENDING") {
  //       initialScreen = "NewDriverUpdateProfile";
  //     }
  //   }
  // }, []);

  // console.log(initialScreen);

  return (
    // <UserProvider>
    //     <NavigationContainer>
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Schedule"
        options={{ headerShown: false }}
        component={SchedulerScreen}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileSreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickCus"
        component={PickCusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StartRoute"
        component={StartRouteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        options={{ headerShown: false }}
        component={WalletScreen}
      />
      <Stack.Screen
        name="WalletTransactionDetail"
        options={{ headerShown: false }}
        component={WalletTransactionDetailScreen}
        initialParams={
          initialScreen == "WalletTransactionDetail" ? initialParams : undefined
        }
      />
      <Stack.Screen
        name="WalletTransactions"
        options={{ headerShown: false }}
        component={WalletTransactionsScreen}
      />
      <Stack.Screen
        name="Topup"
        options={{ headerShown: false }}
        component={TopupScreen}
      />
      <Stack.Screen
        name="NewDriverUpdateProfile"
        options={{ headerShown: false }}
        component={NewDriverUpdateProfileScreen}
      />
      <Stack.Screen
        name="CustomerDetail"
        options={{ headerShown: false }}
        component={CustomerDetailScreen}
      />

      <Stack.Screen
        name="MyNotification"
        options={{ headerShown: false }}
        component={MyNotifcationScreen}
      />
      <Stack.Screen
        name="ScheduleInDate"
        options={{ headerShown: false }}
        component={ScheduleInDateScreen}
      />
      <Stack.Screen
        name="CurrentStartingTrip"
        options={{ headerShown: false }}
        component={CurrentStartingTripScreen}
      />
      <Stack.Screen
        name="DetailBooking"
        options={{ headerShown: false }}
        component={DetailBookingScreen}
      />
      <Stack.Screen
        name="MapInformation"
        options={{ headerShown: false, animation: "slide_from_bottom" }}
        component={MapInformationScreen}
      />
      <Stack.Screen
        name="History"
        options={{ headerShown: false }}
        component={HistoryScreen}
      />
      <Stack.Screen
        name="CompletedBookingDetail"
        options={{ headerShown: false, animation: "slide_from_bottom" }}
        component={CompletedBookingDetailScreen}
      />
      <Stack.Screen
        name="CanceledBookingDetail"
        options={{ headerShown: false, animation: "slide_from_bottom" }}
        component={CanceledBookingDetailScreen}
      />
    </Stack.Navigator>
    //     </NavigationContainer>
    // </UserProvider>
  );
};
export default Navigation;
