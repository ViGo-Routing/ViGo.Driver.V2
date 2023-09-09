import {
  Box,
  FormControl,
  Input,
  Modal,
  Select,
  Text,
  TextArea,
} from "native-base";
import { Dispatch, SetStateAction, memo, useState } from "react";
import { useKeyboard } from "../../../hooks/useKeyboard";
import { TouchableOpacity } from "react-native";
import { vigoStyles } from "../../../../assets/theme";
import { reportTypes } from "../../../utils/enumUtils/reportEnumUtils";

interface CreateReportModalProps {
  // bookingDetailId: string
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onModalConfirm: (
    reportType: "BOOKER_NOT_COMING" | "OTHER",
    title: string,
    description: string
  ) => void;
  onModalRequestClose: () => void;
  startStationName: string;
}

const CreateReportModal = ({
  modalVisible,
  setModalVisible,
  onModalConfirm,
  onModalRequestClose,
  startStationName,
}: CreateReportModalProps) => {
  const { isKeyboardVisible } = useKeyboard();

  const [selectedType, setSelectedType] = useState(reportTypes[0].type);
  const [title, setTitle] = useState("Khách hàng không đến điểm đón");
  const [description, setDescription] = useState(
    `Tôi đã đợi 5 phút nhưng không thấy khách hàng đến điểm đón ${startStationName}`
  );

  return (
    <Modal
      // style={vigoStyles.modal}
      // animationType="slide"
      // transparent={true}
      // visible={modalVisible}
      isOpen={modalVisible}
      onClose={() => {
        // onModalClose(amount);
        onModalRequestClose();
        // setAmount(0);
        setSelectedType(reportTypes[0].type);
        setTitle("Khách hàng không đến điểm đón");
        setDescription(
          `Tôi đã đợi 5 phút nhưng không thấy khách hàng đến điểm đón ${startStationName}`
        );
        setModalVisible(!modalVisible);
      }}
      size={"xl"}
      // avoidKeyboard={true}
      pb={isKeyboardVisible ? "50%" : "0"}
      // justifyContent="flex-end"
      // onRequestClose={() => {
      //   // onModalClose(amount);
      //   onModalRequestClose();
      //   setAmount(0);
      //   setModalVisible(!modalVisible);
      // }}
      // onDismiss={() => {
      //   // onModalClose(amount);
      // }}
      // initialFocusRef={initialRef}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Tạo báo cáo</Modal.Header>
        <Modal.Body>
          <Box>
            <FormControl>
              <FormControl.Label>Loại báo cáo</FormControl.Label>
              <Select
                accessibilityLabel="Loại báo cáo"
                placeholder="Loại báo cáo"
                selectedValue={selectedType}
                onValueChange={(selectedType) => {
                  setSelectedType(selectedType);
                }}
              >
                {reportTypes.map((item) => (
                  <Select.Item
                    label={item.text}
                    value={item.type}
                    key={item.type}
                  />
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormControl.Label>Tiêu đề</FormControl.Label>
              <Input
                placeholder="Nhập tiêu đề"
                value={title}
                keyboardType="default"
                onChangeText={setTitle}
                // variant={"filled"}
                // style={{ backgroundColor: "white" }}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormControl.Label>Chi tiết</FormControl.Label>
              <TextArea
                placeholder="Miêu tả chi tiết báo cáo"
                value={description}
                keyboardType="default"
                onChangeText={setDescription}
                autoCompleteType={""}
                // variant={"filled"}
                // style={{ backgroundColor: "white" }}
              />
            </FormControl>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              // if (!amount || amount < 1000) {
              //   setIsAmountInvalid(true);
              // } else {
              //   onModalConfirm(amount);
              //   setModalVisible(!modalVisible);
              // }
              onModalConfirm(selectedType, title, description);
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

export default memo(CreateReportModal);
