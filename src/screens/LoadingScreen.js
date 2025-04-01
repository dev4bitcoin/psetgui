import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import Colors from '../config/Colors';

const LoadingScreen = ({text = null}) => {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={Colors.white} />
      {text && <Text style={{color: Colors.white, marginTop: 20}}>{text}</Text>}
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
