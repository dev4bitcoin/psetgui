import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';

import colors from '../config/Colors';

function SendToAddress(props) {
  const [address, setAddress] = useState('');

  const onPasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    setAddress(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputAndIconContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.icon}>
          <TouchableOpacity onPress={onPasteFromClipboard}>
            <Icon name="content-copy" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={onPasteFromClipboard}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputAndIconContainer: {
    marginTop: 50,
    flexDirection: 'row',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.textGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    marginLeft: 30,
    width: '70%',
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    padding: 10,
    paddingTop: 12,
    height: 55,
    marginLeft: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 20,
    color: colors.white,
  },
  button: {
    backgroundColor: colors.lightGray,
    padding: 15,
    width: 150,
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default SendToAddress;
