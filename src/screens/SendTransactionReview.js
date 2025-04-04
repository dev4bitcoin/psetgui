import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ToastManager, {Toast} from 'toastify-react-native';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';
import LoadingScreen from './LoadingScreen';
import WalletFactory from '../wallet/WalletFactory';
import BottomModal from '../components/BottomModal';

function SendTransactionReview({navigation, route}) {
  const {amount, address, ticker} = route.params;
  const [signedPset, setSignedPset] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const onSend = async () => {
    try {
      setLoading(true);
      const txId = await WalletFactory.BroadcastTransaction(address, amount);
      if (!txId) {
        console.error('Transaction failed');
        setLoading(false);
        Alert.alert('Transaction failed', 'Please try again');
        return;
      }
      navigation.navigate('Success', {address: address, amount: amount});
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onExportPSET = async () => {
    try {
      if (signedPset?.length > 0) {
        setModalVisible(true);
        return;
      }

      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const psetString = await WalletFactory.CreatePSET(address, amount);
      if (!psetString) {
        console.error('PSET creation failed');
        setLoading(false);
        Alert.alert('PSET creation failed', 'Please try again');
        return;
      }

      setSignedPset(psetString);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onModalItemPress = async item => {
    setModalVisible(false);
    if (item.name === 'Copy') {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      Clipboard.setString(signedPset);
      Toast.info('Copied to clipboard!', 'bottom');
    } else if (item.name === 'Share') {
      try {
        // delay to close modal
        await new Promise(resolve => setTimeout(resolve, 1000));
        const result = await Share.share({
          message: signedPset,
          url: '',
          title: 'Signed PSET',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };

  const renderAddress = () => {
    const addressArray = address.match(/.{1,4}/g);

    const groupedAddress = [];
    for (let i = 0; i < addressArray.length; i += 6) {
      groupedAddress.push(addressArray.slice(i, i + 6).join('   '));
    }

    return (
      <View>
        {groupedAddress.map((chunk, index) => (
          <Text key={index} style={[styles.address]}>
            {chunk}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Screen style={styles.screen}>
      <TopBar title="Review Send" showBackButton={true} />
      {loading && <LoadingScreen />}
      <ToastManager
        showCloseIcon={false}
        showProgressBar={false}
        style={styles.toastStyle}
        height={60}
        animationStyle={'rightInOut'}
        textStyle={styles.toastTextStyle}
        duration={1000}
        positionValue={100}
      />
      <View style={styles.pageContainer}>
        <ScrollView>
          <View style={[styles.borderContainer, {borderBottomWidth: 0}]}>
            <Text style={styles.amount}>{amount} </Text>
            <Text style={styles.denomination}>{ticker}</Text>
            <Text style={styles.label}>AMOUNT</Text>
          </View>
          <View style={[styles.borderContainer, {borderBottomWidth: 0}]}>
            {renderAddress()}
            <Text style={styles.label}>DESTINATION</Text>
          </View>
          <View style={styles.borderContainer}>
            <Text style={styles.fee}>0.1 sat/vB</Text>
            <Text style={styles.label}>TRANSACTION SPEED</Text>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onExportPSET}
            style={[styles.button, styles.psetButton]}>
            <Text style={[styles.buttonText, {color: Colors.white}]}>
              Export PSET
            </Text>
          </TouchableOpacity>
          {WalletFactory.signerInstance && (
            <TouchableOpacity onPress={onSend} style={[styles.button]}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <BottomModal
        visible={isModalVisible}
        onClose={item => onModalItemPress(item)}
        items={[{name: 'Copy'}, {name: 'Share'}]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pageContainer: {
    padding: 20,
    flex: 1,
    marginTop: 20,
  },
  borderContainer: {
    alignItems: 'center',
    borderColor: Colors.textGray,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    paddingVertical: 20,
  },
  amount: {
    fontSize: 40,
    textAlign: 'center',
    color: Colors.white,
  },
  label: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 20,
  },
  denomination: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 15,
  },
  address: {
    fontSize: 16,
    color: Colors.white,
    padding: 2,
    textAlign: 'justify',
  },
  addressHighlight: {
    color: Colors.priceGreen,
  },
  fee: {
    fontSize: 20,
    color: Colors.white,
    marginTop: 15,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    left: 20,
  },
  psetButton: {
    backgroundColor: Colors.appBackground,
    borderColor: Colors.white,
    borderWidth: 0.5,
  },
  button: {
    borderRadius: 50,
    backgroundColor: Colors.white,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.black,
    padding: 10,
  },
});

export default SendTransactionReview;
