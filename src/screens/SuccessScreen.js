import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';

function SuccessScreen(props) {
  const {address, amount} = props.route.params;

  const onClose = () => {
    props.navigation.navigate('BottomTabs');
  };

  return (
    <Screen style={styles.screen}>
      <TopBar title="Success" showBackButton={false} />
      <View style={styles.container}>
        <View style={styles.icon}>
          <Icon name="check-circle" size={100} color="green" />
        </View>
        <Text style={styles.text}>Success, payment sent!</Text>
        <View style={styles.sentAmount}>
          <Text style={styles.text}>{amount} sent to</Text>
          <Text style={styles.text}>{address}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
  },
  sentAmount: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: 200,
  },
  button: {
    borderRadius: 50,
    backgroundColor: Colors.white,
    padding: 20,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.black,
  },
});

export default SuccessScreen;
