import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../config/Colors';
import Wallet from '../screens/Wallet';
import Broadcast from '../screens/Broadcast';
import Settings from '../screens/Settings';

function BottomTabs(props) {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.toolbar,
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen
        name="Broadcast"
        component={Broadcast}
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
        component={Wallet}
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
        component={Settings}
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
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    backgroundColor: Colors.appBackground,
    height: 60,
  },
  tabItem: {
    top: 5,
  },
  mainTabItem: {
    top: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 10,
    backgroundColor: Colors.lightGray,
  },
});

export default BottomTabs;
