import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CreateNewWallet} from '../wallet/WalletFactory';
const LaunchScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);

  const checkWallet = async () => {
    try {
      console.log('Checking wallet');
      const wallet = await AsyncStorage.getItem('wallet');
      console.log(wallet);
      if (!wallet) {
        await CreateNewWallet();
      }
      navigation.replace('MainApp');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
    navigation.replace('MainApp');
    //checkWallet();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LaunchScreen;
