import { Text, View,StatusBar } from 'react-native'
import React, { Component } from 'react'
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from '../context';
import { Theme } from '../constants';
import Navigation from './navigation';

export const queryClient = new QueryClient();


export default class App extends Component {
  async componentDidMount(): Promise<void> {
    StatusBar.setBackgroundColor(Theme.COLORS.WHITE)
    StatusBar.setTranslucent(true)
    StatusBar.setBarStyle("dark-content")
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