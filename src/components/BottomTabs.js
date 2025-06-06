import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PSETScreen from '../screens/PSETScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Colors from '../config/Colors';
import WalletInfo from '../screens/WalletInfo';
import AssetListScreen from '../screens/AssetListScreen';

function BottomTabs(props) {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.toolbar,
        tabBarShowLabel: false,
        headerShown: false,
        swipeEnabled: true,
      })}>
      <Tab.Screen
        name="Home"
        component={PSETScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={[styles.tabItem, focused ? styles.focusedTabItem : '']}>
              <Icon
                name="home"
                size={30}
                color={focused ? 'white' : Colors.textGray}
              />
            </View>
          ),
          gestureEnabled: false,
        }}
      />
      <Tab.Screen
        name="wallet"
        component={AssetListScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={[styles.tabItem, focused ? styles.focusedTabItem : '']}>
              <Icon
                name="wallet"
                size={30}
                color={focused ? 'white' : Colors.textGray}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="WalletInfo"
        component={WalletInfo}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={[styles.tabItem, focused ? styles.focusedTabItem : '']}>
              <Icon
                name="information-outline"
                size={30}
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
            <View
              style={[styles.tabItem, focused ? styles.focusedTabItem : '']}>
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
    backgroundColor: Colors.appBackground,
    height: 85,
    borderTopWidth: 1,
    borderTopColor: Colors.textGray,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolbarLabel: {
    fontSize: 16,
    paddingTop: 5,
  },
  tabItem: {
    marginTop: 30,
    paddingTop: 15,
    width: 90,
    height: 70,
    alignContent: 'center',
    alignItems: 'center',
  },
  focusedTabItem: {
    borderWidth: 2,
    borderTopColor: Colors.white,
    paddingTop: 14,
    marginTop: 28,
  },
});

export default BottomTabs;
