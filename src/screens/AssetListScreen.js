import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import WalletFactory from '../wallet/WalletFactory';
import AssetFinder from '../helpers/assetFinder';
import Colors from '../config/Colors';
import Constants from '../config/Constants';
import {AppContext} from '../context/AppContext';
import UnitConverter from '../helpers/UnitConverter';

function AssetListScreen(props) {
  const {preferredBitcoinUnit} = useContext(AppContext);

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    parseData();
  }, [preferredBitcoinUnit]);

  const parseData = async () => {
    const assets = await WalletFactory.GetAssets();

    let assetList = [];

    assets?.forEach((value, key) => {
      console.log('key', key.toString());
      const assetInfo = AssetFinder.findAsset(key.toString());
      if (assetInfo) {
        const ticker =
          key.toString() == Constants.LIQUID_TESTNET_ASSETID
            ? preferredBitcoinUnit
            : assetInfo[1] || 'Unknown';

        const amount =
          key.toString() == Constants.LIQUID_TESTNET_ASSETID
            ? UnitConverter.displayBalanceInPreferredUnit(
                Number(value),
                preferredBitcoinUnit,
              )
            : (Number(value) / Math.pow(10, assetInfo[3])).toFixed(
                assetInfo[3],
              );
        const asset = {
          assetId: key.toString(),
          value: amount,
          entity: assetInfo[0],
          ticker: ticker,
          name: assetInfo[2],
          precision: assetInfo[3],
        };

        assetList.push(asset);
      }
    });
    setAssets(assetList);
  };

  const onAssetPress = asset => {
    props.navigation.navigate('Wallet', {asset: asset});
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Assets" />

      <View style={styles.listContainer}>
        <FlatList
          data={assets}
          keyExtractor={item => item.assetId}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                {
                  borderTopColor: index === 0 ? Colors.textGray : 'transparent',
                  borderTopWidth: index === 0 ? 0.3 : 0,
                },
              ]}
              onPress={() => onAssetPress(item)}>
              <Text style={styles.text}>{item.name}</Text>

              <Text style={styles.text}>{`${item.value} ${item.ticker}`}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splitter: {
    marginTop: 30,
    marginHorizontal: 20,
    height: 0.3,
    backgroundColor: Colors.textGray,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.textGray,
    borderRadius: 5,
    marginBottom: 10,
    //backgroundColor: Colors.cardBackground,
  },

  text: {
    color: Colors.white,
  },
});

export default AssetListScreen;
