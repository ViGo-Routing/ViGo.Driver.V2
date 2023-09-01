import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/components/Navigation";
import { UserProvider } from "./src/context/UserContext";
import { NativeBaseProvider, Text, Box } from "native-base";
import ViGoAlertProvider from "./src/components/Alert/ViGoAlertProvider";

export default function App() {
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
