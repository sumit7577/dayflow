import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { AppAuthScreen, AppHomeScreen } from '../navigators'
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from '../context';
import { Database } from '../constants';
import { loginResp } from '../networking/resp-type';
import Navigation from './navigation';

export const queryClient = new QueryClient();


export default class App extends Component {
  async componentDidMount(): Promise<void> {
    console.log("mounted")
  }
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Provider store={store}>
            <Navigation />
          </Provider>
        </PaperProvider>
      </QueryClientProvider>
    )
  }
}