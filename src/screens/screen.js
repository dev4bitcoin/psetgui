import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  useColorScheme,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import colors from '../config/Colors1';

function Screen({children, style}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.appBackground : colors.appBackground,
  };

  return (
    <SafeAreaView style={[styles.screen]}>
      <View style={style}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Platform.os == 'ios' ? getStatusBarHeight() : 0,
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});

export default Screen;
