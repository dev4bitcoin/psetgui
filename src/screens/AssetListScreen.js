import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useRealm} from '@realm/react';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import WalletFactory from '../wallet/WalletFactory';
import Colors from '../config/Colors';
import Constants from '../config/Constants';
import {AppContext} from '../context/AppContext';
import UnitConverter from '../helpers/UnitConverter';
import LoadingScreen from './LoadingScreen';

function AssetListScreen(props) {
  const realm = useRealm();
  const {preferredBitcoinUnit} = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    init();
  }, [preferredBitcoinUnit]);

  const init = async () => {
    setLoading(true);
    await parseData();
    setLoading(false);
  };

  const getBalanceByPrecisionAndUnit = (assetId, value, precision) => {
    return assetId == Constants.LIQUID_TESTNET_ASSETID
      ? UnitConverter.displayBalanceInPreferredUnit(
          Number(value),
          preferredBitcoinUnit,
        )
      : (Number(value) / Math.pow(10, precision)).toFixed(precision);
  };

  const getTicker = (assetId, ticker) => {
    return assetId == Constants.LIQUID_TESTNET_ASSETID
      ? preferredBitcoinUnit
      : ticker || 'Unknown';
  };

  const parseData = async () => {
    const assets = await WalletFactory.GetStoredAssets(realm);
    setAssets(assets || []);

    await new Promise(resolve => setTimeout(resolve, 100));

    const updatedAssets = await WalletFactory.GetAssets(realm);
    setAssets(updatedAssets || []);
  };

  const onAssetPress = asset => {
    const assetToPass = {
      assetId: asset.assetId,
      balance: asset.balance,
      ticker: getTicker(asset.assetId, asset.ticker),
      precision: asset.precision,
    };
    props.navigation.navigate('Wallet', {asset: assetToPass});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const assets = await WalletFactory.GetAssets(realm);
    setAssets(assets || []);
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
              <Text style={styles.text}>{`${getBalanceByPrecisionAndUnit(
                item?.assetId,
                item?.balance,
                item?.precision,
              )} ${getTicker(item?.assetId, item?.ticker)}`}</Text>
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
