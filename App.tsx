import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/components/Navigation";
import { UserProvider } from "./src/context/UserContext";
import { NativeBaseProvider, Text, Box } from "native-base";
import ViGoAlertProvider from "./src/components/Alert/ViGoAlertProvider";
import PushNotification from "react-native-push-notification";

navigator.geolocation = require("react-native-geolocation-service");

export default function App() {
  PushNotification.createChannel(
    {
      channelId: "vigo-driver-channel",
      channelName: "ViGo - Driver - Notifcation Channel",
      channelDescription: "ViGo - Driver - Notifcation Channel",
    },
    (created: any) => console.log("Channel created!")
  );

  return (
    <UserProvider>
      <NavigationContainer>
        <NativeBaseProvider>
          <ViGoAlertProvider />
          <Navigation />
        </NativeBaseProvider>
      </NavigationContainer>
    </UserProvider>
  );
}
