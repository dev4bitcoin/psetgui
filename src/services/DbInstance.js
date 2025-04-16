import Realm from 'realm';

import {AppSetting, Wallet, Transaction, Asset} from '../models/DbSchema';

class DBInstance {
  realm = null;

  constructor() {
    this.realm = null;
  }

  // Initialize Realm instance
  async init() {
    if (!this.realm) {
      this.realm = await Realm.open({
        schema: [
          AppSetting.schema,
          Wallet.schema,
          Transaction.schema,
          Asset.schema,
        ],
        schemaVersion: 1, // Update this if schema changes
      });
    }
    return this.realm;
  }

  // Get the Realm instance
  getInstance() {
    if (!this.realm) {
      throw new Error('Realm instance is not initialized. Call init() first.');
    }
    return this.realm;
  }

  // Close the Realm instance
  close() {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }
}

// Export a singleton instance
const dbInstance = new DBInstance();
export default dbInstance;
