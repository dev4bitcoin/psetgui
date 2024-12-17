import storage from '../storage/Storage';
import Constants from '../config/Constants';

// use testnet or mainnet. enable true for testing
//global.useTestnet = true;

// const WALLETS = global.useTestnet
//   ? Constants.TESTNET_WALLETS
//   : Constants.WALLETS;
const WALLETS = Constants.TESTNET_WALLETS;

const getWallets = async () => {
  const wallets = (await storage.getItem(WALLETS)) || [];
  return wallets;
};

const createWallet = async wallet => {
  const wallets = await getWallets();
  wallets.push(wallet);
  await storage.storeItem(WALLETS, wallets);
};

const deleteWallet = async wallet => {
  const wallets = await getWallets();
  const newWallets = wallets.filter(w => w.id !== wallet.id);
  await storage.storeItem(WALLETS, newWallets);
};

const getDefaultWallet = async () => {
  console.log('getDefault');
  const wallets = await getWallets();
  console.log(wallets);

  if (wallets.length === 0) return null;

  return wallets[0];
};

const getWallet = async id => {
  const wallets = await getWallets();
  return wallets.find(w => w.id === id);
};

const isWalletExist = async xpub => {
  const wallets = await getWallets();
  return wallets.some(w => w.xpub === xpub);
};

const resetWallets = async () => {
  return await storage.storeItem(WALLETS, []);
};

export {
  getWallets,
  createWallet,
  deleteWallet,
  getWallet,
  getDefaultWallet,
  isWalletExist,
  resetWallets,
};
