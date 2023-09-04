import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useContext } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationOnClickHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { UserContext } from "../context/UserContext";
import { getUserIdViaToken, isValidToken } from "../utils/tokenUtils";
import { getProfile } from "../services/userService";
import { determineDefaultScreen } from "../utils/navigationUtils";
// import { setUserData } from "../utils/storageUtils";

export const useOnNotificationClickHook = (setIsLoading) => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  const [initialScreen, setInitialScreen] = useState("");
  const [initialParams, setInitialParams] = useState(undefined);

  const handleInitialScreen = async () => {
    setIsLoading(true);
    try {
      const isValid = await isValidToken();
      // const user = await getUserData();
      console.log(isValid);
      if (isValid) {
        console.log(user);
        let userData = user;
        if (!userData) {
          const loginUserId = await getUserIdViaToken();
          // console.log(loginUserId);
          if (loginUserId) {
            userData = await getProfile(loginUserId);
            // console.log(userData);
            if (userData) {
              setUser(userData);
              // await setUserData(userData);
            }
          }
        }
        // console.log(user);
        // console.log(await getUserIdViaToken());
        // console.log(determineDefaultScreen(userData));
        setInitialScreen(determineDefaultScreen(userData));
      } else {
        setInitialScreen("Login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialScreen && initialScreen != "Login") {
      navigation.reset({
        index: 0,
        routes: [{ name: initialScreen }],
      });
    }
  }, [initialScreen]);

  useEffect(() => {
    handleInitialScreen();
    // App is opened from background state
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage.data.action == "payment") {
        paymentNotificationOnClickHandlers(remoteMessage.data, navigation);
      } else if (remoteMessage.data.action == "login") {
        setUser(null);
        // await setUserData(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    // App is opened from a quit state
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage.data.action == "payment") {
            setInitialScreen("WalletTransactionDetail");
            setInitialParams({
              walletTransactionId: remoteMessage.data.walletTransactionId,
            });
          } else if (remoteMessage.data.action == "login") {
            setUser(null);
            // await setUserData(null);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        }
      });
  }, []);

  return { initialScreen, initialParams };
};
