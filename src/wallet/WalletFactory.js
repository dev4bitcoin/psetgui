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
  static builderInstance = null;
  static defaultWallet = null;

  static async init(seed = null) {
    const network = Network.testnet();

    this.clientInstance = network.defaultElectrumClient();
    this.builderInstance = new TxBuilder(network);

    const wallet = await getDefaultWallet();
    this.defaultWallet = JSON.parse(wallet);

    if (this.defaultWallet) {
      const {mnemonic, descriptor} = this.defaultWallet;

      this.signerInstance = new Signer(new Mnemonic(mnemonic), network);
      const desc = new WolletDescriptor(descriptor);
      this.wolletInstance = new Wollet(network, desc, undefined);
      await this.updateWallet();
    } else {
      if (seed) {
        this.signerInstance = new Signer(new Mnemonic(seed), network);
        const desc = await this.signerInstance.wpkhSlip77Descriptor();
        this.wolletInstance = new Wollet(network, desc, undefined);
        await this.updateWallet();
      }
    }
  }

  static async GetSavedTransactions() {
    console.log('GetSavedTransactions');

    if (!this.defaultWallet) return [];

    const transactions = await getStoredTransactions(this.defaultWallet.id);
    return transactions;
  }

  static async GetSavedBalance() {
    console.log('GetSavedBalance');
    if (!this.defaultWallet) return null;

    const balance = await getStoredBalance(this.defaultWallet.id);
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

  static async GetTransactions() {
    console.log('GetTransactions');
    const txs = await this.wolletInstance.transactions();

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

    // Retrieve existing transactions from AsyncStorage
    const storedTransactions = await getStoredTransactions(
      this.defaultWallet?.id,
    );

    // Filter out new transactions
    const existingTransactionIds = storedTransactions?.map(tx => tx.txid);
    const uniqueNewTransactions = newTransactions.filter(
      tx => !existingTransactionIds.includes(tx.txid),
    );

    // Combine existing and new transactions
    const updatedTransactions = [
      ...storedTransactions,
      ...uniqueNewTransactions,
    ];

    // Store the updated transactions back to AsyncStorage
    await storeTransactions(this.defaultWallet?.id, updatedTransactions);

    return updatedTransactions;
  }

  static async GetBalance() {
    console.log('GetBalance');
    await this.updateWallet(this.wolletInstance);
    const res = await this.wolletInstance.balance();
    var balance = {};
    res.forEach((value, key) => {
      if (balance[key.toString()] === undefined) {
        balance[key.toString()] = 0;
      }
      balance[key.toString()] += Number(value);
    });

    await storeBalance(this.defaultWallet?.id, balance);
    return balance;
  }

  static async ResetWallets() {
    console.log('ResetWallets');
    return await resetWallets();
  }

  static async BroadcastTransaction(address, satoshis) {
    console.log('BroadcastTransaction');
    try {
      const fee_rate = 100; // this is the sat/vB * 100 fee rate. Example 280 would equal a fee rate of .28 sat/vB. 100 would equal .1 sat/vB
      const addressInterface = new Address(address);

      await this.builderInstance.addLbtcRecipient(
        addressInterface,
        parseFloat(satoshis, 10),
      );
      await this.builderInstance.feeRate(fee_rate);

      let pset = await this.builderInstance.finish(this.wolletInstance);
      const psetString = await pset.toString();
      console.log('Unsigned PSET', psetString);
      let signed_pset = await this.signerInstance.sign(pset);
      console.log('SIGNED PSET:', await signed_pset.toString());
      let finalized_pset = await this.wolletInstance.finalize(signed_pset);
      const tx = await finalized_pset.extractTx();

      //await client.broadcast(tx);
      //const txId = await tx.txid();

      //console.log('BROADCASTED TX!\nTXID: {:?}', txId);
      //return txId;
      return null;
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
      return {balances, fee, signatures, recipients};
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

    const descriptor = await this.signerInstance.wpkhSlip77Descriptor();
    const descriptorString = await descriptor.toString();
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
}
