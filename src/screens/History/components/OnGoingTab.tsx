import { memo, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { getBookingDetailByDriverId } from "../../../services/bookingDetailService";
import { Box, FlatList, View } from "native-base";
import { vigoStyles } from "../../../../assets/theme";
import HistoryCard from "../../../components/Card/HistoryCard";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import InfoAlert from "../../../components/Alert/InfoAlert";

interface OnGoingTabProps {}

const OnGoingTab = ({}: OnGoingTabProps) => {
  const { user } = useContext(UserContext);

  const [list, setList] = useState([] as any[]);

  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;

  const status = "ASSIGNED";
  const formattedCurrentDate = moment().format("YYYY-MM-DD").toString();

  const navigation = useNavigation();

  const fetchData = async () => {
    setIsLoading(true);
    const detailsResponse = await getBookingDetailByDriverId(
      user.id,
      formattedCurrentDate,
      null,
      null,
      status,
      pageSize,
      1,
      "date asc, customerDesiredPickupTime asc"
    );
    // console.log(detailsResponse.data);
    const items = detailsResponse.data.data.filter((item: any) => {
      return (
        moment(item.date).format("YYYY-MM-DD") !== formattedCurrentDate ||
        moment(item.customerDesiredPickupTime, "HH:mm:ss").isAfter(moment())
      );
    });
    // console.log(items.length);
    setList(items);

    if (detailsResponse.data.hasNextPage == true) {
      setNextPageNumber(2);
    } else {
      setNextPageNumber(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // const unsubscribe = navigation.addListener("focus", () => {
    fetchData();
    // });
    // return unsubscribe;
  }, []);

  const loadMoreTrips = async () => {
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      let trips = await getBookingDetailByDriverId(
        user.id,
        formattedCurrentDate,
        null,
        null,
        status,
        pageSize,
        nextPageNumber,
        "date asc, customerDesiredPickupTime asc"
      );

      // console.log(trips.data);

      const moreTrips = [...list, ...trips.data.data];

      setList(moreTrips);
      // console.log("moreTrips");

      if (trips.data.hasNextPage == true) {
        setNextPageNumber(nextPageNumber + 1);
      } else {
        setNextPageNumber(null);
      }
    }
  };

  return (
    // <Box>
    <View>
      <FlatList
        style={vigoStyles.list}
        // flex={1}
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <HistoryCard navigation={navigation} trip={item} />;
        }}
        ListEmptyComponent={
          <InfoAlert message="Không có chuyến đi nào trong trương lai" />
        }
        refreshing={isLoading}
        onRefresh={() => fetchData()}
        onEndReached={loadMoreTrips}
        onScroll={() => setOnScroll(true)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: 15,
        }}
      />
    </View>
    // </Box>
  );
};

export default memo(OnGoingTab);
