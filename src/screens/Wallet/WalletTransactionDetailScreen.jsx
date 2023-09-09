import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "../../components/Header/Header";
import { vigoStyles } from "../../../assets/theme";
import {
  renderTransacionType,
  renderTransactionDetail,
  renderTransactionStatus,
  renderTransactionTypeOperator,
} from "../../utils/enumUtils/walletEnumUtils";

import { useEffect, useState, memo } from "react";
import { getWalletTransactionDetail } from "../../services/walletService";
import { vndFormat } from "../../utils/numberUtils";
import { renderPaymentMethod } from "../../utils/enumUtils/paymentMethodEnumUtils";
import { toVnDateTimeString } from "../../utils/datetimeUtils";
import Divider from "../../components/Divider/Divider";
import { Box, HStack, Text, VStack } from "native-base";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage } from "../../utils/alertUtils";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
const WalletTransactionDetailScreen = ({ route }) => {
  // console.log(route);
  const { walletTransactionId } = route.params;
  // console.log(walletTransactionId);

  const [details, setDetails] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const transactionDetails = await getWalletTransactionDetail(
        walletTransactionId
      );
      // console.log(transactionDetails);
      setDetails(transactionDetails);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionColor = (transaction) => {
    if (renderTransactionTypeOperator(transaction.type) == "+") {
      return "green.600";
    }
    return "red.500";
  };

  const renderTransactionDetail = (transactionDetail) => {
    if (transactionDetail) {
      return (
        <View>
          <HStack>{renderTransacionType(transactionDetail, "details")}</HStack>
          <Box>
            <Text
              color={getTransactionColor(transactionDetail)}
              bold
              fontSize={"3xl"}
            >{`${renderTransactionTypeOperator(
              transactionDetail.type
            )}${vndFormat(transactionDetail.amount)}`}</Text>
          </Box>
          <Box marginTop={15}>
            <HStack justifyContent={"space-between"} marginBottom={3}>
              <Text>Phương thức thanh toán</Text>
              <Text>
                {renderPaymentMethod(transactionDetail.paymentMethod)}
              </Text>
            </HStack>
            <HStack
              justifyContent={"space-between"}
              alignItems={"center"}
              marginBottom={3}
            >
              <Text>Trạng thái</Text>
              {renderTransactionStatus(transactionDetail.status, "details")}
            </HStack>
            <HStack justifyContent={"space-between"} marginBottom={3}>
              <Text>Thời gian</Text>
              <Text>{toVnDateTimeString(transactionDetail.createdTime)}</Text>
            </HStack>
          </Box>

          <Divider style={{ marginTop: 10 }} />

          <Box marginTop={15}>
            <VStack>
              <Text>Mã giao dịch</Text>
              <Text style={{ textAlign: "right" }}>{transactionDetail.id}</Text>
            </VStack>
            {/* <View style={vigoStyles.column}>
              
            </View> */}
            {transactionDetail.bookingDetailId && (
              <VStack>
                <Text>Mã chuyến đi</Text>
                <Text style={{ textAlign: "right" }}>
                  {transactionDetail.bookingDetailId}
                </Text>
              </VStack>
            )}
            {transactionDetail.bookingId && (
              <VStack>
                <Text>Mã hành trình</Text>
                <Text style={{ textAlign: "right" }}>
                  {transactionDetail.bookingId}
                </Text>
              </VStack>
            )}
          </Box>
        </View>
      );
    }
    return <></>;
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Chi tiết giao dịch" />
      <View style={vigoStyles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {renderTransactionDetail(details)}
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

export default WalletTransactionDetailScreen;

const styles = StyleSheet.create({
  transactionNameDetail: {
    fontSize: 20,
  },
  transactionDetailsAmountContainer: {
    // backgroundColor: "white",
  },
  transactionDetailsAmount: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
});
