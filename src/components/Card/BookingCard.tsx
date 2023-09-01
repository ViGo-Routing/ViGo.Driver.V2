import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Pressable,
  Skeleton,
} from "native-base";
import { vndFormat } from "../../utils/numberUtils";
import { themeColors } from "../../../assets/theme";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  getBookingDetailStatusString,
  getBookingDetailStatusColor,
} from "../../utils/enumUtils/bookingEnumUtils";
import { ArrowRightIcon } from "react-native-heroicons/solid";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { memo } from "react";
import { ColorType } from "native-base/lib/typescript/components/types";

interface BookingCardProps {
  element: any;
  handleBookingClick: (element: any) => void;
}
const BookingCard = ({ element, handleBookingClick }: BookingCardProps) => {
  const getAvailableCountColor = (element: any): ColorType => {
    const availableRate =
      (element.totalBookingDetailsCount -
        element.totalAssignedBookingDetailsCount) /
      element.totalBookingDetailsCount;
    if (availableRate > 0.5) {
      return "green.500";
    } else if (availableRate > 0.25) {
      return "orange.500";
    } else {
      return "red.500";
    }
  };

  return (
    <TouchableOpacity onPress={() => handleBookingClick(element)}>
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
          <VStack>
            <HStack
              alignItems="center"
              space={4}
              // justifyContent="space-between"
            >
              <Box backgroundColor={themeColors.linear} p="2" rounded="xl">
                <Image
                  p="1"
                  size={"xs"}
                  resizeMode="cover"
                  source={require("../../../assets/icons/vigobike.png")}
                  alt="Phương tiện"
                />
              </Box>
              <VStack>
                {/* <Text style={styles.title}>
                    {toVnDateString(element.date)}
                  </Text> */}
                <HStack w={"100%"}>
                  <Text w={20} bold>
                    Bắt đầu:
                  </Text>
                  <Text isTruncated w="55%">
                    {element.customerRoute.startStation.name}
                  </Text>
                </HStack>
                <HStack w={"100%"}>
                  <Text w={20} bold>
                    Kết thúc:
                  </Text>
                  <Text isTruncated w="55%">
                    {element.customerRoute.endStation.name}
                  </Text>
                </HStack>
                <HStack>
                  <Text w={20} bold>
                    Còn trống:
                  </Text>
                  <Text color={getAvailableCountColor(element)}>{`${
                    element.totalBookingDetailsCount -
                    element.totalAssignedBookingDetailsCount
                  }/${element.totalBookingDetailsCount} chuyến đi`}</Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
  },
  titlePrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
  titleButton: {
    fontSize: 10,
    color: themeColors.primary,
  },
});

export default memo(BookingCard);
