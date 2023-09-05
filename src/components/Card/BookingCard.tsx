import { Box, VStack, HStack, Image, Text } from "native-base";
import { themeColors } from "../../../assets/theme";
import { StyleSheet, TouchableOpacity } from "react-native";
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
      <Box alignItems="center" p="2">
        <Box
          maxW="sm"
          rounded="xl"
          width="100%"
          p="2"
          // overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor={themeColors.cardColor}
          shadow={1}
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

export default memo(BookingCard);
