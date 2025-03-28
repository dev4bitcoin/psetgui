import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNRestart from 'react-native-restart';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';
import {deleteWallet} from '../services/WalletService';
import LoadingScreen from './LoadingScreen';

function SettingsScreen(props) {
  const [loading, setLoading] = React.useState(false);
  const onSelect = name => {
    if (name === 'Denomination') props.navigation.navigate('Denomination');
    if (name === 'App access') props.navigation.navigate('AppAccess');
    if (name === 'Recovery Phrase') props.navigation.navigate('RecoveryPhrase');
    if (name === 'About') props.navigation.navigate('About');
  };

  const onLogout = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to erase all wallet data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deleteWallet();
            setLoading(false);
            RNRestart.restart(); // Restart the app
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = (name, icon) => {
    return (
      <TouchableOpacity onPress={() => onSelect(name)}>
        <View style={styles.item}>
          <View style={styles.nameContainer}>
            <Icon name={icon} size={30} color={Colors.textGray} />
            <Text style={styles.itemText}>{name}</Text>
          </View>
          <Icon name="chevron-right" size={30} color={Colors.textGray} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TopBar title="Settings" showBackButton={false} />
        {loading && <LoadingScreen />}

        <View style={styles.group}>
          <Text style={styles.header}>GENERAL</Text>
          <View style={styles.itemGroup}>
            {renderItem('About', 'information-outline')}
            {renderItem('Denomination', 'currency-btc')}
          </View>
        </View>
        <View style={styles.group}>
          <Text style={styles.header}>PRIVACY & SECURITY</Text>
          <View style={styles.itemGroup}>
            {renderItem('App access', 'account-lock')}
            {renderItem('Recovery Phrase', 'key-variant')}
          </View>
        </View>
      </View>

      <View>
        <TouchableOpacity style={[styles.buttonContainer]} onPress={onLogout}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    fontSize: 18,
    color: Colors.white,
    marginLeft: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: Colors.appBackground,
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    margin: 40,
    marginHorizontal: 60,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.priceRed,
    textAlign: 'center',
  },
});

export default SettingsScreen;
