import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import WalletFactory from '../wallet/WalletFactory';
import AssetFinder from '../helpers/assetFinder';
import Colors from '../config/Colors';
import Constants from '../config/Constants';
import {AppContext} from '../context/AppContext';
import UnitConverter from '../helpers/UnitConverter';
import LoadingScreen from './LoadingScreen';

function AssetListScreen(props) {
  const {preferredBitcoinUnit} = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    init();
  }, [preferredBitcoinUnit]);

  const init = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    // const assets = await WalletFactory.GetStoredAssets();
    // if (assets?.length > 0) await parseData(assets);

    const updatedAssets = await WalletFactory.GetAssets();
    await parseData(updatedAssets || []);
    setLoading(false);
  };

  const parseData = async assets => {
    let assetList = [];

    assets?.forEach(item => {
      const assetInfo = AssetFinder.findAsset(item?.assetId);
      if (assetInfo) {
        const ticker =
          item?.assetId == Constants.LIQUID_TESTNET_ASSETID
            ? preferredBitcoinUnit
            : assetInfo[1] || 'Unknown';

        const amount =
          item?.assetId == Constants.LIQUID_TESTNET_ASSETID
            ? UnitConverter.displayBalanceInPreferredUnit(
                Number(item?.value),
                preferredBitcoinUnit,
              )
            : (Number(item?.value) / Math.pow(10, assetInfo[3])).toFixed(
                assetInfo[3],
              );
        const asset = {
          assetId: item?.assetId,
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

  const onRefresh = async () => {
    setRefreshing(true);
    const updatedAssets = await WalletFactory.GetAssets();
    await parseData(updatedAssets || []);
    setRefreshing(false);
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Assets" />
      {loading && <LoadingScreen />}
      <View style={styles.listContainer}>
        <FlatList
          data={assets}
          keyExtractor={item => item.assetId}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.white}
            />
          }
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
    borderWidth: 0.3,
    borderColor: Colors.textGray,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    marginBottom: 10,
  },

  text: {
    color: Colors.white,
  },
});

export default AssetListScreen;
