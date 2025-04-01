import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import Screen from './Screen';
import TopBar from '../components/TopBar';
import WalletFactory from '../wallet/WalletFactory';
import AssetFinder from '../helpers/assetFinder';
import Colors from '../config/Colors';

function AssetListScreen(props) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    parseData();
  }, []);

  const parseData = async () => {
    const assets = await WalletFactory.GetAssets();

    let assetList = [];

    assets?.forEach((value, key) => {
      console.log('key', key.toString());
      const assetInfo = AssetFinder.findAsset(key.toString());
      console.log('assetInfo', assetInfo);
      if (assetInfo) {
        const asset = {
          assetId: key.toString(),
          value: Number(value),
          entity: assetInfo[0],
          ticker: assetInfo[1],
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
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => onAssetPress(item)}>
              <Text style={styles.text}>{item.name}</Text>

              <Text style={styles.text}>
                {`${(item.value / Math.pow(10, item.precision)).toFixed(
                  item.precision,
                )} ${item.ticker}`}
              </Text>
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
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 30,
    borderWidth: 0.5,
    borderColor: Colors.textGray,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.cardBackground,
  },

  text: {
    color: Colors.white,
  },
});

export default AssetListScreen;
