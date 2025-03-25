import React, {createContext, useEffect, useState} from 'react';

import Constants from '../config/Constants';
import Storage from '../storage/Storage';

// Create the context
export const AppContext = createContext();

// Create a provider component
const AppContextProvider = ({children}) => {
  const [preferredBitcoinUnit, setPreferredBitcoinUnit] = useState();
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mnemonicSaved, setMnemonicSaved] = useState(false);

  useEffect(() => {
    const initializeContext = async () => {
      await getPreferredBitcoinDenomination();
      await getBiometricsStatus();
      await getSaveMnemonicStatus();
      setIsLoading(false);
    };
    initializeContext();
  }, []);

  const getPreferredBitcoinDenomination = async () => {
    const preferredUnit = await Storage.getItem(
      Constants.PREFERRED_BITCOIN_UNIT,
    );
    setPreferredBitcoinUnit(preferredUnit || Constants.TEST_SATS);
    return preferredUnit || Constants.TEST_SATS;
  };

  const setPreferredBitcoinDenomination = async unit => {
    const status = await Storage.storeItem(
      Constants.PREFERRED_BITCOIN_UNIT,
      unit,
    );
    setPreferredBitcoinUnit(unit);
  };

  const setBiometricsStatus = async displayStatus => {
    setShowBiometrics(displayStatus);
    return await Storage.storeItem(
      Constants.BIOMETRICS_DISPLAY_STATUS,
      displayStatus,
    );
  };

  const getBiometricsStatus = async () => {
    const status = await Storage.getItem(Constants.BIOMETRICS_DISPLAY_STATUS);
    if (!status) {
      setShowBiometrics(false);
      return false;
    }
    setShowBiometrics(status);
    return status;
  };

  const setSaveMnemonicStatus = async saveMnemonic => {
    setMnemonicSaved(saveMnemonic);
    return await Storage.storeItem(Constants.SAVE_MNEMONIC, saveMnemonic);
  };

  const getSaveMnemonicStatus = async () => {
    const status = await Storage.getItem(Constants.SAVE_MNEMONIC);
    if (!status) {
      setMnemonicSaved(false);
      return false;
    }
    setMnemonicSaved(status);
    return status;
  };

  return (
    <AppContext.Provider
      value={{
        setBiometricsStatus,
        showBiometrics,
        setPreferredBitcoinDenomination,
        preferredBitcoinUnit,
        mnemonicSaved,
        setSaveMnemonicStatus,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
