import {
  Wollet,
  Signer,
  Mnemonic,
  Network,
  WolletDescriptor,
  Bip,
  Pset,
  Address,
} from 'lwk-rn';

import uuid from 'react-native-uuid';
import Constants from '../config/Constants';
import {
  createWallet,
  getDefaultWallet,
  isWalletExist,
  resetWallets,
  getStoredTransactions,
  storeTransactions,
  storeBalance,
  getStoredBalance,
} from '../services/WalletService';
import Transaction from '../models/Transaction';

export default class WalletFactory {
  static signerInstance = null;
  static wolletInstance = null;
  static clientInstance = null;
  static defaultWallet = null;
  static shouldSaveToStorage = false;

  static async init(seed = null) {
    const network = Network.testnet();

    this.clientInstance = network.defaultElectrumClient();

    const wallet = await getDefaultWallet();
    this.defaultWallet = JSON.parse(wallet);

    if (this.defaultWallet) {
      const {mnemonic, descriptor} = this.defaultWallet;

      this.signerInstance = new Signer(new Mnemonic(mnemonic), network);
      const desc = new WolletDescriptor(descriptor);
      this.wolletInstance = new Wollet(network, desc, undefined);
      this.shouldSaveToStorage = true;
    } else {
      if (seed) {
        this.signerInstance = new Signer(new Mnemonic(seed), network);
        const desc = await this.signerInstance.wpkhSlip77Descriptor();
        this.wolletInstance = new Wollet(network, desc, undefined);
      }
    }
  }

  static async initWithDescriptor(descriptor = null) {
    const network = Network.testnet();
    this.clientInstance = network.defaultElectrumClient();

    const desc = new WolletDescriptor(descriptor);
    this.wolletInstance = new Wollet(network, desc, undefined);
  }

  static ValidateDescriptor(descriptor) {
    console.log('ValidateDescriptor');
    try {
      const desc = new WolletDescriptor(descriptor);
      return true;
    } catch (error) {
      console.error('Failed to validate descriptor:', error);
      return false;
    }
  }

  static async GetSavedTransactions(assetId) {
    console.log('GetSavedTransactions');

    if (!assetId) return [];

    const transactions = await getStoredTransactions(assetId);
    return transactions;
  }

  static async GetSavedBalance(assetId) {
    console.log('GetSavedBalance');
    if (!assetId) return null;

    const balance = await getStoredBalance(assetId);
    const totalBalance = Object.values(balance).reduce(
      (sum, balance) => sum + balance,
      0,
    );

    return totalBalance;
  }

  static async CreateWallet(shouldStoreMnemonic) {
    try {
      console.log('CreateWallet');
      const descriptor = await this.signerInstance.wpkhSlip77Descriptor();
      const descriptorString = await descriptor.toString();

      const mnemonic = await this.signerInstance.mnemonic();

      if (shouldStoreMnemonic) {
        this.shouldSaveToStorage = true;
        await createWallet(
          JSON.stringify({
            id: uuid.v4(),
            mnemonic: mnemonic.toString(),
            descriptor: descriptorString,
          }),
        );
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }

  static async updateWallet() {
    console.log('updateWallet');
    const update = await this.clientInstance.fullScan(this.wolletInstance);
    await this.wolletInstance.applyUpdate(update);
  }

  static async GetWollet() {
    return this.wolletInstance;
  }

  static IsWalletExist() {
    if (!this.defaultWallet) {
      return false;
    }
    return true;
  }

  static async GetNewAddress() {
    console.log('GetNewAddress');
    const address = this.wolletInstance.address(undefined);
    const txt = address.address().toString();
    return txt;
  }

  static async GetAssets() {
    console.log('GetAssets');
    await this.updateWallet(this.wolletInstance);
    const assets = await this.wolletInstance.balance();
    return assets;
  }

  static async GetTransactions(assetId) {
    console.log('GetTransactions');

    if (!assetId) return [];

    const txs = await this.wolletInstance.transactions();
    const newTransactions = [];
    txs?.forEach(tx => {
      var balance = {};
      tx.balance().forEach((value, key) => {
        if (balance[key.toString()] === undefined) {
          balance[key.toString()] = 0;
        }
        balance[key.toString()] += Number(value);
      });

      const shouldInclude = tx?.outputs()?.some(output => {
        const outputAsset = output?.unblinded()?.asset();
        return outputAsset === assetId;
      });

      if (shouldInclude) {
        const txToInclude = new Transaction({
          balance: balance,
          fee: Number(tx.fee()),
          height: tx.height(),
          type: tx.type(),
          txid: tx.txid().toString(),
          timestamp: tx.timestamp(),
          tx: tx.tx().toString(),
        });

        newTransactions.push(txToInclude);
      }
    });

    let updatedTransactions = [];
    if (this.shouldSaveToStorage) {
      // Retrieve existing transactions from AsyncStorage
      const storedTransactions = await getStoredTransactions(assetId);

      // Filter out new transactions
      const existingTransactionIds = storedTransactions?.map(tx => tx.txid);

      const uniqueNewTransactions =
        existingTransactionIds?.length > 0
          ? newTransactions?.filter(
              tx => !existingTransactionIds.includes(tx?.txid),
            )
          : newTransactions;

      // Combine existing and new transactions
      updatedTransactions = [...storedTransactions, ...uniqueNewTransactions];

      // Store the updated transactions back to AsyncStorage
      await storeTransactions(assetId, updatedTransactions);
    }

    const result = this.shouldSaveToStorage
      ? updatedTransactions?.filter(tx => tx != null)
      : newTransactions?.filter(tx => tx != null);
    return result;
  }

  static async GetBalance(assetId) {
    console.log('GetBalance');
    await this.updateWallet(this.wolletInstance);
    const res = await this.wolletInstance.balance();
    var balance = 0;
    res.forEach((value, key) => {
      if (key.toString() === assetId) {
        balance = Number(value || 0);
      }
    });

    if (this.shouldSaveToStorage) {
      await storeBalance(assetId, balance);
    }
    return balance;
  }

  static async ResetWallets() {
    console.log('ResetWallets');
    return await resetWallets();
  }

  static async BroadcastTransaction(address, satoshis) {
    console.log('BroadcastTransaction');
    try {
      const signedPset = await this.CreatePSET(address, satoshis, false);
      const finalizedPset = await this.wolletInstance.finalize(signedPset);
      const tx = await finalizedPset.extractTx();

      const txId = await this.clientInstance.broadcast(tx);
      console.log('BROADCASTED TX!\nTXID: {:?}', txId.toString());
      return txId.toString();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static ValidateAddress(address) {
    console.log('ValidateAddress', address);
    try {
      const addressInterface = new Address(address);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async GetMnemonic() {
    console.log('GetMnemonic');
    return this.signerInstance.mnemonic().toString();
  }

  static async ExtractPsetDetails(pset) {
    console.log('ExtractPsetDetails');
    try {
      const psetInstance = new Pset(pset);
      const details = await this.wolletInstance.psetDetails(psetInstance);
      const balances = details.balance().balances();
      const fee = details.balance().fee();
      const signatures = details.signatures();
      const recipients = details.balance().recipients();
      const inputsIssuances = details.inputsIssuances();
      return {balances, fee, signatures, recipients, inputsIssuances};
    } catch (error) {
      console.error('PSET validation failed:', error);
      return null;
    }
  }

  static async ExtractTransaction(pset) {
    console.log('ExtractTransaction');
    try {
      const tx = await pset.extractTx();
      return tx;
    } catch (error) {
      console.error('Failed to extract transaction:', error);
      return null;
    }
  }

  static async GetWolletInfo() {
    console.log('GetWolletInfo');

    const descriptor = await this.wolletInstance.descriptor();
    const descriptorString = await descriptor.toString();
    if (!this.signerInstance) {
      return {descriptorString};
    }

    const bip49Xpub = await this.signerInstance.keyoriginXpub(Bip.newBip49());
    const bip84Xpub = await this.signerInstance.keyoriginXpub(Bip.newBip84());
    const bip87Xpub = await this.signerInstance.keyoriginXpub(Bip.newBip87());
    return {descriptorString, bip49Xpub, bip84Xpub, bip87Xpub};
  }

  static async SignPSETWithMnemonic(pset) {
    console.log('SignWithMnemonic');
    try {
      const psetInstance = new Pset(pset);
      const signedPset = await this.signerInstance.sign(psetInstance);
      return signedPset.toString();
    } catch (error) {
      console.error('Failed to sign PSET:', error);
      return null;
    }
  }

  static async BroadcastPSET(signedPset) {
    console.log('BroadcastPSET');
    try {
      await this.updateWallet(this.wolletInstance);
      const psetInstance = new Pset(signedPset);
      const finalizedPset = await this.wolletInstance.finalize(psetInstance);
      const tx = await finalizedPset.extractTx();
      const txId = await this.clientInstance.broadcast(tx);
      return txId.toString();
    } catch (error) {
      console.error('Failed to broadcast PSET:', error);
      return null;
    }
  }

  static ValidatePSET(pset) {
    console.log('ValidatePSET');
    try {
      const psetInstance = new Pset(pset);
      return true;
    } catch (error) {
      console.error('Failed to validate PSET:', error);
      return false;
    }
  }

  static async CreatePSET(address, satoshis, asString = true) {
    console.log('CreatePSET');
    try {
      const fee_rate = 100; // this is the sat/vB * 100 fee rate. Example 280 would equal a fee rate of .28 sat/vB. 100 would equal .1 sat/vB

      const outAddress = new Address(address);
      const builder = Network.testnet().txBuilder();

      await builder.addLbtcRecipient(outAddress, BigInt(satoshis));
      await builder.feeRate(fee_rate);

      await this.updateWallet(this.wolletInstance);
      let pset = await builder.finish(this.wolletInstance);
      const psetString = await pset.toString();

      if (this.signerInstance) {
        let signedPset = await this.signerInstance.sign(pset);
        return asString ? signedPset.toString() : signedPset;
      }

      return asString ? psetString : pset;
    } catch (error) {
      console.error('Failed to create PSET:', error);
      return null;
    }
  }
}
