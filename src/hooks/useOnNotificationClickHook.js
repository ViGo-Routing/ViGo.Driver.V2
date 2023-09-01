import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useContext } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationOnClickHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { UserContext } from "../context/UserContext";
import { getUserIdViaToken, isValidToken } from "../utils/tokenUtils";
import { getProfile } from "../services/userService";
import { determineDefaultScreen } from "../utils/navigationUtils";

export const useOnNotificationClickHook = () => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  const [initialScreen, setInitialScreen] = useState("");
  const [initialParams, setInitialParams] = useState(undefined);

  const handleInitialScreen = async () => {
    const isValid = await isValidToken();
    // console.log(isValid);
    if (isValid) {
      if (!user) {
        const loginUserId = await getUserIdViaToken();
        if (loginUserId) {
          const userData = await getProfile(loginUserId);
          if (userData) {
            setUser(userData);
          }
        }
      }
      // console.log(user);
      // console.log(await getUserIdViaToken());
      setInitialScreen(determineDefaultScreen(user));
    } else {
      setInitialScreen("Login");
    }
  };

  useEffect(() => {
    handleInitialScreen();
    // App is opened from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.data.action == "payment") {
        paymentNotificationOnClickHandlers(remoteMessage.data, navigation);
      } else if (remoteMessage.data.action == "login") {
        setUser(null);
        navigation.navigate("Login");
      }
    });

    // App is opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage.data.action == "payment") {
            setInitialScreen("WalletTransactionDetail");
            setInitialParams({
              walletTransactionId: remoteMessage.data.walletTransactionId,
            });
          } else if (remoteMessage.data.action == "login") {
            setUser(null);
            navigation.navigate("Login");
          }
        }
      });
  }, []);

  return { initialScreen, initialParams };
};
