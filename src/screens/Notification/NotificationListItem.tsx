import { VStack, HStack, Box, Heading, Text } from "native-base";
import { BellAlertIcon } from "react-native-heroicons/solid";
import { themeColors } from "../../../assets/theme";
import { toVnDateTimeString } from "../../utils/datetimeUtils";
import { memo } from "react";

interface NotificationListItemProps {
  notification: any;
}

const NotificationListItem = ({ notification }: NotificationListItemProps) => {
  return (
    <VStack>
      <HStack>
        <Box width={"15%"} alignItems={"center"}>
          <BellAlertIcon size={30} color={themeColors.primary} />
        </Box>
        <Box width={"80%"}>
          <Heading size="sm">{notification.title}</Heading>
          <Text>{notification.description}</Text>
        </Box>
      </HStack>
      <Box alignItems="flex-end">
        <Text color={"#999"}>
          {toVnDateTimeString(notification.createdTime)}
        </Text>
      </Box>
    </VStack>
  );
};

export default memo(NotificationListItem);
