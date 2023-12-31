import { Box, HStack, Image, Pressable, Text, VStack } from "native-base";
import { calculateAge } from "../../utils/datetimeUtils";
import { toPercent } from "../../utils/numberUtils";
import { ColorType } from "native-base/lib/typescript/components/types";
import {
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
} from "react-native-heroicons/outline";
import { themeColors } from "../../../assets/theme";
import call from "react-native-phone-call";
import { handleError } from "../../utils/alertUtils";
import { getCancelRateTextColor } from "../../utils/userUtils";
import { useNavigation } from "@react-navigation/native";
import { memo } from "react";
interface CustomerInformationCardProps {
  customer: any;
  displayCustomerText?: boolean | undefined;
  displayCall?: boolean;
  bookingDetailId?: string;
}

const CustomerInformationCard = ({
  customer,
  displayCustomerText = true,
  displayCall = false,
  bookingDetailId = undefined,
}: CustomerInformationCardProps) => {
  const navigation = useNavigation();

  const handleCall = (phoneNumber: string) => {
    const args = {
      number: phoneNumber,
      prompt: true,
    };
    try {
      call(args);
    } catch (error) {
      handleError("Có lỗi xảy ra", error, navigation);
    }
  };

  return (
    <>
      {customer && (
        <>
          <HStack alignItems="center">
            <Image
              source={
                customer.avatarUrl
                  ? { uri: customer.avatarUrl }
                  : require("../../../assets/images/no-image.jpg")
              }
              // style={styles.image}
              alt="Ảnh đại diện"
              size={60}
              borderRadius={100}
            />
            <VStack paddingLeft={5}>
              {displayCustomerText && (
                <Text>
                  Khách hàng <Text bold>{customer.name}</Text>
                </Text>
              )}
              {!displayCustomerText && <Text bold>{customer.name}</Text>}
              <HStack>
                <Text>
                  {`${customer.gender == true ? "Nam" : "Nữ"}${
                    customer.dateOfBirth
                      ? ` | ${calculateAge(customer.dateOfBirth)} tuổi`
                      : ""
                  }`}
                </Text>
              </HStack>
              <Text>
                Tỉ lệ hủy chuyến:{" "}
                <Text color={getCancelRateTextColor(customer.canceledTripRate)}>
                  {toPercent(customer.canceledTripRate)}
                </Text>
              </Text>
            </VStack>
          </HStack>

          {displayCall && (
            <HStack justifyContent="flex-end" mt="2">
              <Box
                borderWidth={1}
                rounded="md"
                p="1"
                borderColor={themeColors.primary}
              >
                <Pressable onPress={() => handleCall(customer.phone)}>
                  <PhoneArrowUpRightIcon
                    size={25}
                    color={themeColors.primary}
                  />
                </Pressable>
              </Box>

              <Box
                borderWidth={1}
                rounded="md"
                p="1"
                borderColor={themeColors.primary}
                ml={"5"}
              >
                <Pressable
                  onPress={() =>
                    navigation.navigate("Message", {
                      bookingDetailId: bookingDetailId,
                      customer: customer,
                    })
                  }
                >
                  <ChatBubbleLeftRightIcon
                    size={25}
                    color={themeColors.primary}
                  />
                </Pressable>
              </Box>
            </HStack>
          )}
        </>
      )}
    </>
  );
};

export default memo(CustomerInformationCard);
