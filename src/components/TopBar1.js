import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import Localize from '../config/Localize1';
import ActionButton from './ActionButton1';
import colors from '../config/Colors1';
import AppText from './Text1';
import routes from '../navigation/Routes1';

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
