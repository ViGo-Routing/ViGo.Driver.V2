import { memo, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { getBookingDetailByDriverId } from "../../../services/bookingDetailService";
import { FlatList } from "native-base";
import { vigoStyles } from "../../../../assets/theme";
import HistoryCard from "../../../components/Card/HistoryCard";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

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
      1
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
          paddingTop: 4,
          paddingBottom: 15,
        }}
      />
    </>
  );
};

export default memo(OnGoingTab);
