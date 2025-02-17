import {
  Wollet,
  Client,
  Signer,
  Network,
  Descriptor,
  TxBuilder,
  Bip,
  Pset,
} from 'lwk-rn';

import * as bip39 from 'bip39';
import uuid from 'react-native-uuid';
import Constants from '../config/Constants';
import {
  getWallets,
  createWallet,
  deleteWallet,
  getDefaultWallet,
  getWallet,
  isWalletExist,
  resetWallets,
  getStoredTransactions,
  storeTransactions,
  storeBalance,
  getStoredBalance,
} from '../services/WalletService';

let signerInstance = null;
let wolletInstance = null;
let clientInstance = null;
let builderInstance = null;

const getSignerInstance = async () => {
  if (!signerInstance) {
    const wallet = await getDefaultWallet();
    const {mnemonic} = JSON.parse(wallet);
    if (!mnemonic) {
      return null;
    }
    signerInstance = await new Signer().create(mnemonic, Network.Testnet);
  }
  return signerInstance;
};

const getWolletInstance = async () => {
  if (!wolletInstance) {
    const wallet = await getDefaultWallet();
    if (!wallet) {
      return null;
    }
    const {descriptor} = JSON.parse(wallet);
    const desc = await new Descriptor().create(descriptor);
    wolletInstance = await new Wollet().create(Network.Testnet, desc, null);
    await updateWallet(wolletInstance);
  }
  return wolletInstance;
};

const getClientInstance = async () => {
  if (!clientInstance) {
    clientInstance = await new Client().defaultElectrumClient(Network.Testnet);
  }
  return clientInstance;
};

const getBuilderInstance = async () => {
  if (!builderInstance) {
    builderInstance = await new TxBuilder().create(Network.Testnet);
  }
  return builderInstance;
};

const GetSavedTransactions = async () => {
  const wallet = await getDefaultWallet();
  if (!wallet) return [];

  const parsedWallet = JSON.parse(wallet);
  const transactions = await getStoredTransactions(parsedWallet.id);
  return transactions;
};

const GetSavedBalance = async () => {
  const wallet = await getDefaultWallet();
  if (!wallet) return null;

  const parsedWallet = JSON.parse(wallet);
  const balance = await getStoredBalance(parsedWallet.id);
  const totalBalance = Object.values(balance).reduce(
    (sum, balance) => sum + balance,
    0,
  );

  return totalBalance;
};

const CreateWallet = async () => {
  try {
    // Generate a mnemonic using BIP-39
    const mnemonic = bip39.generateMnemonic();
    signerInstance = await new Signer().create(mnemonic, Network.Testnet);
    console.log('Signer created');

    // const mnemonic1 = await signerInstance.mnemonic();
    // console.log('mnemonic:', mnemonic1);

    // const bip = await new Bip().newBip84();
    // console.log('BIP created');
    // await bip.newBip84(); // Use BIP-84 for Native SegWit (Bech32) addresses
    // console.log('BIP ID:', bip.id);

    // // Get the key origin information
    // const keyOrigin = await signerInstance.keyoriginXpub(bip);
    // console.log('keyOrigin:', keyOrigin);

    //const mnemonic = await signer.mnemonic();
    //console.log('mnemonic:', mnemonic);
    // use random number string for xpub now. will be replaced with actual xpub once it is available as par of the signer
    const xpub = Math.floor(Math.random() * 100000).toString();

    if (await isWalletExist(xpub)) {
      console.log('Wallet already exists');
      return;
    }

    const descriptor = await signerInstance.wpkhSlip77Descriptor();
    const descriptorString = await descriptor.asString();

    const id = uuid.v4();

    await createWallet(
      JSON.stringify({
        id: id,
        mnemonic: mnemonic,
        xpub: xpub,
        descriptor: descriptorString,
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

const updateWallet = async wollet => {
  const client = await getClientInstance();
  const update = await client.fullScan(wollet);
  wollet.applyUpdate(update);
};

const GetWollet = async () => {
  return getWolletInstance();
};

const IsWalletExist = async () => {
  const wallet = await getDefaultWallet();
  if (!wallet) {
    return false;
  }
  return true;
};

const GetNewAddress = async () => {
  const address = (await getWolletInstance()).getAddress();
  return address;
};

const GetTransactions = async () => {
  const wallet = await getWolletInstance();
  await updateWallet(wallet);
  const newTransactions = await wallet.getTransactions();

  const savedWallet = await getDefaultWallet();
  const parsedSavedWallet = JSON.parse(savedWallet);

  // Retrieve existing transactions from AsyncStorage
  const storedTransactions = await getStoredTransactions(parsedSavedWallet?.id);

  // Filter out new transactions
  const existingTransactionIds = storedTransactions?.map(tx => tx.txid);
  const uniqueNewTransactions = newTransactions.filter(
    tx => !existingTransactionIds.includes(tx.txid),
  );

  // Combine existing and new transactions
  const updatedTransactions = [...storedTransactions, ...uniqueNewTransactions];

  // Store the updated transactions back to AsyncStorage
  await storeTransactions(parsedSavedWallet?.id, updatedTransactions);

  return updatedTransactions;
};

const GetBalance = async () => {
  const wollet = await getWolletInstance();
  await updateWallet(wollet);
  const balance = await wollet.getBalance();

  // Store the balance in AsyncStorage
  const savedWallet = await getDefaultWallet();
  const parsedSavedWallet = JSON.parse(savedWallet);

  await storeBalance(parsedSavedWallet?.id, balance);

  return balance;
};

const ResetWallets = async () => {
  return await resetWallets();
};

const BroadcastTransaction = async (address, satoshis) => {
  try {
    const wollet = await getWolletInstance();
    const builder = await getBuilderInstance();
    const signer = await getSignerInstance();
    const client = await getClientInstance();

    const fee_rate = 100; // this is the sat/vB * 100 fee rate. Example 280 would equal a fee rate of .28 sat/vB. 100 would equal .1 sat/vB

    await builder.addLbtcRecipient(address, parseFloat(satoshis));
    await builder.feeRate(fee_rate);

    let pset = await builder.finish(wollet);
    const psetAsString = await pset.asString();
    console.log('Unsigned PSET', psetAsString);
    let signed_pset = await signer.sign(pset);
    console.log('SIGNED PSET:', await signed_pset.asString());
    let finalized_pset = await wollet.finalize(signed_pset);
    const tx = await finalized_pset.extractTx();

    await client.broadcast(tx);
    const txId = await tx.txId();

    console.log('BROADCASTED TX!\nTXID: {:?}', txId);
    return txId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ValidateAddress = async address => {
  try {
    const builder = await getBuilderInstance();
    await builder.addLbtcRecipient(address, 1000);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const GetMnemonic = async () => {
  const wallet = await getDefaultWallet();
  if (!wallet) {
    return null;
  }
  return JSON.parse(wallet).mnemonic;
};

const CreatePSETFromBase64 = async pset => {
  try {
    const psetInstance = await new Pset().create(pset);
    return psetInstance;
  } catch (error) {
    console.error('PSET validation failed:', error);
    return null;
  }
};

const ExtractTransaction = async pset => {
  try {
    const tx = await pset.extractTx();
    return tx;
  } catch (error) {
    console.error('Failed to extract transaction:', error);
    return null;
  }
};

export {
  CreateWallet,
  GetNewAddress,
  GetTransactions,
  GetBalance,
  GetWollet,
  ResetWallets,
  IsWalletExist,
  BroadcastTransaction,
  ValidateAddress,
  GetMnemonic,
  GetSavedBalance,
  GetSavedTransactions,
  CreatePSETFromBase64,
  ExtractTransaction,
};
