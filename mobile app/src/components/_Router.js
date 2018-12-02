import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator, NativeModules, Platform, SafeAreaView } from 'react-native';
import { createSwitchNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import DictationScreen from './DictationScreen'
import SettingsScreen from './SettingsScreen'
import AuthScreen from './AuthScreen';
import FirstrunScreen from './FirstrunScreen';

import styles from './_styles'



class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('email');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator />
      </View>
    );
  }
}




const AuthSwitch = createSwitchNavigator({ FirstrunScreen: FirstrunScreen });

const AppSwitch = createSwitchNavigator({ Dictation: DictationScreen, Settings: SettingsScreen, Signup: AuthScreen })

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthSwitch,
    App: AppSwitch
  },
  {
    initialRouteName: 'AuthLoading',
  }
);


export default AppContainer = createAppContainer(AppNavigator);