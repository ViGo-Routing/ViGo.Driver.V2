import { SafeAreaView, View } from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { useContext, useEffect, useState } from "react";
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

  const renderNotificationListItem = (notification) => {
    return (
      <VStack>
        <HStack>
          <Box width={"15%"} alignItems={"center"}>
            <BellAlertIcon size={30} color={themeColors.primary} />
          </Box>
          <Box width={"80%"}>
            <Heading size="sm">{notification.title}</Heading>
            <Text>{notification.description}</Text>
          </Box>
        </HStack>
        <Box alignItems="flex-end">
          <Text color={"#999"}>
            {toVnDateTimeString(notification.createdTime)}
          </Text>
        </Box>
      </VStack>
    );
  };

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
        {isError && (
          <Center marginBottom={"2"}>
            {/* <Text>Hồ sơ của bạn đã được gửi đến ViGo!</Text> */}
            <Alert status="error" colorScheme={"error"}>
              <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                <Alert.Icon size="md" />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: "coolGray.800",
                  }}
                >
                  Không thể truy vấn thông tin
                </Text>

                <Box
                  _text={{
                    textAlign: "center",
                  }}
                  _dark={{
                    _text: {
                      color: "coolGray.600",
                    },
                  }}
                >
                  <Text>{errorMessage}</Text>
                </Box>
              </VStack>
            </Alert>
          </Center>
        )}
        {!isError && (
          <FlatList
            style={vigoStyles.list}
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <>{renderNotificationListItem(item)}</>;
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
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyNotifcationScreen;
