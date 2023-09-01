import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  View,
  Avatar,
  Text,
  Box,
  HStack,
  Icon,
  Button,
  useTheme,
  VStack,
  Divider,
  Input,
  TextArea,
  Flex,
  Center,
} from "native-base";
import { StarIcon } from "react-native-heroicons/solid";

import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../../../assets/theme";
import { MinusIcon } from "react-native-heroicons/solid";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowsUpDownIcon,
  CurrencyDollarIcon,
} from "react-native-heroicons/outline";
import WelcomeDriverHeader from "../../components/Header/WelcomeDriverHeader";
export const CustomerDetailScreen = () => {
  //const { customer } = route.params;
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <View>
      <WelcomeDriverHeader
        title={`Chi tiết chuyến đi`}
        // subtitle="..."
        onBack={() => navigation.goBack()}
      />
      <Flex direction="column" alignItems="center" justifyContent="center">
        {/* <SelectRouteHeader
                title="Đánh giá"
                subtitle="Tài xế bạn đi như thế nào?"
                onBack={() => navigation.goBack()}
            /> */}
        <Box p={5}>
          <VStack space={5} alignItems="center">
            <Avatar
              size="xl"
              source={{
                uri: "https://example.com/avatar.jpg", // Replace with the actual avatar URL
              }}
            />
            <Text fontSize={25} fontWeight="bold">
              Customer Name
            </Text>
          </VStack>
        </Box>
        <Box borderRadius="md" alignItems="center">
          <View>
            <HStack alignItems="center" justifyContent="center">
              <Center style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    <PhoneIcon size={25} color="#00A1A1" />
                  </VStack>
                  <VStack alignItems="center">
                    <Text style={styles.title}>Số điện thoại</Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      kk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
              <Center style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
                    <CalendarDaysIcon size={25} color="#00A1A1" />
                  </VStack>

                  <VStack alignItems="center" justifyContent="center">
                    <Text style={styles.title}>Ngày sinh</Text>

                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      kkk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
            <HStack alignItems="center" justifyContent="center">
              <Center style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    <CalendarDaysIcon size={25} color="#00A1A1" />
                  </VStack>
                  <VStack alignItems="center">
                    <Text style={styles.title}>Ngày đón</Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      kk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
              <Center style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
                    <ClockIcon size={25} color="#00A1A1" />
                  </VStack>

                  <VStack alignItems="center" justifyContent="center">
                    <Text style={styles.title}>Giờ đón</Text>

                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      kkk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
            <HStack alignItems="center">
              <Center style={[styles.cardInsideLocation, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center">
                    <MapPinIcon size={25} color="#00A1A1" />
                  </VStack>

                  <VStack alignItems="center" justifyContent="center">
                    <Text style={styles.title}>Điểm đón</Text>

                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                      }}
                    >
                      kkk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
            <HStack alignItems="center" justifyContent="center">
              <Center style={[styles.cardInsideLocation, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    <MapPinIcon size={25} color="#00A1A1" />
                  </VStack>

                  <VStack alignItems="center" justifyContent="center">
                    <Text style={styles.title}>Điểm đến</Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                      }}
                    >
                      kkk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
            <HStack alignItems="center" justifyContent="center">
              <Center style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    <ArrowsUpDownIcon size={25} color="#00A1A1" />
                  </VStack>
                  <VStack alignItems="center">
                    <Text style={styles.title}>Loại chuyến</Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      kk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
              <Center style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
                    <CalendarDaysIcon size={25} color="#00A1A1" />
                  </VStack>

                  <VStack alignItems="center" justifyContent="center">
                    <Text style={styles.title}>Loại lịch</Text>

                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      kkk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
            <HStack alignItems="center" justifyContent="center">
              <Center style={[styles.cardInsideLocation, styles.shadowProp]}>
                <HStack alignItems="center" justifyContent="center">
                  <VStack alignItems="center" justifyContent="center">
                    <CurrencyDollarIcon size={25} color="#00A1A1" />
                  </VStack>

                  <VStack alignItems="center" justifyContent="center">
                    <Text style={styles.title}>Giá chuyến đi</Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                      }}
                    >
                      kkk
                    </Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
          </View>
        </Box>
      </Flex>
      {/* <Box borderRadius={8} backgroundColor="#00A1A1" my={5} w="83%" alignSelf="center" alignItems="center">
                <Button onPress={handlePickBooking} backgroundColor="#00A1A1">Nhận chuyến</Button>
            </Box> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    // flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 20,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    margin: 5,
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
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
});
