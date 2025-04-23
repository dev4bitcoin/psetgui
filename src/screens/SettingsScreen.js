import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNRestart from 'react-native-restart';
import {useRealm} from '@realm/react';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';
import {deleteWallet} from '../services/WalletService';
import LoadingScreen from './LoadingScreen';
import WalletFactory from '../wallet/WalletFactory';
import {AppContext} from '../context/AppContext';
import Constants from '../config/Constants';

function SettingsScreen(props) {
  const [loading, setLoading] = React.useState(false);
  const {useTestnet, setAppSettingByKey} = useContext(AppContext);
  const realm = useRealm();

  const onSelect = name => {
    if (name === 'Denomination') props.navigation.navigate('Denomination');
    if (name === 'App access') props.navigation.navigate('AppAccess');
    if (name === 'Recovery Phrase') props.navigation.navigate('RecoveryPhrase');
    if (name === 'About') props.navigation.navigate('About');
    if (name === 'Switch to Testnet' || name === 'Switch to Mainnet') {
      onTestnetSwitch();
    }
  };

  const onDelete = async () => {
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
            deleteWallet(realm, useTestnet);
            setLoading(false);
            RNRestart.restart(); // Restart the app
          },
        },
      ],
      {cancelable: false},
    );
  };

  const onLogout = async () => {
    RNRestart.restart(); // Restart the app
  };

  const onTestnetSwitch = async () => {
    Alert.alert(
      'Confirm',
      `Are you sure you want to switch to ${
        !useTestnet ? 'testnet' : 'mainnet'
      }?'`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            setAppSettingByKey(Constants.USE_TESTNET, !useTestnet);
            setLoading(false);
            RNRestart.restart(); // Restart the app
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = (name, icon, rightIcon) => {
    return (
      <TouchableOpacity onPress={() => onSelect(name)}>
        <View style={styles.item}>
          <View style={styles.nameContainer}>
            <Icon name={icon} size={30} color={Colors.textGray} />
            <Text style={styles.itemText}>{name}</Text>
          </View>
          <Icon name={rightIcon} size={30} color={Colors.textGray} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSwitchItem = (name, icon, isEnabled) => {
    return (
      <TouchableOpacity onPress={onTestnetSwitch}>
        <View style={styles.item}>
          <View style={styles.nameContainer}>
            <Icon name={icon} size={30} color={Colors.textGray} />
            <Text style={styles.itemText}>{name}</Text>
          </View>
          <Switch
            trackColor={{false: Colors.textGray, true: Colors.priceGreen}}
            thumbColor={isEnabled ? Colors.white : Colors.lightGray}
            ios_backgroundColor={Colors.textGray}
            value={isEnabled}
            onValueChange={onTestnetSwitch}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={[{flex: 1}]}>
        <TopBar title="Settings" showBackButton={false} />
        {loading && <LoadingScreen />}

        <View style={styles.group}>
          <Text style={styles.header}>GENERAL</Text>
          <View style={styles.itemGroup}>
            {renderItem('About', 'information-outline', 'chevron-right')}
            {renderItem('Denomination', 'currency-btc', 'chevron-right')}
            {/* {renderItem(
              useTestnet ? 'Switch to Mainnet' : 'Switch to Testnet',
              'bitcoin',
              'swap-horizontal',
            )} */}
            {/* {renderSwitchItem('Enable Testnet', 'bitcoin', useTestnet)} */}
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

      <TouchableOpacity
        style={[styles.buttonContainer, {backgroundColor: Colors.white}]}
        onPress={onLogout}>
        <Text style={[styles.buttonText, {color: Colors.black}]}>Logout</Text>
      </TouchableOpacity>

      {WalletFactory.signerInstance && WalletFactory.shouldSaveToStorage && (
        <TouchableOpacity style={[styles.buttonContainer]} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '75%',
    borderRadius: 50,
    marginHorizontal: 60,
    bottom: 100,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.priceRed,
    textAlign: 'center',
  },
});

export default SettingsScreen;
