import { Badge, HStack, Text } from "native-base";
import { memo } from "react";
import { TouchableOpacity } from "react-native";
import {
  getReportStatus,
  getReportStatusBadgeColorScheme,
  getReportText,
} from "../../utils/enumUtils/reportEnumUtils";
import { toVnDateTimeString } from "../../utils/datetimeUtils";

interface ReportListItemProps {
  item: any;
  navigation: any;
}

const ReportListItem = ({ item, navigation }: ReportListItemProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ReportDetail", {
          reportId: item.id,
        })
      }
    >
      <HStack justifyContent="space-between">
        <Badge colorScheme="info">{getReportText(item.type)}</Badge>
      </HStack>
      <Text mt="2" mb="2">
        {item.title}
      </Text>
      <HStack justifyContent="space-between">
        <Text color={"#999"}>{toVnDateTimeString(item.createdTime)}</Text>

        <Badge
          variant="solid"
          colorScheme={getReportStatusBadgeColorScheme(item.status)}
        >
          {getReportStatus(item.status)}
        </Badge>
      </HStack>
    </TouchableOpacity>
  );
};

export default memo(ReportListItem);
