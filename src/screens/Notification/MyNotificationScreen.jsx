import { SafeAreaView, View } from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { useContext, useEffect, useState, memo } from "react";
import { UserContext } from "../../context/UserContext";
import { getNotifications } from "../../services/notificationService";
import { getErrorMessage, handleError } from "../../utils/alertUtils";
import {
  Alert,
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Text,
  VStack,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import Divider from "../../components/Divider/Divider";
import { BellAlertIcon, BellIcon } from "react-native-heroicons/solid";
import { toVnDateTimeString } from "../../utils/datetimeUtils";
import InfoAlert from "../../components/Alert/InfoAlert";
import NotificationListItem from "./NotificationListItem";
import ErrorAlert from "../../components/Alert/ErrorAlert";

const MyNotifcationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  const navigation = useNavigation();

  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [onScroll, setOnScroll] = useState(false);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [nextPageNumber, setNextPageNumber] = useState(1);

  const pageSize = 10;

  const getMyNotifications = async (userId) => {
    try {
      setLoading(true);
      const noti = await getNotifications(userId, pageSize, 1);
      setNotifications(noti.data);

      if (noti.hasNextPage == true) {
        setNextPageNumber(2);
      } else {
        setNextPageNumber(null);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      try {
        let moreNotificationsResponse = await getNotifications(
          user.id,
          pageSize,
          nextPageNumber
        );

        const moreNotifications = [
          ...notifications,
          ...moreNotificationsResponse.data,
        ];

        setNotifications(moreNotifications);

        if (moreNotificationsResponse.hasNextPage == true) {
          setNextPageNumber(nextPageNumber + 1);
        } else {
          setNextPageNumber(null);
        }
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        setIsError(true);
      } finally {
      }
    }
  };

  // const renderNotificationListItem = memo(({ notification }) => {

  // });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMyNotifications(user.id);
    });

    return unsubscribe;
  });

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Thông báo của tôi" />
      </View>

      <View style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <FlatList
            style={vigoStyles.list}
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // return <>{renderNotificationListItem(item)}</>;
              return <NotificationListItem notification={item} />;
            }}
            ItemSeparatorComponent={<Divider style={vigoStyles.listDivider} />}
            ListEmptyComponent={<InfoAlert message="Chưa có thông báo" />}
            refreshing={loading}
            onRefresh={() => getMyNotifications(user.id)}
            onEndReached={loadMoreNotifications}
            onScroll={() => setOnScroll(true)}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
              // paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          />
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

export default MyNotifcationScreen;
