import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../config/Colors';

function Numpad({onPressNumber, onDelete}) {
  const renderButton = (label, onPress) => (
    <TouchableOpacity
      style={[styles.button, {paddingLeft: label === '.' ? 55 : 45}]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  const rendorButtonWithText = (label, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="arrow-left" color={Colors.white} size={25} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderButton('1', () => onPressNumber('1'))}
        {renderButton('2', () => onPressNumber('2'))}
        {renderButton('3', () => onPressNumber('3'))}
      </View>
      <View style={styles.row}>
        {renderButton('4', () => onPressNumber('4'))}
        {renderButton('5', () => onPressNumber('5'))}
        {renderButton('6', () => onPressNumber('6'))}
      </View>
      <View style={styles.row}>
        {renderButton('7', () => onPressNumber('7'))}
        {renderButton('8', () => onPressNumber('8'))}
        {renderButton('9', () => onPressNumber('9'))}
      </View>
      <View style={styles.row}>
        {renderButton('.', () => onPressNumber('.'))}
        {renderButton('0', () => onPressNumber('0'))}
        {rendorButtonWithText('Delete', onDelete)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 45,
    paddingRight: 45,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 30,
    color: Colors.white,
  },
});

export default Numpad;
