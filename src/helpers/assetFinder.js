import testnetAssets from '../assets/liquid_assets_testnet_minimal.json';
import mainnetAssets from '../assets/index.minimal.json';
import Constants from '../config/Constants';

function findAsset(assetId, useTestnet) {
  if (!assetId) return null;

  const assets = useTestnet ? testnetAssets : mainnetAssets;

  const asset = assets[assetId];

  if (!asset && assetId == Constants.LIQUID_TESTNET_ASSETID) {
    return ['Blockstream', 'tL-BTC', 'Liquid Testnet', 8];
  }

  if (!asset && assetId == Constants.LIQUID_MAINNET_ASSETID) {
    return ['', 'L-BTC', 'Liquid Bitcoin', 8];
  }

  return asset;
}

export default {
  findAsset,
};
