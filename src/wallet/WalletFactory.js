import {Wollet, Client, Signer, Network} from 'lwk-rn';
//import * as bip39 from 'bip39';

import Constants from '../config/Constants';
import {
  isWalletExist,
  createWallet,
  getDefaultWallet,
} from '../services/WalletService';

//const WALLETS = global.useTestnet;
// ? Constants.TESTNET_WALLETS
// : Constants.WALLETS;

const CreateWallet = async () => {
  try {
    //const mnemonic = await Signer.generateMnemonic();
    console.log('Generated mnemonic:', mnemonic);
    const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    console.log(mnemonic);
    const network = Network.Testnet;
    const signer = await new Signer().create(mnemonic, network);
    console.log('Signer created', signer);
    // const xpub = await signer.xpub();
    // console.log('xpub:', xpub);

    // if (await isWalletExist(xpub)) {
    //   console.log('Wallet already exists');
    //   return;
    // }

    const descriptor = await signer.wpkhSlip77Descriptor();
    const descriptorString = await descriptor.asString();
    console.log(descriptorString);

    // await createWallet(
    //   JSON.stringify({
    //     mnemonic: mnemonic,
    //     xpub: xpub,
    //     descriptor: descriptorString,
    //   }),
    // );

    console.log('Wallet saved');
  } catch (error) {
    console.error(error);
  }
};

const GetWollet = async () => {
  // For now, we will use the first wallet in the list
  const wallet = await getDefaultWallet();
  if (!wallet) {
    return null;
  }
  console.log(wallet);

  const {mnemonic, descriptor} = JSON.parse(wallet);
  console.log(mnemonic);
  console.log(descriptor);
  const network = Network.Testnet;
  const signer = await new Signer().create(mnemonic, network);
  const desc = await Signer.Slip77Descriptor.fromString(descriptor);
  return await new Wollet().create(network, desc, null);
};

const GetNewAddress = async () => {
  const address = await wollet.getAddress();
  return address;
};

const GetTransactions = async () => {
  const transactions = await wollet.getTransactions();
  return transactions;
};

const GetBalance = async () => {
  const balance = await wollet.getBalance();
  return balance;
};

export {CreateWallet, GetNewAddress, GetTransactions, GetBalance, GetWollet};
