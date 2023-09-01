import { Box, HStack, Image, Pressable, Text, VStack } from "native-base";
import { calculateAge } from "../../utils/datetimeUtils";
import { toPercent } from "../../utils/numberUtils";
import { ColorType } from "native-base/lib/typescript/components/types";
import { PhoneArrowUpRightIcon } from "react-native-heroicons/outline";
import { themeColors } from "../../../assets/theme";
import call from "react-native-phone-call";
import { handleError } from "../../utils/alertUtils";
interface CustomerInformationCardProps {
  customer: any;
  displayCustomerText?: boolean | undefined;
  displayCall?: boolean;
}

const CustomerInformationCard = ({
  customer,
  displayCustomerText = true,
  displayCall = false,
}: CustomerInformationCardProps) => {
  const getCancelRateTextColor = (rate: number): ColorType => {
    if (rate <= 0.25) {
      return "green.500";
    } else if (rate <= 0.5) {
      return "orange.500";
    } else {
      return "red.500";
    }
  };

  const handleCall = (phoneNumber: string) => {
    const args = {
      number: phoneNumber,
      prompt: true,
    };
    try {
      call(args);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    }
  };

  return (
    <>
      {customer && (
        <>
          <HStack>
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
            </HStack>
          )}
        </>
      )}
    </>
  );
};

export default CustomerInformationCard;
