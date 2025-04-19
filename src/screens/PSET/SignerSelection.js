import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useRealm} from '@realm/react';

import TopBar from '../../components/TopBar';
import Screen from '../Screen';
import Colors from '../../config/Colors';
import WalletFactory from '../../wallet/WalletFactory';
import LoadingScreen from '../LoadingScreen';
import {AppContext} from '../../context/AppContext';
import {getWallet} from '../../services/WalletService';
import Constants from '../../config/Constants';

function SignerSelection(props) {
  const [isWalletExist, setIsWalletExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const {useTestnet, setAppSettingByKey} = useContext(AppContext);
  const realm = useRealm();

  useEffect(() => {
    checkWalletAvailability();
  }, []);

  const checkWalletAvailability = async () => {
    // For testnet, uncomment this line
    //setAppSettingByKey(Constants.USE_TESTNET, 'true');
    const wallet = await getWallet(realm, useTestnet);
    if (wallet) {
      setIsWalletExist(true);
    }
  };

  const onSignWithMnemonic = async () => {
    setLoading(true);
    if (isWalletExist) {
      props.navigation.navigate('BottomTabs', {screen: 'Home'});
      return;
    }
    setLoading(false);
    props.navigation.navigate('SignWithMnemonic');
  };

  const onSignWithJade = () => {};

  const onViewPSET = () => {
    props.navigation.navigate('Descriptor');
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Select Signing Option" showBackButton={false} />
      {loading && <LoadingScreen text="Loading Wallet..." />}
      {useTestnet && (
        <View style={styles.testnetPanel}>
          <Text style={styles.testnetText}>
            Warning: Testnet is enabled. All transactions are simulated and hold
            no monetary value.
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <TouchableOpacity
          onPress={onSignWithMnemonic}
          style={styles.buttonContainer}>
          <Text style={styles.buttonText}>
            {isWalletExist ? 'Open Wallet to Sign' : 'Sign with Mnemonic'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onViewPSET} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>View PSET with descriptor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={true}
          onPress={onSignWithJade}
          style={[styles.buttonContainer, {backgroundColor: Colors.lightGray}]}>
          <Text style={styles.buttonText}>Sign with Jade</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    margin: 40,
    marginVertical: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
  testnetPanel: {
    backgroundColor: Colors.error,
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  testnetText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignerSelection;
