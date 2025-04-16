class Transaction {
  constructor({
    balance,
    fee,
    height,
    inputs,
    outputs,
    timestamp,
    transaction,
    tx,
    txid,
    type,
    walletId,
  }) {
    this.balance = balance;
    this.fee = fee;
    this.height = height;
    this.inputs = inputs;
    this.outputs = outputs;
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.tx = tx;
    this.txid = txid;
    this.type = type;
    this.walletId = walletId;
  }

  // Add methods as needed
}

export default Transaction;
