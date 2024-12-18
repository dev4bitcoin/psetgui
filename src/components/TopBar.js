import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Localize from '../config/Localize';
import colors from '../config/Colors';
import AppText from './Text';

function TopBar({title, showBackButton = false}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.leftIcon}>
          {showBackButton && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-left" size={35} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
        <AppText style={styles.text}>{title}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    left: 20,
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default TopBar;
