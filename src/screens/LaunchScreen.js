import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {IsWalletExist, CreateWallet} from '../wallet/WalletFactory';
import colors from '../config/Colors';

const LaunchScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');

  const checkWallet = async () => {
    try {
      setLoadingText('Fetching wallet');
      // delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isExist = await IsWalletExist();
      if (!isExist) {
        console.log('Creating new wallet');
        setLoadingText('Creating new wallet');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await CreateWallet();
      }
      navigation.replace('MainApp');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWallet();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>PSET</Text>
        </View>
        <ActivityIndicator size="large" color={colors.textGray} />
        <Text style={styles.text}>{loadingText}</Text>
      </View>
    );
  }

  return null;
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
