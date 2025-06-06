import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ToastManager, {Toast} from 'toastify-react-native';

import Colors from '../config/Colors';
import TopBar from '../components/TopBar';
import LoadingScreen from './LoadingScreen';
import WalletFactory from '../wallet/WalletFactory';

function WalletInfo(props) {
  const [descriptor, setDescriptor] = useState('');
  const [bip49, setBip49] = useState('');
  const [bip84, setBip84] = useState('');
  const [bip87, setBip87] = useState('');
  const [loading, setLoading] = useState(false);

  const setWalletData = async () => {
    setLoading(true);
    const wallet = await WalletFactory.GetWolletInfo();
    setDescriptor(wallet?.descriptorString || '');
    setBip49(wallet?.bip49Xpub || '');
    setBip84(wallet?.bip84Xpub || '');
    setBip87(wallet?.bip87Xpub || '');
    setLoading(false);
  };

  useEffect(() => {
    setWalletData();
  }, []);

  onCopy = value => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Clipboard.setString(value);
    Toast.info('Copied to clipboard!', 'bottom');
  };

  const renderItem = name => {
    return (
      <TouchableOpacity onPress={() => onCopy(name)}>
        <View style={styles.item}>
          <View style={styles.nameContainer}>
            <Text style={styles.itemText}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar title="Wallet Info" showBackButton={false} />
      {loading && <LoadingScreen />}
      <ToastManager
        showCloseIcon={false}
        showProgressBar={false}
        style={styles.toastStyle}
        height={60}
        animationStyle={'rightInOut'}
        textStyle={styles.toastTextStyle}
        duration={1000}
        positionValue={100}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.group}>
          <Text style={styles.header}>DESCRIPTOR</Text>
          <View style={styles.itemGroup}>{renderItem(descriptor)}</View>
        </View>

        <View style={styles.group}>
          <Text style={styles.header}>XPUBS</Text>
          {!bip49 && !bip84 && !bip87 && (
            <View style={styles.itemGroup}>
              <Text style={[styles.itemText, {minHeight: 50, paddingTop: 15}]}>
                No xpubs found.
              </Text>
            </View>
          )}
          {bip49 && (
            <View style={styles.subheaderGroup}>
              <Text style={styles.subheader}>Bip49</Text>
              <View style={styles.itemGroup}>
                <View style={styles.itemGroup}>{renderItem(bip49)}</View>
              </View>
            </View>
          )}
          {bip84 && (
            <View style={styles.subheaderGroup}>
              <Text style={styles.subheader}>Bip84</Text>
              <View style={styles.itemGroup}>
                <View style={styles.itemGroup}>{renderItem(bip84)}</View>
              </View>
            </View>
          )}
          {bip87 && (
            <View style={styles.subheaderGroup}>
              <Text style={styles.subheader}>Bip87</Text>
              <View style={styles.itemGroup}>
                <View style={styles.itemGroup}>{renderItem(bip87)}</View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
    paddingTop: 70,
  },
  group: {
    width: '100%',
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textGray,
  },
  subheaderGroup: {
    marginBottom: 20,
  },

  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textGray,
    marginVertical: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  itemGroup: {
    marginTop: 10,
    borderBottomWidth: 0.2,
    backgroundColor: Colors.lightGray,
    borderBottomColor: Colors.textGray,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    color: Colors.white,
    alignSelf: 'center',
    verticalAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WalletInfo;
