import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import Localize from '../config/localize';
import ActionButton from './actionbutton';
import colors from '../config/colors';
import AppText from './text';
import routes from '../navigation/routes';

function TopBar() {
  //const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ActionButton
          iconName="cog-outline"
          //onPress={() => navigation.navigate(routes.SETTINGS)}
        />
        <AppText style={styles.text}>Wallet</AppText>
        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: 50, // Adjust this width to match the width of the ActionButton
  },
});

export default TopBar;
