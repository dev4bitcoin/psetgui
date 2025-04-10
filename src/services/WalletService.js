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

const deleteWallet = async assetList => {
  assetList.forEach(async assetId => {
    await storage.removeItem(`transactions_${assetId}`);
    await storage.removeItem(`balance_${assetId}`);
  });
  await storage.storeItem(WALLETS, []);
};

const getDefaultWallet = async () => {
  const wallets = await getWallets();

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

const storeTransactions = async (assetId, transactions) => {
  try {
    if (!assetId) return;
    await storage.storeItem(
      `transactions_${assetId}`,
      JSON.stringify(transactions),
    );
  } catch (error) {
    console.error('Error storing transactions:', error);
  }
};

const getStoredTransactions = async assetId => {
  try {
    if (!assetId) return [];

    const transactions = await storage.getItem(`transactions_${assetId}`);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error getting stored transactions:', error);
    return [];
  }
};

const storeAssets = async assets => {
  try {
    if (!assets) return null;

    await storage.storeItem(`assets`, JSON.stringify(assets));
  } catch (error) {
    console.error('Error storing assets:', error);
  }
};
const getStoredAssets = async () => {
  try {
    const assets = await storage.getItem(`assets`);
    return assets ? JSON.parse(assets) : [];
  } catch (error) {
    console.error('Error getting stored assets:', error);
    return [];
  }
};

export {
  getWallets,
  createWallet,
  deleteWallet,
  getWallet,
  getDefaultWallet,
  isWalletExist,
  resetWallets,
  storeTransactions,
  getStoredTransactions,
  storeAssets,
  getStoredAssets,
};
