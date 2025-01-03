import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

import {
  IsWalletExist,
  CreateWallet,
  ResetWallets,
} from '../wallet/WalletFactory';
import colors from '../config/Colors';
import Storage from '../storage/Storage';
import Constants from '../config/Constants';

const LaunchScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const authenticateBiometricsIfAvailable = async () => {
    try {
      const resultObject = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint',
      });
      const {success} = resultObject;
      if (success) {
        // successful biometrics provided
        await checkWallet();
      } else {
        // user cancelled biometric prompt
      }
    } catch (error) {
      // biometrics failed
    }
  };

  const validateBiometricsIfEnabled = async () => {
    const status = await Storage.getItem(Constants.BIOMETRICS_DISPLAY_STATUS);

    if (!status) {
      await checkWallet();
      return;
    }
    await authenticateBiometricsIfAvailable();
  };

  const checkWallet = async () => {
    try {
      setLoading(true);
      setLoadingText('Loading wallet');
      await ResetWallets();

      // delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isExist = await IsWalletExist();
      if (!isExist) {
        setLoadingText('Creating new wallet');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await CreateWallet();
      }
      navigation.replace('BottomTabs');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateBiometricsIfEnabled();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>PSET</Text>
      </View>
      {loading && (
        <>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.text}>{loadingText}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    marginBottom: 20,
    height: 200,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: colors.textGray,
  },
  text: {
    paddingTop: 20,
    fontSize: 18,
    color: colors.textGray,
  },
});

export default LaunchScreen;
