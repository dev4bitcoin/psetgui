import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import {CreatePSETFromBase64} from '../../wallet/WalletFactory';

function Detail(props) {
  const {pset} = props.route.params;

  useEffect(() => {
    extractPsetDetails();
  }, [pset]);

  const extractPsetDetails = async () => {
    try {
      const psetInstance = await CreatePSETFromBase64(pset);
      if (psetInstance) {
        const tx = await psetInstance.extractTx();
        const txId = await tx.txId();
        console.log('BROADCASTED TX!\nTXID: {:?}', txId);

        const txString = await tx.asString();
        console.log('Tx as String', txString);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Review PSET" showBackButton={true} />
      <View style={styles.content}>
        <View style={styles.group}>
          <Text style={styles.header}>Fee</Text>
          <View style={styles.itemGroup}>
            <View style={styles.item}>
              <View style={styles.nameContainer}>
                <Text style={styles.itemText}>dd</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
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
    borderBottomColor: Colors.white,
    borderBottomWidth: 0.5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Detail;
