import CheckBox from "@react-native-community/checkbox";
import { Box, HStack, VStack, Text, Badge } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ArchiveBoxArrowDownIcon,
  CalendarIcon,
  ClockIcon,
} from "react-native-heroicons/solid";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { themeColors } from "../../../assets/theme";
import { vndFormat } from "../../utils/numberUtils";
import { memo } from "react";

interface BookingDetailSmallCardProps {
  item: any;
  selectedDetails: Array<string>;
  handleClickOnTrip: (value: boolean, id: string) => void;
  bookingType: "ONE_WAY" | "ROUND_TRIP";
  navigation: any;
}

const BookingDetailSmallCard = ({
  item,
  selectedDetails,
  handleClickOnTrip,
  bookingType,
  navigation,
}: BookingDetailSmallCardProps) => {
  return (
    <HStack
      // flexDirection={"row"}
      // flexWrap={"wrap"}
      // flex={1}
      alignItems="center"
      key={item.id}
    >
      <CheckBox
        style={{ marginRight: 5 }}
        aria-label="Chọn chuyến đi"
        value={selectedDetails.includes(item.id)}
        key={item.id}
        onValueChange={(value) => {
          handleClickOnTrip(value, item.id);
        }}
      />
      <Box style={[styles.cardInsideDateTime]} shadow={1} flex={1}>
        <TouchableOpacity
          onPress={() => navigation.navigate("BookingDetail", { item })}
        >
          <HStack justifyContent="space-between" py={2}>
            <VStack>
              <HStack alignItems="center">
                <ClockIcon size={20} color="#00A1A1" />
                <Text marginLeft={2}>Giờ đón</Text>
              </HStack>
              <HStack alignItems="center">
                <CalendarIcon size={20} color="#00A1A1" />
                <Text marginLeft={2}>Ngày đón</Text>
              </HStack>
            </VStack>
            <VStack marginRight={2} marginLeft={2}>
              <Text bold color="black">
                {toVnTimeString(item.customerDesiredPickupTime)}
              </Text>

              <Text bold color="black">
                {`${item.dayOfWeek}, ${toVnDateString(item.date)}`}
              </Text>
            </VStack>
          </HStack>
          {(bookingType == "ONE_WAY" ||
            (bookingType == "ROUND_TRIP" && item.type == "MAIN_ROUTE")) && (
            <HStack justifyContent="flex-end" mb="2">
              <Box
                // alignSelf="flex-end"
                backgroundColor={themeColors.linear}
                // p="4"
                px="3"
                py="2"
                rounded="xl"
              >
                <Text style={styles.titlePrice}>{vndFormat(item.price)}</Text>
              </Box>
            </HStack>
          )}
          {bookingType == "ROUND_TRIP" && item.type != "MAIN_ROUTE" && (
            <HStack justifyContent="space-between" mb="2">
              <Badge paddingTop={0} paddingBottom={0} colorScheme={"info"}>
                Chuyến về
              </Badge>
              <Box
                // alignSelf="flex-end"
                backgroundColor={themeColors.linear}
                // p="4"
                px="3"
                py="2"
                rounded="xl"
              >
                <Text style={styles.titlePrice}>{vndFormat(item.price)}</Text>
              </Box>
            </HStack>
          )}
        </TouchableOpacity>
      </Box>
    </HStack>
  );
};

const styles = StyleSheet.create({
  cardInsideDateTime: {
    // flexGrow: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,

    paddingHorizontal: 15,
    // width: "100%",
    marginVertical: 10,
    // marginHorizontal: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 2,
    // flexDirection: "row",
    // margin: 5,
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    paddingLeft: 10,
  },
  titlePrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export default memo(BookingDetailSmallCard);
