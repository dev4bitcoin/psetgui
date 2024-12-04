import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import Localize from '../config/Localize';
import ActionButton from './ActionButton';
import colors from '../config/Colors';
import AppText from './Text';
import routes from '../navigation/Routes';

function TopBar() {
  //const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {/* <ActionButton
          iconName="cog-outline"
          //onPress={() => navigation.navigate(routes.SETTINGS)}
        /> */}
        <AppText style={styles.text}>Wallet</AppText>
        {/* <View style={styles.placeholder} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    //marginTop: 5,
  },
  topBar: {
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  placeholder: {
    width: 50, // Adjust this width to match the width of the ActionButton
  },
});

export default TopBar;
