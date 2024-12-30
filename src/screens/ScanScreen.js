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
const cameraHeight = height; // 70% of the screen height
const marginHorizontal = 10; // Margin on left and right
const cameraWidth = width; // Width minus margins

function ScanScreen({navigation, route}) {
  const {amount} = route.params;
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <Screen style={styles.screen}>
        <TopBar title="Scan" showBackButton={true} />
        <View style={styles.container}>
          <Text style={styles.text}>No camera permission</Text>
        </View>
      </Screen>
    );
  }

  if (device == null) {
    return (
      <Screen style={styles.screen}>
        <TopBar title="Scan" showBackButton={true} />

        <View style={styles.container}>
          <Text style={styles.text}>No camera device</Text>
        </View>
      </Screen>
    );
  }
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes) {
        // Parse the JSON string
        const parsedData = JSON.parse(codes);

        // Access the value property
        const qrValue = parsedData[0].value;
        //route.params.onScanFinished(codes);
        navigation.navigate('SendTransactionReview', {
          address: qrValue,
          amount: amount,
        });
      }
    },
  });

  return (
    <Screen style={styles.screen}>
      <TopBar title="Scan" showBackButton={true} />
      <View style={styles.camera}>
        <Camera
          style={[styles.camera]}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />

        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width, // Full width minus margins
    height: cameraHeight, // 70% of the screen height
  },
  text: {
    fontSize: 20,
    color: colors.white,
  },
  rectangleContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -100}, {translateY: -100}], // Center the rectangle
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleOverlay: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  rectangle: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.yellow,
    borderStyle: 'solid',
    backgroundColor: 'transparent', // Ensure the rectangle area is clear
  },
});

export default ScanScreen;
