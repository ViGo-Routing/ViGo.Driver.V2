import { useNavigation } from "@react-navigation/native";
import { memo, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { FlatList, View } from "native-base";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage } from "../../utils/alertUtils";
import { getReports } from "../../services/reportService";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import ReportListItem from "./ReportListItem";
import Divider from "../../components/Divider/Divider";
import InfoAlert from "../../components/Alert/InfoAlert";

const MyReportScreen = () => {
  const navigation = useNavigation();

  const [reports, setReports] = useState([] as any[]);

  const [loading, setLoading] = useState(false);
  const [onScroll, setOnScroll] = useState(false);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const [nextPageNumber, setNextPageNumber] = useState(1);

  const pageSize = 10;

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const reportsResponse = await getReports(1, pageSize);

      setReports(reportsResponse.data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Báo cáo của tôi" />
      <View style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <FlatList
            style={[vigoStyles.list, { paddingTop: 10 }]}
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // return <>{renderNotificationListItem(item)}</>;
              return <ReportListItem navigation={navigation} item={item} />;
            }}
            ItemSeparatorComponent={<Divider style={vigoStyles.listDivider} />}
            ListEmptyComponent={<InfoAlert message="Chưa có báo cáo nào" />}
            refreshing={loading}
            onRefresh={() => fetchReportData()}
            // onEndReached={loadMoreNotifications}
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

export default memo(MyReportScreen);
