import {Wollet, Client, Signer, Network} from 'lwk-rn';
//import bip39 from 'bip39';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {randomBytes} from 'react-native-crypto';

const CreateNewWallet = async () => {
  try {
    //const mnemonic = bip39.generateMnemonic();
    console.log('Creating new wallet');
    const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const network = Network.Testnet;
    console.log(network);
    console.log(mnemonic);
    //const signer = await new Signer().create(mnemonic, network);
    console.log('Signer created');
    // const descriptor = await signer.wpkhSlip77Descriptor();
    // console.log('Descriptor created');
    // console.log(await descriptor.asString());

    // const wollet = await new Wollet().create(network, descriptor, null);
    // console.log('Wollet created');
    // const client = await new Client().defaultElectrumClient(network);
    // console.log('Client created');
    // const update = await client.fullScan(wollet);
    // console.log('Update created');
    // await wollet.applyUpdate(update);
    // console.log('Update applied');
    // await AsyncStorage.setItem(
    //   'wallet',
    //   JSON.stringify({mnemonic, descriptor: await descriptor.asString()}),
    // );
    // console.log('Wallet saved');
  } catch (error) {
    console.error(error);
  }
};

const GetWollet = async () => {
  const wallet = await AsyncStorage.getItem('wallet');
  if (!wallet) {
    return null;
  }
  const {mnemonic, descriptor} = JSON.parse(wallet);
  const network = Network.Testnet;
  const signer = await new Signer().create(mnemonic, network);
  const desc = await Signer.Slip77Descriptor.fromString(descriptor);
  return await new Wollet().create(network, desc, null);
};

const GetNewAddress = async () => {
  const address = await wollet.getAddress();
  console.log(address);
};

const GetTransactions = async () => {
  const address = await wollet.getTransactions();
  console.log(address);
};

const GetBalance = async () => {
  const balance = await wollet.getBalance();
  console.log(balance);
};

export {CreateNewWallet, GetNewAddress, GetTransactions, GetBalance, GetWollet};
