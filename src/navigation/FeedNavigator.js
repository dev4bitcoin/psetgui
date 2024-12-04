import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../config/Colors';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Routes from './Routes';
import WalletScreen from '../screens/WalletScreen';
import BroadcastScreen from '../screens/BroadcastScreen';
import BottomTabs from '../components/BottomTabs';

const Stack = createNativeStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator
    initialRouteName={Routes.HOME}
    mode="card"
    screenOptions={{
      headerMode: 'screen',
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.appBackground, marginLeft: 20},
      headerShown: false,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
    }}>
    <Stack.Screen
      name={Routes.HOME}
      component={HomeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen name="BottomTabs" component={BottomTabs} />

    <Stack.Screen
      name={Routes.WALLET}
      component={WalletScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.SETTINGS}
      component={SettingsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.BROADCAST}
      component={BroadcastScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);
export default FeedNavigator;
