import React, {createContext, useEffect, useState} from 'react';
import {BSON} from 'realm';

import Constants from '../config/Constants';
import {useRealm} from '@realm/react';

// Create the context
export const AppContext = createContext();

// Create a provider component
const AppContextProvider = ({children}) => {
  const realm = useRealm();
  const [preferredBitcoinUnit, setPreferredBitcoinUnit] = useState();
  const [biometricStatus, setBiometricStatus] = useState(false);
  const [mnemonicSaved, setMnemonicSaved] = useState(false);
  const [useTestnet, setUseTestnet] = useState(false);

  useEffect(() => {
    initSetting();
  }, []);

  const initSetting = async () => {
    getAppSettingByKey(Constants.USE_TESTNET);
    getAppSettingByKey(Constants.PREFERRED_BITCOIN_UNIT);
    getAppSettingByKey(Constants.SAVE_MNEMONIC);
    getAppSettingByKey(Constants.BIOMETRICS_DISPLAY_STATUS);
  };

  const getAppSettingByKey = key => {
    const result = realm.objects('AppSetting').filtered(`key == "${key}"`)[0];

    if (result) {
      setValueForLocalVariable(key, result.value);
      return result.value;
    }

    // Set UseTestnet to true for testing
    if (key === Constants.USE_TESTNET) {
      setUseTestnet(true);
      return true;
    }

    // Set default values for other keys
    if (key === Constants.PREFERRED_BITCOIN_UNIT) {
      setPreferredBitcoinUnit(
        // useTestnet ? Constants.TEST_SATS : Constants.SATS,
        // For testing purposes, set the preferred bitcoin unit to mSATS
        Constants.TEST_SATS,
      );
      return Constants.SATS;
    }
    return null;
  };

  const setValueForLocalVariable = (key, value) => {
    if (key === Constants.PREFERRED_BITCOIN_UNIT) {
      setPreferredBitcoinUnit(value);
    }
    if (key === Constants.USE_TESTNET) {
      setUseTestnet(value);
    }
    if (key === Constants.SAVE_MNEMONIC) {
      setMnemonicSaved(value);
    }
    if (key === Constants.BIOMETRICS_DISPLAY_STATUS) {
      setBiometricStatus(value);
    }
  };

  const setAppSettingByKey = (key, value) => {
    setValueForLocalVariable(key, value);

    const setting = realm.objects('AppSetting').filtered(`key == "${key}"`)[0];
    if (setting?.key) {
      realm.write(() => {
        setting.value = value?.toString();
      });
    } else {
      realm.write(() => {
        realm.create('AppSetting', {
          _id: new BSON.ObjectId(),
          key: key,
          value: value?.toString(),
        });
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        setAppSettingByKey,
        biometricStatus,
        preferredBitcoinUnit,
        mnemonicSaved,
        useTestnet,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
