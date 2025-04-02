import assets from '../assets/liquid_assets_testnet_minimal.json';
import Constants from '../config/Constants';

function findAsset(assetId) {
  if (!assetId) return null;

  const asset = assets[assetId];

  if (!asset && assetId == Constants.LIQUID_TESTNET_ASSETID) {
    return ['Blockstream', 'tL-BTC', 'Liquid Testnet', 8];
  }

  return asset;
}

export default {
  findAsset,
};
