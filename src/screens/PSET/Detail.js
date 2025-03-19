import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import {AppContext} from '../../context/AppContext';
import UnitConverter from '../../helpers/UnitConverter';

class KeyValueArray {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

function Detail(props) {
  const {psetDetails} = props.route.params;
  const {preferredBitcoinUnit} = useContext(AppContext);

  const [fee, setFee] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [recipients, setRecipients] = useState([]);
  useEffect(() => {
    extractPsetDetails();
  }, [psetDetails]);

  const displayBalanceInPreferredUnit = amount => {
    const convertedDenominationAmount =
      UnitConverter.convertToPreferredBTCDenominator(
        amount,
        preferredBitcoinUnit,
      );
    return convertedDenominationAmount;
  };

  const extractPsetDetails = async () => {
    try {
      const feeData = [];
      feeData.push(
        new KeyValueArray(
          'Fee',
          displayBalanceInPreferredUnit(Number(psetDetails.fee)),
        ),
      );
      setFee(feeData);

      console.log('Extract signatures');
      const signaturesArray = [];
      psetDetails.signatures?.forEach(signatureItem => {
        console.log('has signature');
        const hasSignatureMap = signatureItem?.hasSignature?.();
        if (hasSignatureMap) {
          hasSignatureMap.forEach((value, key) => {
            // Extract the part inside square brackets using regex
            const match = value.match(/\[([^\]]+)\]/); // Matches content inside []
            const extractedValue = match ? match[1] : null; // Extract the first group
            if (extractedValue) {
              signaturesArray.push(new KeyValueArray('Has', extractedValue));
            }
          });
        }

        console.log('missing signature');
        const missingSignatureMap = signatureItem?.missingSignature?.();
        if (missingSignatureMap) {
          missingSignatureMap.forEach((value, key) => {
            // Extract the part inside square brackets using regex
            const match = value.match(/\[([^\]]+)\]/); // Matches content inside []
            const extractedValue = match ? match[1] : null; // Extract the first group
            if (extractedValue) {
              signaturesArray.push(
                new KeyValueArray('Missing', extractedValue),
              );
            }
          });
        }
      });
      setSignatures(signaturesArray);

      const recipientsArray = [];
      psetDetails.recipients?.map(recipient => {
        const address = recipient?.address()?.toString();
        const amount = recipient?.value();
        console.log('Recipient', address, amount);
        recipientsArray.push(
          new KeyValueArray(
            address,
            displayBalanceInPreferredUnit(Number(amount)),
          ),
        );
      });
      setRecipients(recipientsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = (header, items) => {
    return (
      <View style={styles.group}>
        <Text style={styles.header}>{header}</Text>
        <View style={styles.itemGroup}>
          <View style={styles.item}>
            {Array.isArray(items) &&
              items.map((item, index) => (
                <View key={index} style={styles.nameContainer}>
                  <Text
                    style={styles.itemTextHeader}
                    numberOfLines={1}
                    ellipsizeMode="middle">
                    {item?.key}
                  </Text>
                  <Text style={styles.itemText}>{item?.value}</Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Review PSET" showBackButton={true} />
      <View style={styles.content}>
        {renderItem(
          `Net balance (From the perspective of the current wallet) - ${preferredBitcoinUnit}`,
          fee,
        )}
        {renderItem('Signatures', signatures)}
        {renderItem('Recipients', recipients)}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    //padding: 10,
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
    padding: 10,
  },
  itemGroup: {
    marginTop: 10,
    borderBottomWidth: 0.2,
    backgroundColor: Colors.lightGray,
    borderBottomColor: Colors.textGray,
    borderRadius: 5,
  },
  itemTextHeader: {
    fontSize: 18,
    color: Colors.textGray,
    //marginLeft: 10,
    width: '55%',
  },
  itemText: {
    fontSize: 18,
    color: Colors.white,
    //marginLeft: 20,
    paddingRight: 10,
    textAlign: 'right',
    width: '45%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    //paddingHorizontal,
  },
});

export default Detail;
