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

  useEffect(() => {
    console.log('AppContextProvider useEffect');
    const initializeContext = async () => {
      await getPreferredBitcoinDenomination();
      await getBiometricsStatus();
      setIsLoading(false);
    };
    initializeContext();
  }, []);

  const getPreferredBitcoinDenomination = async () => {
    const preferredUnit = await Storage.getItem(
      Constants.PREFERRED_BITCOIN_UNIT,
    );
    setPreferredBitcoinUnit(preferredUnit);
    return preferredUnit;
  };

  const setPreferredBitcoinDenomination = async unit => {
    const status = await Storage.storeItem(
      Constants.PREFERRED_BITCOIN_UNIT,
      unit,
    );
  };

  const setBiometricsStatus = async displayStatus => {
    console.log('setBiometricsStatus', displayStatus);
    setShowBiometrics(displayStatus);
    return await Storage.storeItem(
      Constants.BIOMETRICS_DISPLAY_STATUS,
      displayStatus,
    );
  };

  const getBiometricsStatus = async () => {
    const status = await Storage.getItem(Constants.BIOMETRICS_DISPLAY_STATUS);
    console.log('getBiometricsStatus', status);
    if (!status) {
      setShowBiometrics(false);
      return false;
    }
    setShowBiometrics(status);
    return status;
  };

  return (
    <AppContext.Provider
      value={{
        setBiometricsStatus,
        showBiometrics,
        setPreferredBitcoinDenomination,
        preferredBitcoinUnit,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
