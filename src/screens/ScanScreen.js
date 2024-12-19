import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {
  useCameraPermission,
  useCodeScanner,
  useCameraDevice,
  Camera,
} from 'react-native-vision-camera';

import colors from '../config/Colors';
import Screen from './Screen';
import TopBar from '../components/TopBar';

const {width, height} = Dimensions.get('window');
const cameraHeight = height * 0.6; // 70% of the screen height
const marginHorizontal = 10; // Margin on left and right
const cameraWidth = width - 4 * marginHorizontal; // Width minus margins

function ScanScreen({navigation, route}) {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    console.log('No camera permission');
    return (
      <Screen>
        <TopBar title="Scan" showBackButton={true} />
        <View style={styles.container}>
          <Text>No camera permission</Text>
        </View>
      </Screen>
    );
  }

  if (device == null) {
    console.log('No camera device');
    return (
      <Screen>
        <TopBar title="Scan" showBackButton={true} />
        <View style={styles.container}>
          <Text>No camera device</Text>
        </View>
      </Screen>
    );
  }
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
      console.log(codes);
      //route.params.onScanFinished(codes);
      navigation.goBack();
    },
  });

  return (
    <Screen>
      <TopBar title="Scan" showBackButton={true} />
      <View style={styles.container}>
        <Camera
          style={[styles.camera]}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      </View>
      <Text style={styles.scanText}>Scan QR code to get the address</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    marginTop: 40,
    width: cameraWidth, // Full width minus margins
    height: cameraHeight, // 70% of the screen height
    marginHorizontal: marginHorizontal, // Margin on left and right
  },
  scanText: {
    color: colors.white,
    marginTop: 20,
    textAlign: 'center', // Center the text horizontally
  },
});

export default ScanScreen;
