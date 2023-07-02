import { View, Text, StyleSheet, Image, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AuthStackProps } from '../../navigators/authstach'
import { Database, Pictures, Theme, Utils } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block, Button } from 'galio-framework'
import { AppDialogue, AppInput, AppLoader } from '../../components'
import { TouchableRipple } from 'react-native-paper'
import { useQuery } from '@tanstack/react-query'
import { ApiController } from '../../networking'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { getUserState, userState } from '../../context/user/reducer'
import { loginResp } from '../../networking/resp-type'
import { connect } from 'react-redux'
import { loginAction } from '../../context/user/action'

type OtpProps = AuthStackProps<"Otp"> & userState & {
  setUser: (arg0: loginResp) => void;
}

function Otp(props: OtpProps) {
  const { navigation, route, userData, isLoggedIn, setUser } = props;
  const [errors, setError] = React.useState({ success: false, message: "", loading: false });
  const otpRef1 = useRef<TextInput>(null);
  const otpRef2 = useRef<TextInput>(null);
  const otpRef3 = useRef<TextInput>(null);
  const otpRef4 = useRef<TextInput>(null);
  const otpRef5 = useRef<TextInput>(null);
  const otpRef6 = useRef<TextInput>(null);
  const [otpData1, setOtpData1] = useState('');
  const [otpData2, setOtpData2] = useState('');
  const [otpData3, setOtpData3] = useState('');
  const [otpData4, setOtpData4] = useState('');
  const [otpData5, setOtpData5] = useState('');
  const [otpData6, setOtpData6] = useState('');

  const text1Change = (text: any) => {
    setOtpData1(text)
    if (text.length === 1) {
      otpRef2?.current?.focus();
    }

  }
  const text2Change = (text: any) => {
    setOtpData2(text)
    if (text.length == 1) {
      otpRef3?.current?.focus();
    }
    else {
      otpRef1?.current?.focus();
    }
  }
  const text3Change = (text: any) => {
    setOtpData3(text)
    if (text.length == 1) {
      otpRef4?.current?.focus();
    }
    else {
      otpRef2.current?.focus();
    }
  }
  const text4Change = (text: any) => {
    setOtpData4(text)
    if (text.length == 1) {
      otpRef5?.current?.focus();
    }
    else {
      otpRef3?.current?.focus();
    }
  }

  const text5Change = (text: any) => {
    setOtpData5(text)
    if (text.length == 1) {
      otpRef6?.current?.focus();
    }
    else {
      otpRef4?.current?.focus();
    }
  }

  const text6Change = (text: any) => {
    setOtpData6(text)
    if (text.length == 1) {
    }
    else {
      otpRef5?.current?.focus();
    }
  }

  const getProfile = async () => {
    try {
      const profile = await ApiController.profile();
      if (profile[0].id) {
        setUser(profile[0]);
        Database.set("user", JSON.stringify(profile[0]))
      }
    }
    catch (error) {
      setError((prev) => ({ ...prev, loading: false, success: true, message: "User Not Found!" }))
    }
  }

  const verifyOtp = async () => {
    setError((prev) => ({ ...prev, loading: true, success: false }))
    if (otpData1.length > 0 && otpData2.length > 0 && otpData3.length > 0 && otpData4.length > 0 && otpData5.length > 0 && otpData6.length > 0) {
      try {
        const result = await route.params.callback.confirm(otpData1 + otpData2 + otpData3 + otpData4 + otpData5 + otpData6);
        if (result?.user) {
          await getProfile();
        }
      }
      catch (error) {
        setError((prev) => ({ ...prev, success: true, loading: false, message: "Please Enter Valid Otp!" }))
      }

    }
    else {
      setError((prev) => ({ ...prev, loading: false, success: true, message: "Please Fill All Otp" }))
    }
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <AppDialogue show={errors.success} error={{ name: "Invalid Otp!", message: errors.message }} />
        <AppLoader show={errors.loading} />
        <View style={styles.header}>
          <Block middle>
            <Image source={Pictures.authPictures.logo} style={{ resizeMode: "contain", height: Utils.height / 4, width: Utils.width }} />
          </Block>
        </View>

        <View style={styles.body}>
          <Block middle style={{ borderRadius: 24, backgroundColor: Theme.COLORS.BG2, marginVertical: "4%" }}>
            <Text style={[styles.text, {
              color: Theme.COLORS.THEME,
              padding: "3%"
            }]}>ENTER OTP</Text>
          </Block>
          <Block>
            <Text style={[styles.text, { fontSize: 12, color: Theme.COLORS.MUTED, textAlign: "center" }]}>A six digit code has been sent to your contact no.</Text>
            <Block row space='between' style={{ marginVertical: "4%" }}>
              <AppInput onRef={otpRef1} style={styles.input} type="number-pad" maxLength={1} onChangeText={text1Change} />
              <AppInput onRef={otpRef2} style={styles.input} type="number-pad" maxLength={1} onChangeText={text2Change} />
              <AppInput onRef={otpRef3} style={styles.input} type="number-pad" maxLength={1} onChangeText={text3Change} />
              <AppInput onRef={otpRef4} style={styles.input} type="number-pad" maxLength={1} onChangeText={text4Change} />
              <AppInput onRef={otpRef5} style={styles.input} type="number-pad" maxLength={1} onChangeText={text5Change} />
              <AppInput onRef={otpRef6} style={styles.input} type="number-pad" maxLength={1} onChangeText={text6Change} />
            </Block>

            <Block middle>
              <Button color={Theme.COLORS.THEME} round style={{ width: "100%", marginVertical: "4%" }} onPress={verifyOtp}>
                <Text style={[styles.text, { ...Utils.textWhite, fontSize: 14 }]}>VERIFY</Text>
              </Button>
              <Text style={styles.text}>1:49</Text>
              <Block style={{ backgroundColor: "#0A3A5C", borderRadius: 24, marginVertical: "8%" }}>
                <TouchableRipple onPress={() => { navigation.goBack() }}>
                  <Text style={[{ ...Utils.textBold }, { color: Theme.COLORS.WHITE, fontSize: 12, paddingHorizontal: "8%", paddingVertical: "1%" }]}>
                    Sign-in from Another Contact No.</Text>
                </TouchableRipple>

              </Block>
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
    height: "100%"
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
  },
  input: {
    width: Utils.width / 8.1,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
    borderColor: Theme.COLORS.BLACK,
    marginRight: "2%"
  }
})

const mapStateToProps = (state: userState) => {
  return getUserState;
}

const mapDispatchToProps = {
  setUser: loginAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Otp);