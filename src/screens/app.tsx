import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { AppAuthScreen } from '../navigators'
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';

export default class App extends Component {
  render() {
    return (
      <PaperProvider>
        <NavigationContainer>
          <AppAuthScreen />
        </NavigationContainer>
      </PaperProvider>
    )
  }
}