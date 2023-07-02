import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React from 'react'
import { Pictures, Theme, Utils } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block, Button } from 'galio-framework'
import { AppIcon, AppInput } from '../../components'
import { TouchableRipple } from 'react-native-paper'
import { getUserState, userState } from '../../context/user/reducer'
import { HomeStackProps } from '../../navigators/homestack'
import { loginResp } from '../../networking/resp-type'
import { loginAction } from '../../context/user/action'
import { connect } from 'react-redux'

type MainProps = userState & HomeStackProps<"Main"> & {
  setUser: (arg0: loginResp) => void;
}
function Main(prop: MainProps) {
  const { navigation, userData, setUser } = prop;
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Block style={styles.block}>
              <Text style={[styles.text, { color: Theme.COLORS.THEME, fontSize: 18 }]}>MAIN PAGE</Text>
            </Block>

            <Block middle row space='evenly'>
              <AppInput style={{ width: Utils.width / 1.5 }} right rounded placeholder='Search' icon='card-search-outline'
                onPress={() => { console.log("pressed") }} />
              <Block style={{ borderWidth: 2, borderRadius: 50, borderColor: Theme.COLORS.THEME }}>
                <Image source={Pictures.authPictures.logo} style={{ height: 50, width: 50 }} />
              </Block>
            </Block>
          </View>

          <View style={styles.body}>
            <Block style={styles.block}>
              <Block center style={{ borderRadius: 24, backgroundColor: "#EAEAEA", width: "50%", marginVertical: "3%" }}>
                <Text style={[styles.text, {
                  color: Theme.COLORS.THEME,
                  padding: "2%"
                }]}>MONDAY</Text>
              </Block>

              <View style={{ maxHeight: Utils.height / 3 }}>
                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                  {Array.from('aaaaaaaa').map((item, index) => (
                    <TouchableRipple key={index} style={{ marginVertical: "4%" }} onPress={() => { console.log("prssed") }}>
                      <Block row key={index} space='around' middle style={{ borderRadius: 24, backgroundColor: "#EAEAEA", padding: "3.5%" }}>
                        <Text style={[styles.text, {
                          textAlign: "center",
                          fontSize: 12,
                          color: Theme.COLORS.MUTED
                        }]}>{8 + index}:00 AM</Text>
                        <Text style={[styles.text, {
                          textAlign: "center",
                          fontSize: 12,
                          color: Theme.COLORS.MUTED
                        }]}>
                          -
                        </Text>
                        <Text style={[styles.text, {
                          textAlign: "center",
                          fontSize: 12,
                          color: Theme.COLORS.MUTED
                        }]}>
                          {8 + index + 1}:00 AM
                        </Text>
                      </Block>
                    </TouchableRipple>
                  ))}
                </ScrollView>
              </View>

              <Block style={{ marginVertical: "4%" }}>
                <Block row space='between' style={{ paddingHorizontal: "4%", paddingVertical: "4%" }}>
                  <Text style={{
                    ...Utils.text,
                    backgroundColor: Theme.COLORS.THEME, borderRadius: 24, paddingHorizontal: "5%",
                    color: Theme.COLORS.WHITE, fontSize: 14
                  }}>FROM</Text>
                  <Text style={{
                    ...Utils.text,
                    backgroundColor: Theme.COLORS.MUTED, borderRadius: 24, paddingHorizontal: "5%",
                    color: Theme.COLORS.WHITE, fontSize: 14
                  }}>TO</Text>
                  <Block style={{ backgroundColor: Theme.COLORS.THEME, borderRadius: 24, paddingHorizontal: "5%" }}>
                    <AppIcon size={20} source={'check'} color={Theme.COLORS.WHITE} />
                  </Block>
                </Block>
                <AppInput placeholder="Write about your time (15 Words)" scrollEnabled={true}
                  multiline={true} numberOfLines={4} style={{
                    height: Utils.height / 8,
                    borderWidth: 2, borderColor: Theme.COLORS.THEME,
                  }} textInputStyle={{ fontSize: 12 }} />
              </Block>
              <Block middle>
                <Button round color={Theme.COLORS.THEME} style={{ width: Utils.width / 1.2 }}>
                  <Text style={[styles.text, { color: Theme.COLORS.WHITE, fontSize: 14 }]}>REQUEST</Text>
                </Button>
              </Block>
            </Block>

          </View>

          <View style={styles.footer}>
            <Block style={styles.block} row space='between'>
              <Block>
                <Block middle style={{ backgroundColor: Theme.COLORS.THEME, borderRadius: 24, padding: "10%" }}>
                  <AppIcon source={"bell"} size={24} color={Theme.COLORS.WHITE} />
                </Block>
                <Text style={[styles.text, { textAlign: "center", fontSize: 12, color: Theme.COLORS.THEME }]}>NOTIFICATION</Text>
              </Block>

              <Block>
                <Block middle style={{ backgroundColor: Theme.COLORS.THEME, borderRadius: 24, padding: "10%" }}>
                  <AppIcon source={"account"} size={24} color={Theme.COLORS.WHITE} />
                </Block>
                <Text style={[styles.text, { textAlign: "center", fontSize: 12, color: Theme.COLORS.THEME }]}>REQUESTS</Text>
              </Block>

              <Block>
                <TouchableRipple onPress={() => { navigation.navigate("Profile") }}>
                  <Block middle style={{ backgroundColor: Theme.COLORS.THEME, borderRadius: 24, padding: "10%" }}>
                    <AppIcon source={"cog"} size={24} color={Theme.COLORS.WHITE} />
                  </Block>
                </TouchableRipple>
                <Text style={[styles.text, { textAlign: "center", fontSize: 12, color: Theme.COLORS.THEME }]}>SETTINGS</Text>
              </Block>

            </Block>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    height: "100%"
  },
  text: {
    ...Utils.text
  },
  header: {
    marginVertical: "4%"
  },
  body: {

  },
  footer: {

  },
  block: {
    backgroundColor: Theme.COLORS.WHITE,
    borderRadius: 4,
    elevation: 4,
    marginVertical: "4%",
    paddingHorizontal: "4%",
    paddingVertical: "4%"
  }
})

const mapStateToProps = (state: userState) => {
  return getUserState;
}

const mapDispatchToProps = {
  setUser: loginAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);