import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

const CustomBottomSheet = ({ isVisible, onClose }) => {
    const translateY = new Animated.Value(300); // Set initial translateY to move the sheet off the screen

    React.useEffect(() => {
        Animated.spring(translateY, {
            toValue: isVisible ? 0 : 300,
            useNativeDriver: true,
        }).start();
    }, [isVisible]);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" type="Ionicons" />
            </TouchableOpacity>
            <View style={styles.content}>
                {/* Your custom content goes here */}
                <Text>Custom Bottom Sheet Content</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomBottomSheet;