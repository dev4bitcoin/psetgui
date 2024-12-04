import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import Localize from '../config/Localize';
import ActionButton from './ActionButton';
import colors from '../config/Colors';
import AppText from './Text';
import routes from '../navigation/Routes';

function TopBar({title, showBackButton = false}) {
  //const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <AppText style={styles.text}>{title}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default TopBar;
