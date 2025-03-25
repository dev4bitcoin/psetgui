import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import {AppContext} from '../../context/AppContext';
import UnitConverter from '../../helpers/UnitConverter';
import {ExtractPsetDetails} from '../../wallet/WalletFactory';

class Signature {
  constructor(key, value, isMissing) {
    this.key = key;
    this.value = value;
    this.isMissing = isMissing;
  }
}

function Detail(props) {
  const {pset, psetDetails, signedPset} = props.route.params;
  const {preferredBitcoinUnit} = useContext(AppContext);

  const [fee, setFee] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [destination, setDestination] = useState(null);
  useEffect(() => {
    setupdData();
  }, []);

  const displayBalanceInPreferredUnit = amount => {
    const convertedDenominationAmount =
      UnitConverter.convertToPreferredBTCDenominator(
        amount,
        preferredBitcoinUnit,
      );
    return convertedDenominationAmount;
  };

  const setupdData = async () => {
    try {
      let extractedPSET = psetDetails;
      if (!psetDetails) {
        extractedPSET = await ExtractPsetDetails(signedPset);
      }

      setFee(displayBalanceInPreferredUnit(Number(extractedPSET?.fee || 0)));
      // balances
      extractedPSET.balances?.forEach(balance => {
        console.log('Balance', balance.amount);
      });

      const signaturesArray = [];
      extractedPSET.signatures?.forEach(signatureItem => {
        const hasSignatureMap = signatureItem?.hasSignature?.();
        if (hasSignatureMap) {
          hasSignatureMap.forEach((value, key) => {
            signaturesArray.push(new Signature(key, value, false));
          });
        }

        const missingSignatureMap = signatureItem?.missingSignature?.();
        if (missingSignatureMap) {
          missingSignatureMap.forEach((value, key) => {
            signaturesArray.push(new Signature(key, value, true));
          });
        }
      });
      setSignatures(signaturesArray);

      const recipientMap = new Map();
      // Iterate through the recipients and store the latest entry for each address
      extractedPSET?.recipients?.forEach(recipient => {
        recipientMap.set(recipient?.address()?.toString(), recipient?.value());
      });

      const recipients = Array.from(recipientMap, ([address, amount]) => ({
        address,
        amount,
      }));

      setRecipients(recipients);

      const destination = recipients.reduce(
        (max, recipient) => {
          return recipient.amount > max.amount ? recipient : max;
        },
        {address: null, amount: 0},
      );
      console.log('Destination Address:', destination.address);
      setDestination(destination?.address);
    } catch (error) {
      console.error(error);
    }
  };

  const onSign = async () => {
    props.navigation.navigate('SignerSelection', {
      pset: pset,
      psetDetails: psetDetails,
    });
  };

  const onBroadcast = async () => {
    console.log('Broadcasting');
  };

  const onRecipients = () => {
    props.navigation.navigate('Recipients', {
      recipients: recipients,
    });
  };

  const hasSignaturesMissing = signatures.some(
    signature => signature.isMissing,
  );

  const formatAddress = address => {
    if (!address) return {firstRow: '', lastRow: ''};

    // Take the first 16 characters and split into 4x4 groups
    const firstRow = address
      .slice(0, 16)
      .match(/.{1,4}/g)
      .join(' ');

    // Take the last 16 characters and split into 4x4 groups
    const lastRow = address
      .slice(-16)
      .match(/.{1,4}/g)
      .join(' ');

    return {firstRow, lastRow};
  };

  const {firstRow, lastRow} = formatAddress(destination);

  const renderItem = items => {
    return (
      <View style={styles.group}>
        {Array.isArray(items) &&
          items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.signatureItem}
              onPress={onSign}
              disabled={!hasSignaturesMissing}>
              <Icon
                name="check-circle"
                size={30}
                color={item?.isMissing ? Colors.textGray : Colors.priceGreen}
              />
              <View style={styles.signtureItemDetails}>
                <Text style={styles.signatureItemTextHeader}>{`${
                  item?.isMissing ? 'Tap to sign Signature' : 'Signature'
                } #${index + 1}`}</Text>

                <Text style={styles.signatureItemText}>{item?.value}</Text>
                {/* {!item?.isMissing && (
                  <Text style={styles.signatureItemText}>Signed</Text>
                )} */}
                {/* <Text style={styles.signatureItemText}>{item?.key}</Text> */}
              </View>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="" showBackButton={true} />
      <ScrollView>
        <Text style={styles.signatureTotalHeader}>
          {hasSignaturesMissing
            ? 'One approving signatures required.'
            : 'PSET Ready to broadcast.'}
        </Text>
        <View style={styles.content}>
          <View style={styles.item}>
            <Text style={styles.itemName}>FEES</Text>
            <Text style={styles.itemValue}>
              {`-${fee}  ${preferredBitcoinUnit}`}
            </Text>
          </View>
          <TouchableOpacity style={styles.item} onPress={onRecipients}>
            <Text style={styles.itemName}>RECIPIENT TOTAL</Text>
            <View style={styles.clickableItem}>
              <Text style={styles.itemValue}>{recipients?.length}</Text>
              <Icon name="chevron-right" size={25} color={Colors.textGray} />
            </View>
          </TouchableOpacity>
          <View style={styles.item}>
            <Text style={styles.itemName}>DESTINATION</Text>
            <View>
              <Text style={styles.itemValue}>{firstRow}</Text>
              <Text style={[styles.itemValue, {textAlign: 'center'}]}>...</Text>
              <Text style={styles.itemValue}>{lastRow}</Text>
            </View>
          </View>
          <View style={styles.signatureGroup}>{renderItem(signatures)}</View>
        </View>
        <View>
          <TouchableOpacity
            onPress={onBroadcast}
            style={[
              styles.bottomButtonContainer,
              hasSignaturesMissing ? styles.buttonDisabled : null,
            ]}
            disabled={hasSignaturesMissing}>
            <Text
              style={[
                styles.bottomButtonText,
                {color: hasSignaturesMissing ? Colors.black : Colors.black},
              ]}>
              Broadcast
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 40,
  },

  signatureTotalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    padding: 10,
    paddingLeft: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textGray,
  },
  item: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textGray,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textGray,
    paddingRight: 10,
    textAlign: 'right',
    width: 200,
  },
  clickableItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signatureGroup: {
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
  },
  signatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  signtureItemDetails: {
    paddingLeft: 10,
  },
  signatureItemTextHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    paddingBottom: 10,
  },
  signatureItemText: {
    fontSize: 16,
    color: Colors.textGray,
    paddingRight: 10,
    paddingTop: 5,
  },
  buttonDisabled: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.lightGray,
    borderWidth: 0.5,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    margin: 20,
  },
  bottomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
});

export default Detail;
