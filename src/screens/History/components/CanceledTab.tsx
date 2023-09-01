import { FlatList, Text } from "native-base";
import { memo, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { getBookingDetailByDriverId } from "../../../services/bookingDetailService";
import { vigoStyles } from "../../../../assets/theme";
import HistoryCard from "../../../components/Card/HistoryCard";
import { useNavigation } from "@react-navigation/native";

interface CanceledTabProps {}

const CanceledTab = ({}: CanceledTabProps) => {
  const { user } = useContext(UserContext);

  const [list, setList] = useState([] as any[]);

  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;

  const status = "CANCELLED";
  const navigation = useNavigation();

  const fetchData = async () => {
    setIsLoading(true);
    const detailsResponse = await getBookingDetailByDriverId(
      user.id,
      null,
      null,
      null,
      status,
      pageSize,
      1,
      "date desc, customerDesiredPickupTime desc"
    );
    const items = detailsResponse.data.data;
    setList(items);
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
        null,
        null,
        null,
        status,
        pageSize,
        nextPageNumber
      );

      const moreTrips = [...list, ...trips.data.data];

      setList(moreTrips);

      if (trips.data.hasNextPage == true) {
        setNextPageNumber(nextPageNumber + 1);
      } else {
        setNextPageNumber(null);
      }
    }
  };

  return (
    <>
      <FlatList
        style={vigoStyles.list}
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <HistoryCard navigation={navigation} key={item.id} trip={item} />
          );
        }}
        refreshing={isLoading}
        onRefresh={() => fetchData()}
        onEndReached={loadMoreTrips}
        onScroll={() => setOnScroll(true)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          // paddingHorizontal: 20,
          paddingTop: 4,
          paddingBottom: 15,
          // paddingBottom: currentTrip || upcomingTrip ? 50 : 10,
        }}
      />
    </>
  );
};

export default memo(CanceledTab);
