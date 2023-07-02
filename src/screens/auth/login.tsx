import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { AuthStackProps } from '../../navigators/authstach'
import { Utils, Pictures, Theme, Database } from '../../constants'
import { Block, Button, Checkbox } from 'galio-framework'
import { AppInput, AppDialogue, AppLoader } from '../../components'
import { TouchableRipple } from 'react-native-paper'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query'
import { ApiController } from '../../networking'


const Signup: React.FC<{ setSignup: React.Dispatch<Partial<User>>, signUp: () => void }> = ({ setSignup, signUp }) => {
  return (
    <Block style={{ width: Utils.width / 1.2 }}>
      <AppInput onChangeText={(text) => { setSignup(({ username: text })) }} placeholder='Full Name' rounded />
      <AppInput type='number-pad' onChangeText={(text) => { setSignup(({ phone: text })) }} placeholder='Phone Number' rounded maxLength={10} />
      <AppInput onChangeText={(text) => { setSignup(({ email: text })) }} placeholder='Email id (optional)' rounded />
      <Block row style={{ alignItems: "center", paddingTop: "4%" }}>
        <Checkbox color={Theme.COLORS.BLACK} label={""} />
        <Text style={[styles.text, { fontSize: 12, paddingLeft: "4%" }]}>I Accept the</Text>
        <TouchableRipple style={{ justifyContent: "center" }}>
          <Text style={[styles.text, { fontSize: 12, color: Theme.COLORS.THEME }]}> Terms & Conditions.</Text>
        </TouchableRipple>
      </Block>
      <Block style={{ alignItems: "center" }}>
        <Button color={Theme.COLORS.THEME} round style={{ width: Utils.width / 1.2, marginVertical: "8%" }} onPress={signUp}>
          <Text style={[styles.text, { ...Utils.textWhite, fontSize: 14 }]}>GET OTP</Text>
        </Button>
      </Block>

    </Block>
  )
}
type LoginProps = AuthStackProps<"Login">;

interface User {
  phone: string,
  email: string | null,
  username: string

}

export default function Login(props: LoginProps) {
  const { navigation } = props;
  const [mode, setMode] = React.useState<"Login" | "Signup">("Login");
  const [callback, setCallback] = React.useState<FirebaseAuthTypes.ConfirmationResult>(null!!);
  const [userData, setUserData] = React.useReducer((curr: User, update: Partial<User>): User => {
    const newEvent = { ...curr, ...update };
    if (newEvent.phone.length === 10) {
      newEvent.phone = `91${newEvent.phone}`
    }
    return newEvent;
  }, { phone: "", username: "", email: "" })

  const loginMutation = useMutation({
    mutationFn: (input) => {
      return ApiController.login({ phone: userData.phone })
    },
    onSuccess: async (data) => {
      if (data.success) {
        Database.set("user.token", data.message);
        const callback = await auth().signInWithPhoneNumber(`+${userData.phone}`);
        navigation.navigate("Otp", {
          callback: callback
        })
      }
    }
  })

  const signUpMutation = useMutation({
    mutationFn: () => {
      return ApiController.signup({ user: { username: userData.username, email: userData.email }, phone: userData.phone })

    },
    onSuccess: async (data) => {
      const datas = await ApiController.login({ phone: data.phone })
      Database.set("user.token", datas.message)
      navigation.navigate("Otp", {
        callback: callback
      })
    },
    onMutate: async (variables) => {
      const callback = await auth().signInWithPhoneNumber(`+${userData.phone}`);
      if (callback.verificationId) {
        setCallback(() => callback)
      }
    },
  })

  const login = async () => {
    loginMutation.mutate()
  }

  const signUp = async () => {
    signUpMutation.mutate();
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <AppDialogue show={loginMutation.isError || signUpMutation.isError} error={loginMutation.error || signUpMutation.error} />
        <AppDialogue show={signUpMutation.isSuccess} error={{ name: "Success!", message: "User Successfully Created" }} />
        <AppLoader show={loginMutation.isLoading || signUpMutation.isLoading} />
        <View style={styles.header}>
          <Block middle>
            <Image source={Pictures.authPictures.logo} style={{ resizeMode: "contain", height: Utils.height / 4, width: Utils.width }} />
          </Block>
        </View>
        <View style={styles.body}>
          <Block>
            <Block row space='between' style={{ borderRadius: 24, backgroundColor: Theme.COLORS.BG2, marginVertical: "4%" }}>
              <TouchableRipple style={{
                flexGrow: 1,
                backgroundColor: mode === "Login" ? Theme.COLORS.THEME : Theme.COLORS.BG2,
                alignItems: "center",
                borderRadius: 24
              }} onPress={() => {
                setMode(() => "Login")
              }}>
                <Text style={[styles.text, {
                  color: mode === "Login" ? Theme.COLORS.WHITE : Theme.COLORS.THEME,
                  padding: "3%"
                }]}>LOG IN</Text>
              </TouchableRipple>
              <TouchableRipple style={{
                flexGrow: 1,
                backgroundColor: mode === "Signup" ? Theme.COLORS.THEME : Theme.COLORS.BG2,
                alignItems: "center",
                borderRadius: 24
              }} onPress={() => {
                setMode(() => "Signup");
              }}>
                <Text style={[styles.text, {
                  color: mode === "Signup" ? Theme.COLORS.WHITE : Theme.COLORS.THEME,
                  padding: "3%"
                }]}>SIGN UP</Text>
              </TouchableRipple>

            </Block>

            <Block middle style={{ marginVertical: "2%" }}>
              {mode === "Login" ?
                <>
                  <AppInput placeholder='Phone Number' rounded maxLength={10} type='number-pad' onChangeText={(text) => {
                    setUserData(({ phone: text }));
                  }} />
                  <Button color={Theme.COLORS.THEME} round style={{ width: "100%", marginVertical: "5%" }} onPress={login}>
                    <Text style={[styles.text, { ...Utils.textWhite, fontSize: 14 }]}>SEND OTP</Text>
                  </Button>
                </>
                : <Signup setSignup={setUserData} signUp={signUp} />
              }
            </Block>

            <Block middle style={{ marginVertical: "5%", marginHorizontal: "10%" }}>
              <Text style={[styles.text, { textAlign: "center", fontSize: 10 }]}>By continuing, you agree to accept our Privacy Policy & Terms of Service</Text>
            </Block>


          </Block>

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
    paddingHorizontal: "7%",
    backgroundColor: Theme.COLORS.WHITE,
    elevation: 4,
    borderRadius: 8,
    margin: "4%",
    height: "70%",
    paddingVertical: "7%"
  },
  footer: {

  },
  text: {
    ...Utils.text
  }
})