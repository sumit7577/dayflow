import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HomeStackProps } from '../../navigators/homestack'
import { Block, Button } from 'galio-framework'
import { Database, Theme, Utils } from '../../constants'
import { getUserState, userState } from '../../context/user/reducer'
import { loginResp } from '../../networking/resp-type'
import { loginAction, logoutAction } from '../../context/user/action'
import { connect } from 'react-redux'
import { AppDialogue } from '../../components'

type settingProps = userState & HomeStackProps<'Setting'> & {
    logoutUser: () => void
}

function Settings(prop: settingProps) {
    const { navigation, userData, logoutUser } = prop;
    const [show, setShow] = React.useState(false);
    const [shows, setShows] = React.useState(false);
    const signout = () => {
        logoutUser()
        Database.delete("user.token")
        Database.delete("user")
        Database.delete("schedule")
    }
    return (
        <SafeAreaView>
            <AppDialogue show={show} error={{
                name: 'Logout',
                message: 'Are you sure you want to logout?'
            }} action confirmPress={signout} onSuccess={() => {
                setShow(() => !show)
            }} />
            <AppDialogue show={shows} error={{
                name: 'Coming Soon!',
                message: 'This Feature will arrive on 13th july'
            }} onSuccess={() => {
                setShows(() => !shows)
            }} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Block style={styles.block}>
                        <Text style={[styles.text, { color: Theme.COLORS.THEME, fontSize: 18 }]}>SETTINGS</Text>
                    </Block>
                </View>
                <View style={styles.body}>
                    <Block middle style={[styles.block, { paddingVertical: "8%" }]}>
                        <Button style={{ width: Utils.width / 1.3, marginVertical: "4%" }} onPress={() => {
                            navigation.navigate("Profile",{
                                name:"home"
                            })
                        }}
                            color={Theme.COLORS.THEME} round>
                            <Text style={styles.text}>PROFILE</Text>
                        </Button>

                        <Button style={{ width: Utils.width / 1.3, marginVertical: "4%" }} onPress={() => {
                            setShows(() => !shows)
                        }}
                            color={Theme.COLORS.THEME} round>
                            <Text style={styles.text}>GROUPS</Text>
                        </Button>

                        <Button style={{ width: Utils.width / 1.3, marginVertical: "4%" }} color={Theme.COLORS.THEME}
                            onPress={() => {
                                setShows(() => !shows)
                            }}
                            round>
                            <Text style={styles.text}>PRIVACY POLICY</Text>
                        </Button>

                        <Button style={{ width: Utils.width / 1.3, marginVertical: "4%" }} color={Theme.COLORS.THEME}
                            onPress={() => {
                                setShows(() => !shows)
                            }}
                            round>
                            <Text style={styles.text}>TERMS & CONDITIONS</Text>
                        </Button>

                        <Button style={{ width: Utils.width / 1.3, marginVertical: "4%" }} onPress={() => {
                            setShow(() => !show)
                        }}
                            color={Theme.COLORS.THEME} round>
                            <Text style={styles.text}>SIGN OUT</Text>
                        </Button>
                    </Block>
                </View>


            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: "6%",
        paddingVertical: "4%"
    },
    header: {

    },
    body: {
        marginVertical: "4%"
    },
    footer: {

    },
    text: {
        ...Utils.text,
        ...Utils.textWhite,
        fontSize: 14
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
    logoutUser: logoutAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);