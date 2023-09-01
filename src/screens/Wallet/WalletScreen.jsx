import {
  // FlatList,
  // Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  // Text,
  TouchableOpacity,
  View,
} from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

import { vndFormat } from "../../utils/numberUtils";
import Divider from "../../components/Divider/Divider";
import { ArrowRightCircleIcon } from "react-native-heroicons/outline";
// import {
//   CheckCircleIcon,
//   ClockIcon,
//   ExclamationCircleIcon,
// } from "react-native-heroicons/solid";
import {
  renderTransacionType,
  // renderTransacionType,
  renderTransactionListItem,
  renderTransactionStatus,
  renderTransactionTypeOperator,
  // renderTransactionStatus,
} from "../../utils/enumUtils/walletEnumUtils";
import { PlusCircleIcon, PlusSmallIcon } from "react-native-heroicons/solid";
import {
  getWalletByUserId,
  getWalletTransactions,
} from "../../services/walletService";
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  HStack,
  Heading,
  Text,
  VStack,
  Pressable,
  Button,
  FlatList,
} from "native-base";
import TransactionItem from "../../components/WalletTransaction/TransactionItem";

const WalletScreen = () => {
  const navigation = useNavigation();
  const [walletBalance, setWalletBalance] = useState(0);
  const [wallet, setWallet] = useState(null);

  const [walletTransacions, setWalletTransacions] = useState([]);

  const { user } = useContext(UserContext);

  const getWallet = async () => {
    // console.log(user);
    const userWallet = await getWalletByUserId(user.id);
    // console.log(wallet);
    setWallet(userWallet);
    setWalletBalance(userWallet.balance);

    // console.log(wallet);
    await getTransacions(userWallet.id);
  };

  const getTransacions = async (walletId) => {
    const transactions = await getWalletTransactions(walletId, 3, 1);
    // console.log(transactions);
    setWalletTransacions(transactions.data);
  };

  const renderTransactionListItem = (transaction) => {
    return <TransactionItem renderType="list" transaction={transaction} />;
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getWallet();
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Ví của tôi" />
      </View>

      {/* <ScrollView style={vigoStyles.body}> */}
      <View style={vigoStyles.body}>
        <View style={styles.balanceContainer}>
          <View style={vigoStyles.textContainer}>
            <VStack>
              <Text bold fontSize={"3xl"} color={themeColors.primary}>
                {vndFormat(walletBalance)}
              </Text>
              <Text fontSize={"xs"}>Số dư hiện tại</Text>
            </VStack>
          </View>
        </View>
        <Box flexDirection={"row-reverse"} marginTop={5}>
          <Button
            style={vigoStyles.buttonWhite}
            onPress={() => navigation.navigate("Topup")}
            leftIcon={
              <PlusCircleIcon
                style={{ ...vigoStyles.buttonWhiteText }}
                size={15}
              />
            }
          >
            <Text style={vigoStyles.buttonWhiteText}>Nạp tiền</Text>
          </Button>
          {/* <TouchableOpacity
            style={vigoStyles.buttonWhite}
            
          >
          <HStack>
          <PlusCircleIcon
                style={{ ...vigoStyles.buttonWhiteText, marginRight: 5 }}
                size={15}
              />
              <Text style={vigoStyles.buttonWhiteText}>Nạp tiền</Text>
          </HStack>
          </TouchableOpacity> */}
        </Box>

        <Divider style={vigoStyles.sectionDivider} />

        <Box>
          <HStack justifyContent={"space-between"}>
            <Heading size="lg">Lịch sử giao dịch</Heading>

            <Pressable
              onPress={() =>
                navigation.navigate("WalletTransactions", {
                  walletId: wallet.id,
                })
              }
            >
              <ArrowRightCircleIcon size={30} color="black" />
            </Pressable>
          </HStack>

          <FlatList
            style={vigoStyles.list}
            data={walletTransacions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("WalletTransactionDetail", {
                      walletTransactionId: item.id,
                    })
                  }
                >
                  {renderTransactionListItem(item)}
                  <Divider style={vigoStyles.listDivider} />
                </TouchableOpacity>
              );
            }}
          />
        </Box>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: themeColors.linear,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  balance: {
    fontSize: 18,
    fontWeight: "bold",
  },

  transactionNameListItem: {
    fontSize: 16,
  },
  transactionSubtitle: {
    // marginLeft: 10,
    fontSize: 14,
    color: "#999",
  },
});

export default WalletScreen;
