import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Colors from '../config/Colors';

const BottomModal = ({visible, onClose, items = []}) => {
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContainer,
            {transform: [{translateY: slideAnim}]},
          ]}>
          {items.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onClose(item)}>
                <Text style={styles.closeButtonText}>{item?.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },

  closeButton: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderTopColor: Colors.textGray,
    borderTopWidth: 0.3,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 18,
    textTransform: 'uppercase',
    width: '100%',
    textAlign: 'center',
    paddingTop: 10,
  },
});

export default BottomModal;
