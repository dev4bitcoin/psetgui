import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TopBar from '../../components/TopBar';
import Screen from '../Screen';
import Colors from '../../config/Colors';
import Constants from '../../config/Constants';
import {AppContext} from '../../context/AppContext';

function DenominationSelection(props) {
  const {setAppSettingByKey, preferredBitcoinUnit, useTestnet} =
    useContext(AppContext);

  const sats = useTestnet ? Constants.TEST_SATS : Constants.SATS;
  const bits = useTestnet ? Constants.TEST_BITS : Constants.BITS;
  const mbtc = useTestnet ? Constants.TEST_MBTC : Constants.MBTC;
  const btc = useTestnet ? Constants.TEST_BTC : Constants.BTC;

  const onSelect = async name => {
    setAppSettingByKey(
      useTestnet
        ? Constants.PREFERRED_BITCOIN_UNIT_TESTNET
        : Constants.PREFERRED_BITCOIN_UNIT,
      name,
    );
    props.navigation.goBack();
  };

  const renderItem = (name, definition, isSelected) => {
    return (
      <TouchableOpacity onPress={() => onSelect(name)}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{name}</Text>
          <View style={styles.selectionContainer}>
            <Text style={styles.definitionText}>{definition}</Text>
            <View style={styles.icon}>
              {isSelected && (
                <Icon name="check" size={25} color={Colors.priceGreen} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TopBar title="Denomination" showBackButton={true} />
        <View style={styles.group}>
          {renderItem(
            sats,
            '1 sat = 0.00 0000 001 btc',
            preferredBitcoinUnit === sats,
          )}
          {renderItem(
            bits,
            '1 bit = 0.00 000 100 btc',
            preferredBitcoinUnit === bits,
          )}
          {renderItem(
            mbtc,
            '1 mbtc = 0.00 100 btc',
            preferredBitcoinUnit === mbtc,
          )}
          {renderItem(btc, '1 btc', preferredBitcoinUnit === btc)}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  group: {
    width: '100%',
    padding: 10,
  },
  itemGroup: {
    width: '100%',
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.textGray,
    padding: 20,
    paddingRight: 10,
  },
  itemText: {
    fontSize: 18,
    color: Colors.white,
  },
  definitionText: {
    fontSize: 16,
    color: Colors.textGray,
    marginRight: 10,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
  },
});

export default DenominationSelection;
