import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { vigoStyles } from "../../../../assets/theme";
import { useState, useRef } from "react";
import { vndFormat } from "../../../utils/numberUtils";
import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  WarningOutlineIcon,
} from "native-base";

const TopupAmountModal = ({
  modalVisible,
  setModalVisible,
  onModalConfirm,
  onModalRequestClose,
}) => {
  const [amount, setAmount] = useState(null);

  const [isAmountInvalid, setIsAmountInvalid] = useState(false);

  const initialRef = useRef(null);

  const handleAmountChange = (newAmount) => {
    if (!newAmount || newAmount < 1000) {
      setIsAmountInvalid(true);
    } else {
      setIsAmountInvalid(false);
      setAmount(newAmount);
    }
  };

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
        setAmount(0);
        setModalVisible(!modalVisible);
      }}
      size={"xl"}
      avoidKeyboard={true}
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
      initialFocusRef={initialRef}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Nạp tiền vào ví</Modal.Header>
        <Modal.Body>
          {/* <View style={{ ...vigoStyles.modal, height: "50%" }}> */}

          {/* <TextInput
            style={styles.amountInput}
            placeholder="Nhập số tiền muốn nạp"
            keyboardType="numeric"
            onChangeText={(newAmount) => setAmount(newAmount)}
            defaultValue={amount ? amount : null}
          /> */}
          {/* <View style={{ ...vigoStyles.row }}>
            <Text style={{ fontSize: 12 }}>Nạp ít nhất {vndFormat(1000)}</Text>
            <Text style={{ fontSize: 12 }}>Đơn vị: đồng</Text>
          </View> */}

          <Box>
            <FormControl isInvalid={isAmountInvalid}>
              <InputGroup width="100%">
                <Input
                  width="80%"
                  keyboardType="numeric"
                  onChangeText={handleAmountChange}
                  defaultValue={amount ? amount : null}
                  placeholder="Nhập số tiền muốn nạp"
                  ref={initialRef}
                />
                <InputRightAddon width="20%" children={"đồng"} />
              </InputGroup>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Nạp ít nhất {vndFormat(1000)}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>

          {/* </View> */}
        </Modal.Body>
        <Modal.Footer>
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
              onModalConfirm(amount);
              setModalVisible(!modalVisible);
            }}
            disabled={isAmountInvalid}
            // activeOpacity={amount <= 1000 ? 1 : 0.7}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Xác nhận</Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default TopupAmountModal;

const styles = StyleSheet.create({
  amountInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
