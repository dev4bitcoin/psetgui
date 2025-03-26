import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import TopBar from '../../components/TopBar';
import Screen from '../Screen';
import Colors from '../../config/Colors';

function SignerSelection(props) {
  //const {pset, psetDetails} = props.route.params;

  const onSignWithMnemonic = () => {
    props.navigation.navigate('SignWithMnemonic');
  };

  const onSignWithJade = () => {};

  return (
    <Screen style={styles.container}>
      <TopBar title="Select Signer" showBackButton={false} />
      <View style={styles.content}>
        <TouchableOpacity
          onPress={onSignWithMnemonic}
          style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sign with Mnemonic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={true}
          onPress={onSignWithJade}
          style={[styles.buttonContainer, {backgroundColor: Colors.lightGray}]}>
          <Text style={styles.buttonText}>Sign with Jade</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    margin: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
});

export default SignerSelection;
