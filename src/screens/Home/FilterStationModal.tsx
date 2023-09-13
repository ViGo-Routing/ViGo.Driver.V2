import { Dispatch, SetStateAction, memo } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { Box, Modal, Text, VStack, View } from "native-base";
import { TouchableOpacity } from "react-native";
import { vigoStyles } from "../../../assets/theme";
import ViGoGooglePlacesAutocomplete from "../../components/Map/ViGoGooglePlacesAutocomplete";
import { SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";

interface FilterStationModalProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const FilterStationModal = ({
  modalVisible,
  setModalVisible,
}: FilterStationModalProps) => {
  const { isKeyboardVisible } = useKeyboard();

  return (
    <Modal
      isOpen={modalVisible}
      // onClose={() => {
      //   setModalVisible(false);
      // }}
      size={"xl"}
      // avoidKeyboard={true}
      pb={isKeyboardVisible ? "50%" : "0"}
      closeOnOverlayClick={false}
    >
      <Modal.Content>
        {/* <Modal.CloseButton /> */}
        <Modal.Header>Chọn vị trí</Modal.Header>
        <Modal.Body
          _scrollview={{
            keyboardShouldPersistTaps: "handled",
          }}
        >
          <ViGoGooglePlacesAutocomplete
            selectedPlace={null}
            handlePlaceSelection={(details) => {}}
            isInScrollView={true}
          />
        </Modal.Body>
        <Modal.Footer>
          <TouchableOpacity
            style={{ ...vigoStyles.buttonPrimary }}
            onPress={() => {
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

export default memo(FilterStationModal);
