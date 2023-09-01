import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

const ComboBox = ({ options, selectedOptions, onSelect }) => {
  const [value, setValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (text) => {
    setValue(text);
  };

  const handleSelectOption = (option) => {
    setValue(option);
    onSelect(option);
    setModalVisible(false);
  };

  const isOptionSelected = (option) => {
    return selectedOptions.includes(option);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setModalVisible(true)}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleInputChange}
          placeholder="Select options"
        />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionItem,
                isOptionSelected(item) && styles.selectedOptionItem,
              ]}
              onPress={() => handleSelectOption(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  input: {
    fontSize: 16,
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedOptionItem: {
    backgroundColor: "#f1f1f1",
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
});

export default ComboBox;
