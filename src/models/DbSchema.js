import Realm, {ObjectSchema, BSON} from 'realm';

export class AppSetting extends Realm.Object {
  static schema = {
    name: 'AppSetting',
    properties: {
      _id: 'objectId',
      key: {type: 'string', indexed: true},
      value: {type: 'string', indexed: false},
    },
    primaryKey: '_id',
  };
}

export class Wallet extends Realm.Object {
  static schema = {
    name: 'Wallet',
    properties: {
      _id: 'objectId',
      walletId: {type: 'string', indexed: false},
      mnemonic: {type: 'string', indexed: false},
      descriptor: {type: 'string', indexed: false},
      isTestnet: {type: 'bool', indexed: false, default: true},
    },
    primaryKey: '_id',
  };
}

export class Transaction extends Realm.Object {
  static schema = {
    name: 'Transaction',
    properties: {
      _id: 'objectId',
      txId: {type: 'string', indexed: true},
      balance: {type: 'string', indexed: false},
      fee: {type: 'string', indexed: false},
      height: {type: 'string', indexed: false, optional: true},
      type: {type: 'string', indexed: false},
      timestamp: {type: 'string', indexed: false, optional: true},
      walletId: {type: 'string', indexed: true},
      assetId: {type: 'string', indexed: true},
    },
    primaryKey: '_id',
  };
}

export class Asset extends Realm.Object {
  static schema = {
    name: 'Asset',
    properties: {
      _id: 'objectId',
      assetId: {type: 'string', indexed: true},
      balance: {type: 'string', indexed: false},
      entity: {type: 'string', indexed: false},
      ticker: {type: 'string', indexed: false},
      precision: {type: 'int', indexed: false},
      name: {type: 'string', indexed: false},
      walletId: {type: 'string', indexed: true},
    },
    primaryKey: '_id',
  };
}
