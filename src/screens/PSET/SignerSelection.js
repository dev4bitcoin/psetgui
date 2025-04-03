import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import TopBar from '../../components/TopBar';
import Screen from '../Screen';
import Colors from '../../config/Colors';
import {getDefaultWallet} from '../../services/WalletService';
import WalletFactory from '../../wallet/WalletFactory';
import LoadingScreen from '../LoadingScreen';

function SignerSelection(props) {
  //const {pset, psetDetails} = props.route.params;
  const [isWalletExist, setIsWalletExist] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkWalletAvailability();
  }, []);

  const checkWalletAvailability = async () => {
    const wallet = await getDefaultWallet();
    if (wallet) {
      setIsWalletExist(true);
    }
  };

  const onSignWithMnemonic = async () => {
    setLoading(true);
    if (isWalletExist) {
      await WalletFactory.init();
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
});

export default SignerSelection;
