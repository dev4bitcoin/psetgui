import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import Screen from '../Screen';
import {AppContext} from '../../context/AppContext';

function AppAccess(props) {
  const {setBiometricsStatus, showBiometrics} = useContext(AppContext);
  const [isTouchIDSupported, setIsTouchIDSupported] = useState(false);

  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const disableBiometrics = async () => {
    try {
      const resultObject = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint',
      });
      const {success} = resultObject;
      if (success) {
        // successful biometrics provided
        setBiometricsStatus(false);
      } else {
        // user cancelled biometric prompt
      }
    } catch (error) {
      // biometrics failed
    }
  };

  const isBiometricsSupported = async () => {
    let isSupported = false;

    const resultObject = await rnBiometrics.isSensorAvailable();
    const {available, biometryType} = resultObject;

    if (available && biometryType === BiometryTypes.TouchID) {
      isSupported = true;
      setIsTouchIDSupported(true);
    } else if (available && biometryType === BiometryTypes.FaceID) {
      isSupported = true;
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      isSupported = true;
    } else {
      isSupported = false;
    }
    return isSupported;
  };

  const onBioMetricsStatusChanged = async isOn => {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);

    const isSupported = await isBiometricsSupported();

    if (isSupported && isOn === true) {
      setBiometricsStatus(true);
    } else if (isSupported && isOn === false) {
      await disableBiometrics();
    } else {
      setBiometricsStatus(false);
      Alert.alert('Biometrics', 'Biometrics is not supported on this device');
    }
  };

  const toggleFaceIDSwitch = async () => {
    const newValue = !showBiometrics;
    await onBioMetricsStatusChanged(newValue);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TopBar title="App access" showBackButton={true} />
        <View style={styles.group}>
          <Text style={styles.header}>BIOMETRICS</Text>
          <View style={styles.itemGroup}>
            <View style={styles.item}>
              <View style={styles.nameContainer}>
                <Icon name="account-lock" size={30} color={Colors.textGray} />
                <Text style={styles.itemText}>
                  {Platform.OS === 'android'
                    ? 'Biometrics'
                    : isTouchIDSupported
                    ? 'Touch ID'
                    : 'Face ID'}
                </Text>
              </View>
              <TouchableOpacity onPress={toggleFaceIDSwitch}>
                <Switch
                  trackColor={{false: Colors.textGray, true: Colors.priceGreen}}
                  thumbColor={showBiometrics ? Colors.white : Colors.lightGray}
                  ios_backgroundColor={Colors.textGray}
                  onValueChange={toggleFaceIDSwitch}
                  value={showBiometrics}
                  disabled={true}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  group: {
    width: '100%',
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textGray,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  itemGroup: {
    marginTop: 10,
    borderBottomWidth: 0.2,
    backgroundColor: Colors.lightGray,
    borderBottomColor: Colors.textGray,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 18,
    color: Colors.white,
    marginLeft: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AppAccess;
