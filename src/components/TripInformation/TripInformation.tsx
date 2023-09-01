import { Box, HStack, VStack, Text, ScrollView, Image } from "native-base";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import {
  calculateAge,
  toVnDateString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { StyleSheet } from "react-native";
import { themeColors } from "../../../assets/theme";
import { toPercent, vndFormat } from "../../utils/numberUtils";
import { ClockIcon as ClockOutlineIcon } from "react-native-heroicons/outline";
import CustomerInformationCard from "../Card/CustomerInformationCard";

interface TripBasicInformationProps {
  item?: any;
  displayFull?: boolean;
  firstPosition?: any;
  secondPosition?: any;
}

const TripBasicInformation = ({
  item,
  displayFull = false,
  firstPosition,
  secondPosition,
}: TripBasicInformationProps) => {
  return (
    <Box>
      {item && (
        <>
          <HStack alignItems="center" justifyContent="space-between">
            <Box>
              <HStack alignItems="center">
                <VStack alignItems="center" justifyContent="center">
                  <CalendarDaysIcon size={25} color="#00A1A1" />
                </VStack>
                <VStack paddingLeft="3">
                  <Text bold>Ngày đón</Text>
                  <Text
                    style={{
                      // paddingLeft: 5,
                      paddingBottom: 1,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {toVnDateString(item.date)}
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <Box paddingRight={6}>
              <HStack alignItems="center">
                <VStack alignItems="center" justifyContent="center">
                  {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
                  <ClockIcon size={25} color="#00A1A1" />
                </VStack>

                <VStack paddingLeft="3">
                  <Text bold>Giờ đón</Text>

                  <Text
                    style={{
                      // paddingLeft: 5,
                      paddingBottom: 5,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {toVnTimeString(item.customerDesiredPickupTime)}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </HStack>

          <HStack alignItems="center" marginTop={3}>
            <Box>
              <HStack alignItems={displayFull ? "flex-start" : "center"}>
                <VStack alignItems="center">
                  <MapPinIcon size={25} color="#00A1A1" />
                </VStack>

                <VStack paddingLeft="3">
                  <Text bold>Điểm đón</Text>

                  <Text
                    style={{
                      // paddingLeft: 5,
                      paddingBottom: 5,
                      fontSize: 15,
                    }}
                    maxWidth="95%"
                    paddingRight="0.5"
                    isTruncated={!displayFull}
                  >
                    {`${item.startStation.name}, ${item.startStation.address}`}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </HStack>

          <HStack alignItems="center" width="100%" marginTop={3}>
            <Box>
              <HStack alignItems={displayFull ? "flex-start" : "center"}>
                <VStack alignItems="center">
                  <MapPinIcon size={25} color="#00A1A1" />
                </VStack>

                <VStack paddingLeft="3">
                  <Text bold>Điểm đến</Text>
                  <Text
                    style={{
                      // paddingLeft: 5,
                      paddingBottom: 5,
                      fontSize: 15,
                    }}
                    width="95%"
                    paddingRight="0.5"
                    maxWidth="95%"
                    isTruncated={!displayFull}
                  >
                    {`${item.endStation.name}, ${item.endStation.address}`}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </HStack>
        </>
      )}
      {!item && firstPosition && secondPosition && (
        <>
          <HStack alignItems="center" marginTop={3}>
            <Box>
              <HStack alignItems={displayFull ? "flex-start" : "center"}>
                <VStack alignItems="center">
                  <MapPinIcon size={25} color="#00A1A1" />
                </VStack>

                <VStack paddingLeft="3">
                  <Text bold>Điểm đón</Text>

                  <Text
                    style={{
                      paddingBottom: 5,
                      fontSize: 15,
                    }}
                    maxWidth="95%"
                    paddingRight="0.5"
                    isTruncated={!displayFull}
                  >
                    {`${firstPosition.name}, ${firstPosition.formatted_address}`}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </HStack>
          <HStack alignItems="center" width="100%" marginTop={3}>
            <Box>
              <HStack alignItems={displayFull ? "flex-start" : "center"}>
                <VStack alignItems="center">
                  <MapPinIcon size={25} color="#00A1A1" />
                </VStack>

                <VStack paddingLeft="3">
                  <Text bold>Điểm đến</Text>
                  <Text
                    style={{
                      paddingBottom: 5,
                      fontSize: 15,
                    }}
                    width="95%"
                    paddingRight="0.5"
                    maxWidth="95%"
                    isTruncated={!displayFull}
                  >
                    {`${secondPosition.name}, ${secondPosition.formatted_address}`}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </HStack>
        </>
      )}
    </Box>
  );
};

interface TripFullInformationProps {
  item?: any;
  // handlePickBooking: () => void | undefined;
  customer?: any;
  // navigation: any;
  duration: number;
  distance: number;
  firstPosition?: any;
  secondPosition?: any;
}
const TripFullInformation = ({
  item,
  // handlePickBooking = undefined,
  customer = null,
  // navigation,
  // toggleBottomSheet,
  duration,
  distance,
  firstPosition,
  secondPosition,
}: TripFullInformationProps) => {
  return (
    <Box>
      <ScrollView>
        <TripBasicInformation
          item={item}
          firstPosition={firstPosition}
          secondPosition={secondPosition}
          displayFull={true}
        />
        <HStack alignItems="center">
          <Box>
            <HStack paddingTop={3} alignItems="center">
              <VStack alignItems="center">
                <MapIcon size={25} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Khoảng cách</Text>
                <Text
                  style={{
                    // paddingLeft: 5,
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  maxWidth="100%"
                  paddingRight="0.5"
                  // isTruncated
                >
                  {`${distance.toFixed(2)} km`}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </HStack>
        <HStack alignItems="center">
          <Box>
            <HStack paddingTop={3} alignItems="center">
              <VStack alignItems="center">
                <ClockOutlineIcon size={25} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Thời gian di chuyển (dự kiến)</Text>
                <Text
                  style={{
                    // paddingLeft: 5,
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  maxWidth="100%"
                  paddingRight="0.5"
                  // isTruncated
                >
                  {`${Math.ceil(duration)} phút`}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </HStack>
        <Box mt={3}>
          <CustomerInformationCard displayCustomerText customer={customer} />
        </Box>

        {item && (
          <HStack justifyContent="flex-end" marginTop="3">
            <Box backgroundColor={themeColors.linear} p="4" rounded="xl">
              <Text fontSize="2xl" style={styles.titlePrice}>
                {vndFormat(item.price)}
              </Text>
            </Box>
          </HStack>
        )}
        {/* <Box p="4" rounded="xl">
        <Text bold fontSize="2xl" textAlign="right" color={themeColors.primary}>
          {vndFormat(item.price)}
        </Text>
      </Box> */}
      </ScrollView>
    </Box>
  );
};

interface TripTransitionProps {
  firstPoint: any;
  secondPoint: any;
  duration: number;
  distance: number;
}
const TripTransition = ({
  firstPoint,
  secondPoint,
  duration,
  distance,
}: TripTransitionProps) => {
  return (
    <ScrollView>
      <Text>
        Đây là đường đi kết nối giữa 2 tuyến đường của bạn, từ điểm kết thúc của
        tuyến đường trước đó đến điểm bắt đầu của tuyến đường tiếp theo.
      </Text>

      <HStack alignItems="center" marginTop={5}>
        <Box>
          <HStack>
            <VStack alignItems="center">
              <MapPinIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text bold>Điểm bắt đầu</Text>

              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="95%"
                paddingRight="0.5"
                // isTruncated
              >
                {`${firstPoint.name}, ${firstPoint.formatted_address}`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
      <HStack width="100%" marginTop={3} alignItems="center">
        <Box>
          <HStack>
            <VStack alignItems="center">
              <MapPinIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text bold>Điểm kết thúc</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                width="95%"
                paddingRight="0.5"
                maxWidth="95%"
                // isTruncated
              >
                {`${secondPoint.name}, ${secondPoint.formatted_address}`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
      <HStack alignItems="center">
        <Box>
          <HStack paddingTop={3} alignItems="center">
            <VStack alignItems="center">
              <MapIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text bold>Khoảng cách</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                // isTruncated
              >
                {`${distance.toFixed(2)} km`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
      <HStack alignItems="center">
        <Box>
          <HStack paddingTop={3} alignItems="center">
            <VStack alignItems="center">
              <ClockOutlineIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text bold>Thời gian di chuyển (dự kiến)</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                // isTruncated
              >
                {`${Math.ceil(duration)} phút`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },

  body: {
    flex: 1,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
  titlePrice: {
    // fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export { TripBasicInformation, TripFullInformation, TripTransition };
