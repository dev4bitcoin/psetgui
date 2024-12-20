import {Wollet, Client, Signer, Network, Descriptor} from 'lwk-rn';

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

const CreateWallet = async () => {
  try {
    //const mnemonic = await Signer.generateMnemonic();
    //console.log('Generated mnemonic:', mnemonic);

    // reset wallet for testing purpose
    await resetWallets();
    const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    console.log(mnemonic);
    const signer = await new Signer().create(mnemonic, Network.Testnet);
    console.log('Signer created');

    // use random number string for xpub now. will be replaced with actual xpub once it is available as par of the signer
    const xpub = Math.floor(Math.random() * 100000).toString();
    console.log('xpub:', xpub);

    if (await isWalletExist(xpub)) {
      console.log('Wallet already exists');
      return;
    }

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

const updateWallet = async wollet => {
  const client = await new Client().defaultElectrumClient(Network.Testnet);
  const update = await client.fullScan(wollet);
  await wollet.applyUpdate(update);
};

const GetWollet = async () => {
  // For now, we will use the first wallet in the list
  const wallet = await getDefaultWallet();
  if (!wallet) {
    return null;
  }

  const {descriptor} = JSON.parse(wallet);
  const desc = await new Descriptor().create(descriptor);
  const wollet = await new Wollet().create(Network.Testnet, desc, null);
  await updateWallet(wollet);
  return wollet;
};

const IsWalletExist = async () => {
  const wallet = await getDefaultWallet();
  if (!wallet) {
    return false;
  }
  return true;
};

const GetNewAddress = async wollet => {
  //await updateWallet(wollet);
  const address = await wollet.getAddress();
  return address;
};

const GetTransactions = async wollet => {
  await updateWallet(wollet);
  const transactions = await wollet.getTransactions();
  return transactions;
};

const GetBalance = async wollet => {
  await updateWallet(wollet);
  const balance = await wollet.getBalance();
  return balance;
};

const ResetWallets = async () => {
  return await resetWallets();
};

export {
  CreateWallet,
  GetNewAddress,
  GetTransactions,
  GetBalance,
  GetWollet,
  ResetWallets,
  IsWalletExist,
};
