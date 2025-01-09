import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import WalletScreen from '../screens/WalletScreen';
import PSETScreen from '../screens/PSETScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Colors from '../config/Colors';

function BottomTabs(props) {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.toolbar,
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen
        name="PSET"
        component={PSETScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabItem}>
              <Icon
                name="broadcast"
                size={30}
                color={focused ? 'white' : Colors.textGray}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.mainTabItem}>
              <Icon
                name="wallet"
                size={40}
                color={focused ? Colors.white : Colors.textGray}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabItem}>
              <Icon
                name="cog"
                size={30}
                color={focused ? Colors.white : Colors.textGray}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.appBackground,
    height: 80,
  },
  tabItem: {
    top: 5,
    width: 30,
    height: 30,
  },
  mainTabItem: {
    top: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 10,
    borderWidth: 0.3,
    borderColor: Colors.textGray,
    backgroundColor: Colors.lightGray,
  },
});

export default BottomTabs;
