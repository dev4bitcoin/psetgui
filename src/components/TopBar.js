import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Localize from '../config/Localize';
import colors from '../config/Colors';
import AppText from './Text';

function TopBar({
  title,
  showBackButton = false,
  showRefreshButton = false,
  isRefreshing = false,
  onRefresh,
}) {
  const navigation = useNavigation();
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRefreshing) {
      startRotation();
    } else {
      rotateValue.stopAnimation();
    }
  }, [isRefreshing]);

  const startRotation = () => {
    rotateValue.setValue(0);
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
        <View style={styles.rightIcon}>
          {showRefreshButton && (
            <TouchableOpacity onPress={onRefresh}>
              <Animated.View style={{transform: [{rotate: rotation}]}}>
                <Icon name="autorenew" size={30} color={colors.white} />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
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
  rightIcon: {
    position: 'absolute',
    right: 30,
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default TopBar;
