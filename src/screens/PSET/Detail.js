import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import {AppContext} from '../../context/AppContext';
import UnitConverter from '../../helpers/UnitConverter';
import LoadingScreen from '../LoadingScreen';
import WalletFactory from '../../wallet/WalletFactory';
import assetFinder from '../../helpers/assetFinder';
import Constants from '../../config/Constants';

class Signature {
  constructor(key, value, isMissing) {
    this.key = key;
    this.value = value;
    this.isMissing = isMissing;
  }
}

function Detail(props) {
  const {pset} = props.route.params;
  const {preferredBitcoinUnit} = useContext(AppContext);

  const [signedPset, setSignedPset] = useState('');
  const [fee, setFee] = useState(0);
  const [assetList, setAssetList] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading PSET details...');

  useEffect(() => {
    setupData(pset);
  }, []);

  const displayBalanceInPreferredUnit = amount => {
    const convertedDenominationAmount =
      UnitConverter.convertToPreferredBTCDenominator(
        amount,
        preferredBitcoinUnit,
      );
    return convertedDenominationAmount;
  };

  const amountInPreferredAssetDenomination = (assetId, amount, precision) => {
    return assetId.toString() == Constants.LIQUID_TESTNET_ASSETID
      ? UnitConverter.displayBalanceInPreferredUnit(
          Number(amount),
          preferredBitcoinUnit,
        )
      : (Number(amount) / Math.pow(10, precision)).toFixed(precision);
  };

  const getAssetTickerAndPrecision = assetId => {
    const assetInfo = assetFinder.findAsset(assetId);
    if (assetInfo) {
      return {
        ticker:
          assetId == Constants.LIQUID_TESTNET_ASSETID
            ? preferredBitcoinUnit
            : assetInfo[1] || 'Unknown',
        precision: assetInfo[3],
      };
    }
    return 'Unknown';
  };

  const setupData = async psetToParse => {
    try {
      setLoading(true);

      const extractedPSET = await WalletFactory.ExtractPsetDetails(psetToParse);

      // Fee
      setFee(displayBalanceInPreferredUnit(Number(extractedPSET?.fee || 0)));

      // Assets and balance
      let netBalance = 0;
      let assets = [];
      extractedPSET?.balances?.forEach((amount, assetId) => {
        const assetInfo = assetFinder.findAsset(assetId);

        const assetName = assetInfo[2] || 'Unknown';
        const {ticker} = getAssetTickerAndPrecision(assetId);

        assets.push({
          assetId,
          assetName,
          ticker,
          amount,
        });
        netBalance += Number(amount);
      });

      setAssetList(assets);
      setTotalBalance(displayBalanceInPreferredUnit(netBalance));

      // Signatures
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

      // Generic filtering logic for the desired signature
      const filteredSignatures = signaturesArray?.filter(signature => {
        // Check if the derivation path matches a "change address" pattern
        const derivationPath = signature.value; // Example: "84'/1'/0'/1/0"
        const pathSegments = derivationPath.split('/');
        const isChangeAddress = pathSegments[3] === '1'; // Check if the 3th segment is '1' (change address)
        return isChangeAddress;
      });

      setSignatures(filteredSignatures || []);

      // Recipients
      const recipientsList = [];
      // Iterate through the recipients
      extractedPSET?.recipients?.forEach(recipient => {
        const assetInfo = getAssetTickerAndPrecision(
          recipient?.asset()?.toString(),
        );
        recipientsList.push({
          address: recipient?.address()?.toString(),
          amount: recipient?.value(),
          ticker: assetInfo?.ticker,
          precision: assetInfo?.precision,
          assetId: recipient?.asset()?.toString(),
        });
      });

      setRecipients(recipientsList);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onSign = async () => {
    setLoading(true);
    setLoadingText('Signing PSET...');
    const signedPsetToParse = await WalletFactory.SignPSETWithMnemonic(pset);
    setSignedPset(signedPsetToParse);
    await setupData(signedPsetToParse);
    await new Promise(resolve => setTimeout(resolve, 20000));

    setLoading(false);
  };

  const onBroadcast = async () => {
    setLoading(true);
    setLoadingText('Broadcasting PSET...');
    const txId = await WalletFactory.BroadcastPSET(signedPset);
    if (!txId) {
      console.error('Transaction failed');
      setLoading(false);
      return;
    }
    props.navigation.navigate('Success', {
      address: txId,
      amount: totalBalance,
      isPET: true,
    });
  };

  const onRecipient = recipient => {
    props.navigation.navigate('Recipient', {
      recipient: recipient,
    });
  };

  const hasSignaturesMissing = signatures.some(
    signature => signature.isMissing,
  );

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
                {item?.isMissing ? (
                  <Text
                    style={[
                      styles.signatureItemText,
                      {color: Colors.priceRed},
                    ]}>
                    Signature Missing
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.signatureItemText,
                      {color: Colors.priceGreen},
                    ]}>
                    Signed
                  </Text>
                )}
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
      {loading && <LoadingScreen text={loadingText} />}

      <ScrollView>
        <Text style={styles.signatureTotalHeader}>
          {hasSignaturesMissing
            ? 'One approving signatures required.'
            : 'PSET Ready to broadcast.'}
        </Text>
        <View style={styles.content}>
          {/* <View style={styles.item}>
            <Text style={styles.itemName}>NET BALANCE</Text>
            <Text style={styles.itemValue}>
              {`${totalBalance}  ${preferredBitcoinUnit}`}
            </Text>
          </View> */}
          <View style={styles.item}>
            <Text style={styles.itemName}>FEES</Text>
            <Text style={styles.itemValue}>
              {`-${fee}  ${preferredBitcoinUnit}`}
            </Text>
          </View>

          <View style={styles.splitter}></View>

          {assetList.length > 0 && (
            <View style={[styles.item, {flexDirection: 'column'}]}>
              <Text
                style={[
                  styles.itemName,
                  {marginBottom: 10},
                ]}>{`ASSETS (${assetList?.length})`}</Text>
              {assetList.map((asset, index) => (
                <View
                  key={index}
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                    },
                  ]}>
                  <Text style={styles.itemValue}>{asset.assetName}</Text>
                  <Text style={styles.itemValue}>
                    {`${asset.amount}  ${asset.ticker}`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.splitter}></View>

          <View
            style={[
              styles.item,
              {flexDirection: recipients?.length > 0 ? 'column' : 'row'},
            ]}>
            <Text
              style={
                styles.itemName
              }>{`RECIPIENTS TOTAL (${recipients?.length})`}</Text>
            {recipients?.length > 0 ? (
              <View style={styles.recipientItems}>
                <FlatList
                  data={recipients || []}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={styles.recipientItem}
                      onPress={() =>
                        onRecipient({
                          amount: `${amountInPreferredAssetDenomination(
                            item?.assetId,
                            item?.amount,
                            item?.precision,
                          )} ${item?.ticker}`,
                          address: item?.address,
                        })
                      }>
                      <View style={styles.recipientAmountContainer}>
                        <Text style={styles.recipientAmount}>
                          {`${amountInPreferredAssetDenomination(
                            item?.assetId,
                            item?.amount,
                            item?.precision,
                          )} ${item?.ticker}`}
                        </Text>
                        <Text style={styles.itemValue}>{`#${index + 1}`}</Text>
                      </View>
                      <View>
                        {item?.address ? (
                          <>
                            <Text style={styles.itemValue}>
                              {item?.address
                                .slice(0, 16)
                                .match(/.{1,4}/g)
                                .join('   ')}
                              {/* First 4 characters */}
                            </Text>
                            <Text
                              style={[
                                styles.itemValue,
                                {textAlign: 'center', paddingBottom: 10},
                              ]}>
                              ...
                            </Text>
                            <Text style={styles.itemValue}>
                              {item?.address
                                .slice(-16)
                                .match(/.{1,4}/g)
                                .join('   ')}
                            </Text>
                          </>
                        ) : (
                          <Text style={styles.itemValue}>No Address</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              <Text style={styles.itemValue}>NONE</Text>
            )}
          </View>

          <View style={styles.splitter}></View>
          <View style={styles.splitter}></View>

          {signatures.length > 0 && (
            <View style={styles.signatureGroup}>
              <Text
                style={
                  styles.itemName
                }>{`SIGNATURES (${signatures.length})`}</Text>
              {renderItem(signatures)}
            </View>
          )}
        </View>
      </ScrollView>

      {WalletFactory.signerInstance ? (
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
      ) : (
        <Text style={styles.seedNotAvailableText}>
          Mnemonic(Seed) needed to sign & broadcast the transaction.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
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
  splitter: {
    marginHorizontal: 20,
    height: 0.3,
    backgroundColor: Colors.textGray,
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
    paddingRight: 13,
    textAlign: 'justify',
  },
  clickableItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signatureGroup: {
    justifyContent: 'center',
    padding: 20,
  },
  signatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
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
  recipientItems: {
    marginTop: 10,
    flexDirection: 'row',
  },
  recipientItem: {
    padding: 10,
    marginTop: 5,
    marginLeft: 0,
    marginRight: 15,
    marginBottom: 10,
    borderWidth: 0.3,
    borderColor: Colors.textGray,
    borderRadius: 10,
  },
  recipientAmountContainer: {
    marginBottom: 10,
    borderBottomWidth: 0.3,
    borderColor: Colors.textGray,
    borderBottomStyle: 'dotted',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipientAmount: {
    fontSize: 16,
    color: Colors.textGray,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingBottom: 5,
  },
  recipientAddress: {
    fontSize: 16,
    color: Colors.textGray,
    width: 250,
    paddingRight: 5,
    textTransform: 'uppercase',
    textAlign: 'justify',
  },
  seedNotAvailableText: {
    fontSize: 16,
    color: Colors.priceRed,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

export default Detail;
