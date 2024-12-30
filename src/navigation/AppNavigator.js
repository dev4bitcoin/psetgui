import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LaunchScreen from '../screens/LaunchScreen';
import App from '../../App';
import ReceiveScreen from '../screens/ReceiveScreen';
import TransactionDetail from '../screens/TransactionDetail';
import SendScreen from '../screens/SendScreen';
import SendTransactionReview from '../screens/SendTransactionReview';
import SelectRecipient from '../screens/SelectRecipient';
import ScanScreen from '../screens/ScanScreen';
import SendToAddress from '../screens/SendToAddress';
import SuccessScreen from '../screens/SuccessScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LaunchScreen">
        <Stack.Screen
          name="LaunchScreen"
          component={LaunchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainApp"
          component={App}
          options={{headerShown: false}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
