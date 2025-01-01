import {Wollet, Client, Signer, Network, Descriptor, TxBuilder} from 'lwk-rn';

import Constants from '../config/Constants';
import {
  getWallets,
  createWallet,
  deleteWallet,
  getDefaultWallet,
  getWallet,
  isWalletExist,
  resetWallets,
} from '../services/WalletService';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

let signerInstance = null;
let wolletInstance = null;
let clientInstance = null;
let builderInstance = null;

const getSignerInstance = async () => {
  if (!signerInstance) {
    signerInstance = await new Signer(); // Replace with actual signer initialization
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

const CreateWallet = async () => {
  try {
    // reset wallet for testing purpose
    await resetWallets();
    const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    console.log(mnemonic);
    const signer = await new Signer().create(mnemonic, Network.Testnet);
    //const signer = await new Signer().createRandomSigner(Network.Testnet);
    console.log('Signer created');

    //const mnemonic = await signer.mnemonic();
    //console.log('mnemonic:', mnemonic);
    // use random number string for xpub now. will be replaced with actual xpub once it is available as par of the signer
    const xpub = Math.floor(Math.random() * 100000).toString();
    console.log('xpub:', xpub);

    if (await isWalletExist(xpub)) {
      console.log('Wallet already exists');
      return;
    }

    //const keyOrigin = await signer.keyoriginXpub(Bip);

    const descriptor = await signer.wpkhSlip77Descriptor();
    const descriptorString = await descriptor.asString();
    console.log(descriptorString);

    await createWallet(
      JSON.stringify({
        mnemonic: mnemonic,
        xpub: xpub,
        descriptor: descriptorString,
      }),
    );

    console.log('New Wallet created');
  } catch (error) {
    console.error(error);
  }
};

const updateWallet = async () => {
  const client = await getClientInstance();
  const update = await client.fullScan(await getWolletInstance());
  (await getWolletInstance()).applyUpdate(update);
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
  //await updateWallet(wollet);
  const address = await getWolletInstance().getAddress();
  return address;
};

const GetTransactions = async () => {
  const wollet = await getWolletInstance();
  await updateWallet(wollet);
  const transactions = await wollet.getTransactions();
  return transactions;
};

const GetBalance = async () => {
  const wollet = await getWolletInstance();
  await updateWallet(wollet);
  const balance = await wollet.getBalance();
  return balance;
};

const ResetWallets = async () => {
  return await resetWallets();
};

const BroadcastTransaction = async (wollet, address, amount) => {
  // await updateWallet(wollet);
  // const txid = await wollet.broadcastTransaction(tx);
  // return txid;

  const out_address = await wollet.getAddress().description;
  const satoshis = 900;
  const fee_rate = 280; // this is the sat/vB * 100 fee rate. Example 280 would equal a fee rate of .28 sat/vB. 100 would equal .1 sat/vB
  const builder = await getBuilderInstance();
  await builder.addLbtcRecipient(out_address, satoshis);
  await builder.feeRate(fee_rate);
  let pset = await builder.finish(wollet);
  let signed_pset = await signer.sign(pset);
  let finalized_pset = await wollet.finalize(signed_pset);
  const tx = await finalized_pset.extractTx();
  await client.broadcast(tx);
  console.log('BROADCASTED TX!\nTXID: {:?}', tx.txId.toString());
};

const ValidateAddress = async address => {
  try {
    const builder = await getBuilderInstance();
    await builder.addLbtcRecipient(address, 1000);
    console.log('Validating address:', address);
    return true;
  } catch (error) {
    console.error(error);
    return false;
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
};
