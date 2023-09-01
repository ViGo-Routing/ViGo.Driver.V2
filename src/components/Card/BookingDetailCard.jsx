import { Box, VStack, HStack, Image, Text, Pressable } from "native-base";
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

const BookingDetailCard = ({ element, handleBookingDetailClick }) => {
  return (
    <TouchableOpacity onPress={() => handleBookingDetailClick(element)}>
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
              justifyContent="space-between"
            >
              <VStack alignItems="start">
                <Box backgroundColor={themeColors.linear} p="2" rounded="xl">
                  <Image
                    p="1"
                    size={"xs"}
                    resizeMode="cover"
                    source={require("../../../assets/icons/vigobike.png")}
                    alt="Phương tiện"
                  />
                </Box>
              </VStack>
              <VStack>
                <HStack alignItems="start">
                  <Text style={styles.title}>
                    {toVnDateString(element.date)}
                  </Text>
                </HStack>
              </VStack>
              <VStack alignItems="start">
                <VStack alignItems="center"></VStack>
              </VStack>
            </HStack>
            <VStack p={5}>
              <HStack>
                <Text w={20} color="gray.500" bold fontSize={15}>
                  Trạng thái:
                </Text>
                <Text style={[getBookingDetailStatusColor(element.status)]}>
                  {getBookingDetailStatusString(element.status)}
                </Text>
              </HStack>
              <HStack>
                <Text w={20} color="gray.500" bold fontSize={15}>
                  Bắt đầu:
                </Text>
                <Text>{element.startStation.name}</Text>
              </HStack>
              <HStack>
                <Text w={20} color="gray.500" bold fontSize={15}>
                  Kết thúc:
                </Text>
                <Text>{element.endStation.name}</Text>
              </HStack>
              <HStack alignItems="center">
                <Text w={20} color="black" bold fontSize={15}>
                  Giờ đón:
                </Text>
                <Text w={20} color="black" bold fontSize={15}>
                  {toVnTimeString(element.customerDesiredPickupTime)}
                </Text>
              </HStack>
            </VStack>
            <HStack justifyContent="flex-end">
              <Box backgroundColor={themeColors.linear} p="4" rounded="xl">
                <Text style={styles.titlePrice}>
                  {vndFormat(element.price)}
                </Text>
              </Box>
            </HStack>
          </VStack>

          {element.status !== "GOING_TO_PICKUP" ? (
            <Pressable onPress={() => handleBookingDetailClick(element)}>
              <Text style={styles.titleButton}>
                Chi tiết
                <ArrowRightIcon size={10} />{" "}
              </Text>
            </Pressable>
          ) : (
            {
              /* <Pressable onPress={() => handleTrackingDriverLocation(element)}>
            <Text style={styles.titleButton}>
              Vị trí tài xế
              <ArrowRightIcon size={10} />{" "}
            </Text>
          </Pressable> */
            }
          )}
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

export default memo(BookingDetailCard);
