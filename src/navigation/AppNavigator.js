import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LaunchScreen from '../screens/LaunchScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import TransactionDetail from '../screens/TransactionDetail';
import SendScreen from '../screens/SendScreen';
import SendTransactionReview from '../screens/SendTransactionReview';
import SelectRecipient from '../screens/SelectRecipient';
import ScanScreen from '../screens/ScanScreen';
import SendToAddress from '../screens/SendToAddress';
import SuccessScreen from '../screens/SuccessScreen';
import DenominationSelection from '../screens/settings/DenominationSelection';
import AppAccess from '../screens/settings/AppAccess';
import BottomTabs from '../components/BottomTabs';
import RecoveryPhrase from '../screens/settings/RecoveryPhrase';
import Detail from '../screens/PSET/Detail';
import AboutScreen from '../screens/AboutScreen';
import SignerSelection from '../screens/PSET/SignerSelection';
import SignWithMnemonic from '../screens/PSET/SignWithMnemonic';
import Recipient from '../screens/PSET/Recipient';
import WalletScreen from '../screens/WalletScreen';
import AssetListScreen from '../screens/AssetListScreen';
import ExportPSET from '../screens/PSET/ExportPSET';
import DescriptorScreen from '../screens/DescriptorScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LaunchScreen"
        component={LaunchScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssetList"
        component={AssetListScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Receive"
        component={ReceiveScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SendScreen"
        component={SendScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SendTransactionReview"
        component={SendTransactionReview}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectRecipient"
        component={SelectRecipient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SendToAddress"
        component={SendToAddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Denomination"
        component={DenominationSelection}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppAccess"
        component={AppAccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RecoveryPhrase"
        component={RecoveryPhrase}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Recipient"
        component={Recipient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignerSelection"
        component={SignerSelection}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="SignWithMnemonic"
        component={SignWithMnemonic}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ExportPSET"
        component={ExportPSET}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Descriptor"
        component={DescriptorScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
