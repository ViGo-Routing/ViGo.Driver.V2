import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../../assets/theme';

const CustomButton = ({ buttons }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.iconRow}>
      {buttons.map((button) => (
        <View style={styles.box} key={button.key}>
          <TouchableOpacity onPress={() => navigation.navigate(button.screen)}>
            <Image source={button.icon} style={styles.image} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconRow: {
    paddingTop: 10,
    flexDirection: 'row',
    padding: 10,
  },
  box: {
    borderRadius: 15,
    backgroundColor: themeColors.primary,
    padding: 5,
    marginHorizontal: 5,
  },
  image: {
    width: 40,
    height: 40,
  },
});

export default CustomButton;