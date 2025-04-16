import {BSON} from 'realm';

const getWallet = async (realm, useTestnet) => {
  const result = await realm
    .objects('Wallet')
    .filtered(`isTestnet == ${useTestnet}`)[0];

  if (!result || !result?.walletId) {
    return null;
  }

  const wallet = {
    _id: result._id,
    walletId: result.walletId,
    mnemonic: result.mnemonic,
    descriptor: result.descriptor,
    isTestnet: result.isTestnet,
  };

  return wallet;
};

const createWallet = async (realm, wallet) => {
  if (!wallet) return null;
  const id = new BSON.ObjectId();
  const newWallet = await realm.write(() => {
    return realm.create('Wallet', {
      _id: id,
      walletId: id.toHexString(),
      mnemonic: wallet.mnemonic,
      descriptor: wallet.descriptor,
      isTestnet: wallet.isTestnet,
    });
  });

  return {
    _id: newWallet?._id,
    walletId: newWallet?.walletId,
    mnemonic: newWallet?.mnemonic,
    descriptor: newWallet?.descriptor,
    isTestnet: newWallet?.isTestnet,
  };
};

const deleteWallet = (realm, useTestnet) => {
  const walletToDelete = realm
    .objects('Wallet')
    .filtered(`isTestnet == ${useTestnet}`)[0];

  if (!walletToDelete) return;

  const txs = realm
    .objects('Transaction')
    .filtered(`walletId == "${walletToDelete.walletId}"`);
  if (txs?.length > 0) {
    realm.write(() => {
      realm.delete(txs);
    });
  }

  const assets = realm
    .objects('Asset')
    .filtered(`walletId == "${walletToDelete.walletId}"`);
  if (assets?.length > 0) {
    realm.write(() => {
      realm.delete(assets);
    });
  }

  realm.write(() => {
    realm.delete(walletToDelete);
  });
};

const storeTransactions = async (realm, transactions, assetId) => {
  try {
    if (!transactions) return;

    transactions.forEach(tx => {
      const storedTx = realm
        .objects('Transaction')
        .filtered(`assetId == "${assetId}" && txId == "${tx.txid}"`)[0];

      if (!storedTx) {
        realm.write(() => {
          realm.create('Transaction', {
            _id: new BSON.ObjectId(),
            txId: tx.txid,
            balance: tx.balance,
            fee: tx.fee,
            height: tx.height,
            type: tx.type,
            timestamp: tx.timestamp,
            walletId: tx.walletId,
            assetId: assetId,
          });
        });
      } else {
        // Update existing transaction
        realm.write(() => {
          storedTx.height = tx.height;
          storedTx.timestamp = tx.timestamp;
        });
      }
    });
  } catch (error) {
    console.error('Error storing transactions:', error);
  }
};

const getStoredTransactions = async (realm, assetId) => {
  try {
    if (!assetId) return [];

    const txs = realm
      .objects('Transaction')
      .filtered(`assetId == "${assetId}"`);

    const mappedTxs = Array.from(txs).map(tx => ({
      txid: tx.txId,
      balance: tx.balance,
      fee: tx.fee,
      height: tx.height,
      type: tx.type,
      timestamp: tx.timestamp,
      walletId: tx.walletId,
      assetId: assetId,
    }));

    return mappedTxs;
  } catch (error) {
    console.error('Error getting stored transactions:', error);
    return [];
  }
};

const storeAssets = async (realm, assets) => {
  try {
    if (!assets) return null;

    assets.forEach(asset => {
      const storedAsset = realm
        .objects('Asset')
        .filtered(`assetId == "${asset.assetId}"`)[0];

      if (!storedAsset) {
        realm.write(() => {
          realm.create('Asset', {
            _id: new BSON.ObjectId(),
            assetId: asset.assetId,
            balance: asset.balance,
            entity: asset.entity,
            ticker: asset.ticker,
            precision: asset.precision,
            name: asset.name,
            walletId: asset.walletId,
          });
        });
      } else {
        // Update existing asset
        realm.write(() => {
          storedAsset.balance = asset.balance;
        });
      }
    });
  } catch (error) {
    console.error('Error storing assets:', error);
  }
};

const getStoredAssets = async (realm, walletId) => {
  try {
    const assets = realm.objects('Asset').filtered(`walletId == "${walletId}"`);

    const mappedAssets = Array.from(assets).map(asset => ({
      assetId: asset.assetId,
      balance: asset.balance,
      entity: asset.entity,
      ticker: asset.ticker,
      precision: asset.precision,
      name: asset.name,
      walletId: asset.walletId,
    }));
    return mappedAssets;
  } catch (error) {
    console.error('Error getting stored assets:', error);
    return [];
  }
};

export {
  getWallet,
  createWallet,
  deleteWallet,
  storeTransactions,
  getStoredTransactions,
  storeAssets,
  getStoredAssets,
};
