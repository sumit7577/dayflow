import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { AuthStackProps } from '../../navigators/authstach'


const Signup: React.FC = () => {
  return (
    <Text>i am signup scren</Text>
  )
}
type LoginProps = AuthStackProps<"Login">;

export default function Login(props: LoginProps) {
  const { navigation } = props;
  const [mode, setMode] = React.useState<"Login" | "Signup">("Login");
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>

        </View>
        <View style={styles.body}>

        </View>

      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  header: {

  },
  body: {

  },
  footer: {

  }
})