import assets from '../assets/liquid_assets_testnet_minimal.json';

function findAsset(assetId) {
  if (!assetId) return null;

  const asset = assets[assetId];
  return asset;
}

export default {
  findAsset,
};
