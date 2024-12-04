import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/Colors';

function TransactionButtons(props) {
  return (
    <View style={styles.container}>
      <View style={styles.transactionButtons}>
        <TouchableOpacity>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="arrow-up" color={colors.white} size={35} />
            </View>
            <Text style={styles.iconText}>SEND</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="qrcode" color={colors.white} size={35} />
            </View>
            <Text style={styles.iconText}>SCAN</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="arrow-down" color={colors.white} size={35} />
            </View>
            <Text style={styles.iconText}>RECEIVE</Text>
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
    justifyContent: 'space-between',
    marginTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    padding: 10,
  },
  iconWrapper: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    padding: 20,
  },
  iconText: {
    color: colors.textGray,
    marginTop: 10,
  },
});

export default TransactionButtons;
