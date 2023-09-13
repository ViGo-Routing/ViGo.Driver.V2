import {
  Box,
  FormControl,
  HStack,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Select,
  Text,
  VStack,
  View,
} from "native-base";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { vigoStyles } from "../../../assets/theme";
import CheckBox from "@react-native-community/checkbox";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { getMetroStations } from "../../services/stationService";
import { getErrorMessage, handleError } from "../../utils/alertUtils";
import { FilterOption } from "../Booking/FilterTripModal";
import FilterStationModal from "./FilterStationModal";
import { StackActions, useNavigation } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ViGoGooglePlacesAutocomplete from "../../components/Map/ViGoGooglePlacesAutocomplete";

export interface FilterBookingStation {
  name: string;
  value: string;
  address: string;
  type: "METRO" | "OTHER";
  latitude: number;
  longitude: number;
}

interface FilterBookingScreenProps {
  // setIsLoading: Dispatch<SetStateAction<boolean>>;
  // navigation: any;
  // modalVisible: boolean;
  // setModalVisible: Dispatch<SetStateAction<boolean>>;
  filterStartDate: Date | null;
  setFilterStartDate: Dispatch<SetStateAction<Date | null | undefined>>;
  filterEndDate: Date | null;
  setFilterEndDate: Dispatch<SetStateAction<Date | null | undefined>>;
  filterStartPickupTime: Date | null;
  setFilterStartPickupTime: Dispatch<SetStateAction<Date | null | undefined>>;
  filterEndPickupTime: Date | null;
  setFilterEndPickupTime: Dispatch<SetStateAction<Date | null | undefined>>;
  filterStartLocation: FilterBookingStation | null;
  setFilterStartLocation: Dispatch<SetStateAction<FilterBookingStation | null>>;
}

const FilterBookingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Filter
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [filterStartPickupTime, setFilterStartPickupTime] = useState(null);
  const [filterEndPickupTime, setFilterEndPickupTime] = useState(null);
  const [filterStartLocation, setFilterStartLocation] = useState(null);
  const [filterEndLocation, setFilterEndLocation] = useState(null);
  const [filterStartLocationRadius, setFilterStartLocationRadius] = useState(5);
  const [filterEndLocationRadius, setFilterEndLocationRadius] = useState(5);

  const [isDate, setIsDate] = useState(false);
  const [isPickupTime, setIsPickupTime] = useState(false);
  const [isStartStation, setIsStartStation] = useState(false);
  const [isEndStation, setIsEndStation] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartPickupTimePicker, setShowStartPickupTimePicker] =
    useState(false);
  const [showEndPickupTimePicker, setShowEndPickupTimePicker] = useState(false);

  const [metroStations, setMetroStations] = useState([] as any[]);
  const [filterStations, setFilterStations] = useState([] as FilterOption[]);

  const [modalStartStationVisible, setModalStartStationVisible] =
    useState(false);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const navigation = useNavigation();

  const formatDate = (rawDate: any) => {
    let date = new Date(rawDate);
    // console.log(dob);

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  const formatTime = (rawTime: any) => {
    let date = new Date(rawTime);

    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  };

  const getStations = useCallback(async () => {
    try {
      setIsLoading(true);
      const metroResponse = await getMetroStations();
      setMetroStations(metroResponse);

      let options = metroResponse.map((station: any) => {
        return {
          text: station.name,
          value: station.id,
        } as FilterOption;
      });
      options.push({
        text: "Khác",
        value: "other",
      } as FilterOption);

      setFilterStations(options);
    } catch (error) {
      handleError("Có lỗi xảy ra", getErrorMessage(error), navigation);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getStations();
  }, []);

  const handleSelectFilterStation = (
    item: string,
    setSelection: Dispatch<SetStateAction<FilterBookingStation | null>>,
    setModalVisible: Dispatch<SetStateAction<boolean>>
  ) => {
    if (item == "other") {
      // setSelection({
      //   type: "OTHER",
      //   name: "other",
      //   address: "other",
      //   value: "other",
      //   latitude: 0,
      //   longitude: 0,
      // });
      setModalVisible(true);
    } else {
      const station = metroStations.find((value) => value.id == item);
      setSelection({
        type: "METRO",
        name: station.name,
        address: station.address,
        value: station.id,
        latitude: station.latitude,
        longitude: station.longitude,
      });
    }
  };

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header
        title="Lọc các hành trình"
        backButtonDirection="down"
        onBackButtonPress={() => navigation.dispatch(StackActions.pop(1))}
      />

      <View style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Box>
              <HStack
                alignItems="center"
                key={"date-filter"}
                alignSelf="stretch"
              >
                <CheckBox
                  // alignSelf="stretch"
                  // marginRight={2}
                  style={{ marginRight: 5 }}
                  aria-label="Lọc theo ngày"
                  value={isDate}
                  key={"date"}
                  onValueChange={(value) => {
                    setIsDate(value);
                  }}
                />
                <Text>Theo ngày</Text>
              </HStack>
              {isDate && (
                <HStack alignItems="center">
                  <FormControl flex={1} pr="3">
                    <HStack alignItems="center">
                      <FormControl.Label mr="2">Từ</FormControl.Label>
                      <Pressable
                        flex={1}
                        // disabled={isSubmitted == true}
                        // isDisabled={isSubmitted}
                        onPress={() => {
                          setShowStartDatePicker(!showStartDatePicker);
                        }}
                      >
                        <Input
                          placeholder="Nhập ngày bắt đầu"
                          py="1"
                          value={
                            filterStartDate ? formatDate(filterStartDate) : ""
                          }
                          // onChangeText={setDob}
                          // ref={dobRef}
                          // style={styles.input}
                          backgroundColor={"white"}
                          isReadOnly={true}
                        />
                      </Pressable>
                    </HStack>
                    {showStartDatePicker && (
                      <RNDateTimePicker
                        mode="date"
                        onChange={(event, date) => {
                          if (event.type == "dismissed") {
                            // console.log("dismissed");
                            setShowStartDatePicker(false);
                          } else if (event.type == "set") {
                            setShowStartDatePicker(false);
                            setFilterStartDate(date);
                            // console.log("set");
                          }
                          // console.log(date);
                          // setDob(date);
                        }}
                        value={filterStartDate ?? new Date()}
                        // maximumDate={getMaximumDob()}
                        negativeButton={{ label: "Hủy" }}
                        positiveButton={{ label: "Xác nhận" }}
                      />
                    )}
                  </FormControl>

                  <FormControl flex={1}>
                    <HStack alignItems="center">
                      <FormControl.Label mr="2">Đến</FormControl.Label>
                      <Pressable
                        flex={1}
                        // disabled={isSubmitted == true}
                        // isDisabled={isSubmitted}
                        onPress={() => {
                          setShowEndDatePicker(!showEndDatePicker);
                        }}
                      >
                        <Input
                          placeholder="Nhập ngày kết thúc"
                          value={filterEndDate ? formatDate(filterEndDate) : ""}
                          py="1"
                          // onChangeText={setDob}
                          // ref={dobRef}
                          // style={styles.input}
                          backgroundColor={"white"}
                          isReadOnly={true}
                        />
                      </Pressable>
                    </HStack>
                    {showEndDatePicker && (
                      <RNDateTimePicker
                        mode="date"
                        onChange={(event, date) => {
                          if (event.type == "dismissed") {
                            // console.log("dismissed");
                            setShowEndDatePicker(false);
                          } else if (event.type == "set") {
                            setShowEndDatePicker(false);
                            setFilterEndDate(date);
                            // console.log("set");
                          }
                          // console.log(date);
                          // setDob(date);
                        }}
                        value={filterEndDate ?? new Date()}
                        // maximumDate={getMaximumDob()}
                        negativeButton={{ label: "Hủy" }}
                        positiveButton={{ label: "Xác nhận" }}
                      />
                    )}
                  </FormControl>
                </HStack>
              )}
            </Box>
            <Box mt="3">
              <HStack
                alignItems="center"
                key={"pickup-time-filter"}
                alignSelf="stretch"
              >
                <CheckBox
                  // alignSelf="stretch"
                  // marginRight={2}
                  style={{ marginRight: 5 }}
                  aria-label="Lọc theo giờ đón"
                  value={isPickupTime}
                  key={"pickup-time"}
                  onValueChange={(value) => {
                    setIsPickupTime(value);
                  }}
                />
                <Text>Theo giờ đón</Text>
              </HStack>
              {isPickupTime && (
                <HStack alignItems="center">
                  <FormControl flex={1} pr="3">
                    <HStack alignItems="center">
                      <FormControl.Label mr="2">Từ</FormControl.Label>
                      <Pressable
                        flex={1}
                        // disabled={isSubmitted == true}
                        // isDisabled={isSubmitted}
                        onPress={() => {
                          setShowStartPickupTimePicker(
                            !showStartPickupTimePicker
                          );
                        }}
                      >
                        <Input
                          placeholder="Nhập giờ bắt đầu"
                          py="1"
                          value={
                            filterStartPickupTime
                              ? formatTime(filterStartPickupTime)
                              : ""
                          }
                          // onChangeText={setDob}
                          // ref={dobRef}
                          // style={styles.input}
                          backgroundColor={"white"}
                          isReadOnly={true}
                        />
                      </Pressable>
                    </HStack>
                    {showStartPickupTimePicker && (
                      <RNDateTimePicker
                        mode="time"
                        onChange={(event, date) => {
                          if (event.type == "dismissed") {
                            // console.log("dismissed");
                            setShowStartPickupTimePicker(false);
                          } else if (event.type == "set") {
                            setShowStartPickupTimePicker(false);
                            setFilterStartPickupTime(date);
                            // console.log("set");
                          }

                          // console.log(date);
                          // setDob(date);
                        }}
                        value={filterStartPickupTime ?? new Date()}
                        // maximumDate={getMaximumDob()}
                        negativeButton={{ label: "Hủy" }}
                        positiveButton={{ label: "Xác nhận" }}
                      />
                    )}
                  </FormControl>

                  <FormControl flex={1}>
                    <HStack alignItems="center">
                      <FormControl.Label mr="2">Đến</FormControl.Label>
                      <Pressable
                        flex={1}
                        // disabled={isSubmitted == true}
                        // isDisabled={isSubmitted}
                        onPress={() => {
                          setShowEndPickupTimePicker(!showEndPickupTimePicker);
                        }}
                      >
                        <Input
                          placeholder="Nhập giờ kết thúc"
                          py="1"
                          value={
                            filterEndPickupTime
                              ? formatTime(filterEndPickupTime)
                              : ""
                          }
                          // onChangeText={setDob}
                          // ref={dobRef}
                          // style={styles.input}
                          backgroundColor={"white"}
                          isReadOnly={true}
                        />
                      </Pressable>
                    </HStack>
                    {showEndPickupTimePicker && (
                      <RNDateTimePicker
                        mode="time"
                        onChange={(event, date) => {
                          if (event.type == "dismissed") {
                            // console.log("dismissed");
                            setShowEndPickupTimePicker(false);
                          } else if (event.type == "set") {
                            setShowEndPickupTimePicker(false);
                            setFilterEndPickupTime(date);
                            // console.log("set");
                          }
                          // console.log(date);
                          // setDob(date);
                        }}
                        value={filterEndPickupTime ?? new Date()}
                        // maximumDate={getMaximumDob()}
                        negativeButton={{ label: "Hủy" }}
                        positiveButton={{ label: "Xác nhận" }}
                      />
                    )}
                  </FormControl>
                </HStack>
              )}
            </Box>
            <Box mt="3">
              <HStack
                alignItems="center"
                key={"start-station-filter"}
                alignSelf="stretch"
              >
                <CheckBox
                  // alignSelf="stretch"
                  // marginRight={2}
                  style={{ marginRight: 5 }}
                  aria-label="Lọc theo điểm đón"
                  value={isStartStation}
                  key={"start-station"}
                  onValueChange={(value) => {
                    setIsStartStation(value);
                  }}
                />
                <Text>Theo vị trí điểm đón</Text>
              </HStack>

              {isStartStation && (
                <VStack>
                  <FormControl>
                    <HStack alignItems="center">
                      <FormControl.Label mr="2">Vị trí</FormControl.Label>
                      <Select
                        py="1"
                        flex={1}
                        accessibilityLabel="Lọc theo vị trí điểm đón"
                        placeholder="Chọn điểm đón"
                        selectedValue={filterStartLocation?.value}
                        onValueChange={(item) => {
                          handleSelectFilterStation(
                            item,
                            setFilterStartLocation,
                            setModalStartStationVisible
                          );
                        }}
                        // color={"white"}
                        backgroundColor={"white"}
                      >
                        {filterStations.map((item) => (
                          <Select.Item
                            label={item.text}
                            value={`${item.value}`}
                            key={`${item.value}`}
                          />
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>

                  <FormControl mt="3">
                    <HStack alignItems="center">
                      <FormControl.Label mr="2">
                        Trong bán kính
                      </FormControl.Label>
                      <Input
                        py="1"
                        flex={1}
                        accessibilityLabel="Lọc theo vị trí điểm đón"
                        placeholder="Bán kính kể từ vị trí đã chọn"
                        backgroundColor={"white"}
                        value={"5"}
                      />
                      <FormControl.Label ml="2">km</FormControl.Label>
                    </HStack>
                  </FormControl>

                  <FilterStationModal
                    key={"filter-start-station-select-location"}
                    modalVisible={modalStartStationVisible}
                    setModalVisible={setModalStartStationVisible}
                  />
                </VStack>
              )}
            </Box>
            <Box mt="3">
              <HStack
                alignItems="center"
                key={"end-station-filter"}
                alignSelf="stretch"
              >
                <CheckBox
                  // alignSelf="stretch"
                  // marginRight={2}
                  style={{ marginRight: 5 }}
                  aria-label="Lọc theo điểm đến"
                  value={isEndStation}
                  key={"end-station"}
                  onValueChange={(value) => {
                    setIsEndStation(value);
                  }}
                />
                <Text>Theo vị trí điểm đến</Text>
              </HStack>
            </Box>
          </ScrollView>
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {}}
            // disabled={isAmountInvalid}
            // activeOpacity={amount <= 1000 ? 1 : 0.7}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Xác nhận</Text>
          </TouchableOpacity>
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default memo(FilterBookingScreen);
