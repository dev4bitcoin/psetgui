import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Colors from '../config/Colors';

const LoadingScreen = () => {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.semiBlack,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
});

export default LoadingScreen;
