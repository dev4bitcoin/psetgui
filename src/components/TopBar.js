import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Localize from '../config/Localize';
import colors from '../config/Colors';
import AppText from './Text';

function TopBar({title, showBackButton = false, showBackButtonText = false}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.leftIcon}>
          {showBackButton && (
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={35} color={colors.white} />
              </TouchableOpacity>
              {showBackButtonText && <Text style={styles.backText}>Back</Text>}
            </View>
          )}
        </View>
        <AppText style={styles.text}>{title}</AppText>
        {/* <View style={styles.rightIcon}>
          {showRefreshButton && (
            <TouchableOpacity onPress={onRefresh}>
              <Animated.View style={{transform: [{rotate: rotation}]}}>
                <Icon name="autorenew" size={30} color={colors.white} />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View> */}
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
    left: 10,
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
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TopBar;
