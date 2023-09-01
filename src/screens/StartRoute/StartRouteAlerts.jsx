import moment from "moment";

import { VStack, Text } from "native-base";
import { vndFormat } from "../../utils/numberUtils";
import ConfirmAlert from "../../components/Alert/ConfirmAlert";
import { getDifference } from "../../utils/datetimeUtils";

const StartRouteConfirmAlert = ({
  tripDate,
  pickupTime,
  duration,
  handleOkPress,
  confirmOpen,
  setConfirmOpen,
  // key,
}) => {
  const description = () => {
    // console.log(pickupTime);
    const pickupDateTime = moment(
      `${moment(tripDate, "YYYY-MM-DD").format("DD/MM/YYYY")} ${pickupTime}`,
      "DD/MM/YYYY HH:mm:ss"
    );
    const { diffDays, diffHours, diffMinutes } = getDifference(
      moment(),
      pickupDateTime
    );

    if (diffDays >= 1 || diffMinutes > duration + 20) {
      let differenceString = "";
      if (diffDays >= 1) {
        differenceString = `${diffDays} ngày, ${
          diffHours - diffDays * 24
        } giờ, ${diffMinutes - diffHours * 60} phút`;
      } else if (diffHours >= 1) {
        differenceString = `${diffHours} giờ, ${
          diffMinutes - diffHours * 60
        } phút`;
      } else {
        differenceString = `${diffMinutes} phút`;
      }

      return (
        <VStack>
          <Text>
            Còn <Text bold>{differenceString}</Text> nữa mới đến giờ đón khách.
            Bạn có chắc chắn muốn bắt đầu chuyến đi chứ?
          </Text>
        </VStack>
      );
    }

    return (
      <VStack>
        <Text>Bạn có chắc chắn muốn bắt đầu chuyến đi chứ?</Text>
      </VStack>
    );
  };

  return (
    <ConfirmAlert
      title="Bắt đầu chuyến đi"
      description={description()}
      okButtonText="Chắc chắn"
      cancelButtonText="Hủy"
      onOkPress={() => handleOkPress()}
      isOpen={confirmOpen}
      setIsOpen={setConfirmOpen}
      key={`start-trip-alert`}
    />
  );
};

export default StartRouteConfirmAlert;
