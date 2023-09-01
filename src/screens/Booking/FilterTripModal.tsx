import { useState } from "react";
import { distinct } from "../../utils/arrayUtils";
import { Box, HStack, Modal, Text } from "native-base";
import CheckBox from "@react-native-community/checkbox";
import { vigoStyles } from "../../../assets/theme";
import { TouchableOpacity } from "react-native";

export interface FilterOption {
  text: string;
  value: string;
}

interface FilterTripModalProps {
  options: Array<FilterOption>;
  initialSelectedOptions: Array<string>;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onModalConfirm: (selectedOptions: Array<string>) => void;
  onModalRequestClose: () => void;
}

const FilterTripModal = ({
  options,
  initialSelectedOptions = [],
  modalVisible,
  setModalVisible,
  onModalConfirm,
  onModalRequestClose,
}: FilterTripModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );

  const firstColumnCount = Math.ceil(options.length / 2);
  const secondColumnCount = options.length - firstColumnCount;

  const handleOptionClick = (selected: boolean, value: string) => {
    let newSelected = [...selectedOptions];
    if (selected == true) {
      newSelected.push(value);
    } else {
      const index = newSelected.findIndex((item) => item == value);
      if (index >= 0) {
        newSelected.splice(index, 1);
      }
    }
    newSelected.filter(distinct);
    setSelectedOptions(newSelected);
  };

  const renderFilterOptions = (option: FilterOption) => {
    const text =
      option.text == "CN" ? "Chủ nhật" : "Thứ " + option.text.substring(1);

    return (
      <HStack alignItems="center" key={option.value} alignSelf="stretch">
        <CheckBox
          // alignSelf="stretch"
          // marginRight={2}
          style={{ marginRight: 5 }}
          aria-label="Chọn lọc chuyến đi"
          value={selectedOptions.includes(option.value)}
          key={option.value}
          onValueChange={(value) => {
            handleOptionClick(value, option.value);
          }}
        />
        <Text>{text}</Text>
      </HStack>
    );
  };

  return (
    <Modal
      isOpen={modalVisible}
      onClose={() => {
        onModalRequestClose();
        setSelectedOptions([] as Array<string>);
        setModalVisible(false);
      }}
      size={"lg"}
      avoidKeyboard={true}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Lọc chuyến đi theo ngày trong tuần</Modal.Header>
        <Modal.Body>
          <HStack justifyContent="space-between">
            <Box>
              {options.slice(0, firstColumnCount).map((option) => (
                <Box key={option.value}>{renderFilterOptions(option)}</Box>
              ))}
            </Box>
            <Box paddingRight={5}>
              {options.slice(firstColumnCount).map((option) => (
                <Box key={option.value}>{renderFilterOptions(option)}</Box>
              ))}
            </Box>
          </HStack>
        </Modal.Body>
        <Modal.Footer>
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              onModalConfirm(selectedOptions);
              setModalVisible(!modalVisible);
            }}
            // disabled={isAmountInvalid}
            // activeOpacity={amount <= 1000 ? 1 : 0.7}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Xác nhận</Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default FilterTripModal;
