import {
  Wollet,
  Signer,
  Mnemonic,
  Network,
  WolletDescriptor,
  TxBuilder,
  Bip,
  Pset,
  Address,
} from 'lwk-rn';

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
import Transaction from '../models/Transaction';

let signerInstance = null;
let wolletInstance = null;
let clientInstance = null;
let builderInstance = null;

const getSignerInstance = async () => {
  console.log('getSignerInstance');
  if (!signerInstance) {
    const wallet = await getDefaultWallet();
    const {mnemonic} = JSON.parse(wallet);
    if (!mnemonic) {
      return null;
    }
    signerInstance = new Signer(new Mnemonic(mnemonic), Network.testnet());
  }
  return signerInstance;
};

const getWolletInstance = async () => {
  console.log('getWolletInstance');
  if (!wolletInstance) {
    const wallet = await getDefaultWallet();
    if (!wallet) {
      return null;
    }
    const {descriptor} = JSON.parse(wallet);
    const desc = new WolletDescriptor(descriptor);

    wolletInstance = new Wollet(Network.testnet(), desc, undefined);
    await updateWallet(wolletInstance);
  }
  return wolletInstance;
};

const getClientInstance = () => {
  console.log('getClientInstance');
  if (!clientInstance) {
    const network = Network.testnet();
    clientInstance = network.defaultElectrumClient();
  }
  return clientInstance;
};

const getBuilderInstance = () => {
  if (!builderInstance) {
    builderInstance = new TxBuilder(Network.testnet());
  }
  return builderInstance;
};

const GetSavedTransactions = async () => {
  console.log('GetSavedTransactions');
  const wallet = await getDefaultWallet();
  if (!wallet) return [];

  const parsedWallet = JSON.parse(wallet);
  const transactions = await getStoredTransactions(parsedWallet.id);
  return transactions;
};

const GetSavedBalance = async () => {
  console.log('GetSavedBalance');
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

const extractKeyOriginAndXpub = input => {
  const closingBracketIndex = input.indexOf(']');
  if (closingBracketIndex === -1) {
    throw new Error('Invalid input format: Missing closing bracket');
  }

  const keyOrigin = input.substring(1, closingBracketIndex); // Exclude the opening '['
  const xpub = input.substring(closingBracketIndex + 1); // Everything after ']'

  return {keyOrigin, xpub};
};

const CreateWallet = async () => {
  try {
    console.log('CreateWallet');
    const mnemonic = Mnemonic.fromRandom(12);
    // const mnemonic =
    //   'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    signerInstance = new Signer(mnemonic, Network.testnet());

    // Get the key origin information
    const keyoriginXpub = await signerInstance.keyoriginXpub(Bip.newBip84());
    const {keyOrigin, xpub} = extractKeyOriginAndXpub(keyoriginXpub);

    if (await isWalletExist(xpub)) {
      console.log('Wallet already exists');
      return;
    }

    const descriptor = await signerInstance.wpkhSlip77Descriptor();
    const descriptorString = await descriptor.toString();

    await createWallet(
      JSON.stringify({
        id: uuid.v4(),
        mnemonic: mnemonic.toString(),
        xpub: xpub,
        keyOrigin: keyOrigin,
        descriptor: descriptorString,
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

const updateWallet = async wollet => {
  console.log('updateWallet');
  const client = getClientInstance();
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
  console.log('GetNewAddress');
  const address = (await getWolletInstance()).address(undefined);
  const txt = address.address().toString();
  return txt;
};

const GetTransactions = async () => {
  console.log('GetTransactions');
  const wallet = await getWolletInstance();
  await updateWallet(wallet);
  const txs = await wallet.transactions();

  const newTransactions = txs.map(tx => {
    var balance = {};
    tx.balance().forEach((value, key) => {
      if (balance[key.toString()] === undefined) {
        balance[key.toString()] = 0;
      }
      balance[key.toString()] += Number(value);
    });
    return new Transaction({
      balance: balance,
      fee: Number(tx.fee()),
      height: tx.height(),
      type: tx.type(),
      txid: tx.txid().toString(),
      timestamp: tx.timestamp(),
      tx: tx.tx().toString(),
    });
  });

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
  console.log('GetBalance');
  const wollet = await getWolletInstance();
  await updateWallet(wollet);
  const res = await wollet.balance();
  var balance = {};
  res.forEach((value, key) => {
    if (balance[key.toString()] === undefined) {
      balance[key.toString()] = 0;
    }
    balance[key.toString()] += Number(value);
  });
  // Store the balance in AsyncStorage
  const savedWallet = await getDefaultWallet();
  const parsedSavedWallet = JSON.parse(savedWallet);

  await storeBalance(parsedSavedWallet?.id, balance);

  return balance;
};

const ResetWallets = async () => {
  console.log('ResetWallets');
  return await resetWallets();
};

const BroadcastTransaction = async (address, satoshis) => {
  console.log('BroadcastTransaction');
  try {
    const wollet = await getWolletInstance();
    const builder = getBuilderInstance();
    const signer = await getSignerInstance();
    const client = getClientInstance();

    const fee_rate = 100; // this is the sat/vB * 100 fee rate. Example 280 would equal a fee rate of .28 sat/vB. 100 would equal .1 sat/vB
    const addressInterface = new Address(address);

    await builder.addLbtcRecipient(addressInterface, parseFloat(satoshis));
    await builder.feeRate(fee_rate);

    let pset = await builder.finish(wollet);
    const psetString = await pset.toString();
    console.log('Unsigned PSET', psetString);
    let signed_pset = await signer.sign(pset);
    console.log('SIGNED PSET:', await signed_pset.toString());
    let finalized_pset = await wollet.finalize(signed_pset);
    const tx = await finalized_pset.extractTx();

    await client.broadcast(tx);
    const txId = await tx.txid();

    console.log('BROADCASTED TX!\nTXID: {:?}', txId);
    return txId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ValidateAddress = async address => {
  console.log('ValidateAddress', address);
  try {
    const addressInterface = new Address(address);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const GetMnemonic = async () => {
  console.log('GetMnemonic');
  const wallet = await getDefaultWallet();
  if (!wallet) {
    return null;
  }
  return JSON.parse(wallet).mnemonic;
};

const ExtractPsetDetails = async pset => {
  console.log('ExtractPsetDetails');
  try {
    const psetInstance = new Pset(pset);
    const wolletInstance = await getWolletInstance();
    const details = await wolletInstance.psetDetails(psetInstance);
    const balances = details.balance().balances();
    const fee = details.balance().fee();
    const signatures = details.signatures();
    const recipients = details.balance().recipients();
    return {balances, fee, signatures, recipients};
  } catch (error) {
    console.error('PSET validation failed:', error);
    return null;
  }
};

const ExtractTransaction = async pset => {
  console.log('ExtractTransaction');
  try {
    const tx = await pset.extractTx();
    return tx;
  } catch (error) {
    console.error('Failed to extract transaction:', error);
    return null;
  }
};

const GetWolletInfo = async () => {
  console.log('GetWolletInfo');
  const signer = await getSignerInstance();

  const descriptor = await signerInstance.wpkhSlip77Descriptor();
  const descriptorString = await descriptor.toString();

  const bip49Xpub = await signer.keyoriginXpub(Bip.newBip49());
  console.log(bip49Xpub);
  const bip84Xpub = await signer.keyoriginXpub(Bip.newBip84());
  const bip87Xpub = await signer.keyoriginXpub(Bip.newBip87());
  return {descriptorString, bip49Xpub, bip84Xpub, bip87Xpub};
};

const SignPSETWithMnemonic = async (mnemonic, pset) => {
  console.log('SignWithMnemonic');
  try {
    const signer = new Signer(new Mnemonic(mnemonic), Network.testnet());
    const psetInstance = new Pset(pset);
    const signedPset = await signer.sign(psetInstance);
    return signedPset.toString();
  } catch (error) {
    console.error('Failed to sign PSET:', error);
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
  ExtractPsetDetails,
  ExtractTransaction,
  GetWolletInfo,
  SignPSETWithMnemonic,
};
