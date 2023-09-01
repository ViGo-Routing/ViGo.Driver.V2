import { Box, Text, VStack, HStack, Image, Badge } from "native-base";
import { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../../assets/theme";
import {
  toVnDateString,
  toVnDateTimeString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { vndFormat } from "../../utils/numberUtils";

interface HistoryCardProps {
  trip: any;
  navigation: any;
}

const HistoryCard = ({ trip, navigation }: HistoryCardProps) => {
  const renderBadge = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return <Badge colorScheme={"info"}>Sắp tới</Badge>;
      case "COMPLETED":
      case "ARRIVE_AT_DROPOFF":
        return <Badge colorScheme={"success"}>Đã hoàn thành</Badge>;
      case "CANCELED":
        return <Badge colorScheme={"error"}>Đã hủy</Badge>;
    }
  };

  const handelClickOnItem = (item: any) => {
    if (item.status == "ASSIGNED") {
      navigation.navigate("StartRoute", { item });
    } else if (
      item.status == "ARRIVE_AT_DROPOFF" ||
      item.status == "COMPLETED"
    ) {
      navigation.navigate("CompletedBookingDetail", {
        bookingDetailId: item.id,
      });
    } else if (item.status == "CANCELLED") {
      navigation.navigate("CanceledBookingDetail", {
        bookingDetailId: item.id,
      });
    }
    // navigation.navigate("CurrentStartingTrip", { bookingDetailId: item.id });
  };

  return (
    <TouchableOpacity onPress={() => handelClickOnItem(trip)}>
      <Box
        alignItems="center"
        p="2"
        _web={{
          shadow: 10,
          borderWidth: 0,
        }}
      >
        <Box
          maxW="sm"
          rounded="xl"
          width="100%"
          p="2"
          // overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 6,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <HStack
            // alignItems="center"
            // space={4}
            // justifyContent="space-between"
            // flex={1}
            alignItems="flex-start"
          >
            <Box
              flex={1}
              backgroundColor={themeColors.linear}
              p="2"
              rounded="xl"
              alignItems="center"
              // mx="1"
              mr="3"
            >
              <Image
                p="5"
                size={"xs"}
                resizeMode="cover"
                source={require("../../../assets/icons/vigobike.png")}
                alt="Phương tiện"
                backgroundColor={themeColors.linear}
              />
            </Box>
            <VStack flex={5}>
              {/* <Text style={styles.title}>
                    {toVnDateString(element.date)}
                  </Text> */}
              {/* <HStack mb="2">{renderBadge(trip.status)}</HStack> */}

              <HStack w="100%">
                <Text w={20} bold>
                  Bắt đầu:
                </Text>
                <Text w="55%" isTruncated>
                  {trip.startStation.name}
                </Text>
              </HStack>
              <HStack w="100%">
                <Text w={20} bold>
                  Kết thúc:
                </Text>
                <Text w="55%" isTruncated>
                  {trip.endStation.name}
                </Text>
              </HStack>

              {trip.status == "ASSIGNED" && (
                <>
                  <HStack>
                    <Text w={20} bold>
                      Giờ đón:
                    </Text>
                    <Text>
                      {toVnTimeString(trip.customerDesiredPickupTime)}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text w={20} bold>
                      Ngày:
                    </Text>
                    <Text>{toVnDateString(trip.date)}</Text>
                  </HStack>
                  <Box
                    alignSelf="flex-end"
                    backgroundColor={themeColors.linear}
                    p="3"
                    rounded="xl"
                  >
                    <Text style={styles.titlePrice}>
                      {vndFormat(trip.price)}
                    </Text>
                  </Box>
                </>
              )}
              {(trip.status == "COMPLETED" ||
                trip.status == "ARRIVE_AT_DROPOFF") && (
                <VStack>
                  <Text bold>Đã trả khách vào lúc:</Text>
                  <Text color="green.500" alignSelf="flex-end">
                    {toVnDateTimeString(trip.dropoffTime)}
                  </Text>
                </VStack>
              )}
              {trip.status == "CANCELLED" && (
                <HStack>
                  {/* <Text w={20} bold>
                 Đã hủy vào lúc:
               </Text>
               <Text>{toVnDateTimeString(trip.dropoffTime)}</Text> */}
                  <Text w={20} bold>
                    Ngày:
                  </Text>
                  <Text>{toVnDateString(trip.date)}</Text>
                </HStack>
              )}
            </VStack>
          </HStack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titlePrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export default memo(HistoryCard);
