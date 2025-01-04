import BigNumber from 'bignumber.js';
import Constants from '../config/Constants';

const useTestnet = true;

const sats = useTestnet ? Constants.TEST_SATS : Constants.SATS;
const bits = useTestnet ? Constants.TEST_BITS : Constants.BITS;
const mbtc = useTestnet ? Constants.TEST_MBTC : Constants.MBTC;
const btc = useTestnet ? Constants.TEST_BTC : Constants.BTC;

function satoshiToBTC(satoshi) {
  return new BigNumber(satoshi).dividedBy(100000000).toString(10);
}

function satoshiToMBTC(satoshi) {
  return new BigNumber(satoshi).dividedBy(100000).toNumber();
}

function satoshiToBits(satoshi) {
  return new BigNumber(satoshi).dividedBy(100).toNumber();
}

function btcToSatoshi(btc) {
  return new BigNumber(btc).multipliedBy(100000000).toString(10);
}

function mBTCToSatoshi(mBTC) {
  return new BigNumber(mBTC).multipliedBy(100000).toNumber();
}

function bitsToSatoshi(satoshi) {
  return new BigNumber(satoshi).multipliedBy(100).toNumber();
}

function convertToPreferredBTCDenominator(satoshi, preferredBTCUnit) {
  preferredBTCUnit = preferredBTCUnit || sats;
  if (preferredBTCUnit === btc) {
    return satoshiToBTC(satoshi);
  } else if (preferredBTCUnit === mbtc) {
    return satoshiToMBTC(satoshi);
  } else if (preferredBTCUnit === bits) {
    return satoshiToBits(satoshi);
  } else {
    return satoshi;
  }
}

function convertToSatoshi(amount, unit) {
  if (unit?.name === btc) {
    return btcToSatoshi(amount);
  } else if (unit?.name === mbtc) {
    return mBTCToSatoshi(amount);
  } else if (unit?.name === bits) {
    return bitsToSatoshi(amount);
  } else {
    return amount;
  }
}

export default {
  convertToPreferredBTCDenominator,
  convertToSatoshi,
};
