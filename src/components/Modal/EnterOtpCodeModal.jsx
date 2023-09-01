import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { useState } from "react";
import { XMarkIcon } from "react-native-heroicons/solid";

const EnterOtpCodeModal = ({
  phoneNumber,
  modalVisible,
  setModalVisible,
  onModalConfirm,
  onModalRequestClose,
  setCode,
}) => {
  const onModalClose = () => {
    onModalRequestClose();
    setModalVisible(false);
  };

  var otpInputRef = null;

  return (
    <Modal
      style={vigoStyles.modal}
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        onModalClose();
      }}
      onDismiss={() => {
        // onModalClose(amount);
      }}
      onShow={() => otpInputRef && otpInputRef.focus()}
    >
      <View style={{ ...vigoStyles.modal, ...{ height: "70%" } }}>
        <View
          style={{
            ...vigoStyles.row,
            ...{ marginTop: 0, flexDirection: "row-reverse" },
          }}
        >
          <TouchableOpacity onPress={() => onModalClose()}>
            <XMarkIcon size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 10 }}>
            Nhập mã OTP vừa được gửi đến SĐT {phoneNumber}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="OTP Code"
            onChangeText={setCode}
            keyboardType="phone-pad"
            ref={(ref) => {
              otpInputRef = ref;
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => onModalConfirm()}
          >
            <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EnterOtpCodeModal;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 20,
    // marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
});
