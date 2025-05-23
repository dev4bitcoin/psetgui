import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/Colors';

function TransactionButtons({
  onSendPress,
  onReceivePress,
  onScanPress,
  hideLabel = false,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.transactionButtons}>
        <TouchableOpacity onPress={onSendPress}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="arrow-up" color={colors.white} size={35} />
            </View>
            {!hideLabel && <Text style={styles.iconText}>SEND</Text>}
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={onScanPress}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="qrcode" color={colors.white} size={35} />
            </View>
            {!hideLabel && <Text style={styles.iconText}>SCAN</Text>}
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={onReceivePress}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="arrow-down" color={colors.white} size={35} />
            </View>
            {!hideLabel && <Text style={styles.iconText}>RECEIVE</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  transactionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    padding: 10,
  },
  iconWrapper: {
    backgroundColor: colors.appBackground,
    borderRadius: 50,
    borderColor: colors.textGray,
    borderWidth: 0.5,
    padding: 20,
  },
  iconText: {
    color: colors.textGray,
    marginTop: 10,
  },
});

export default TransactionButtons;
