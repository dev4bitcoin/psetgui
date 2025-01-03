import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';

function SettingsScreen(props) {
  const onSelect = name => {
    if (name === 'Denomination') props.navigation.navigate('Denomination');
    if (name === 'App access') props.navigation.navigate('AppAccess');
  };
  const renderItem = (name, icon) => {
    return (
      <TouchableOpacity onPress={() => onSelect(name)}>
        <View style={styles.item}>
          <View style={styles.nameContainer}>
            <Icon name={icon} size={30} color={Colors.textGray} />
            <Text style={styles.itemText}>{name}</Text>
          </View>
          <Icon name="arrow-right" size={30} color={Colors.textGray} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TopBar title="Settings" showBackButton={false} />
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
    borderBottomColor: Colors.white,
    borderBottomWidth: 0.5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsScreen;
