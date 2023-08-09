import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { getUserState, userState } from '../context/user/reducer'
import { loginAction } from '../context/user/action'
import { connect } from 'react-redux'
import { loginResp } from '../networking/resp-type'
import { AppAuthScreen, AppHomeScreen } from '../navigators'
import { useMMKVString } from 'react-native-mmkv'
import { AppNotification } from '../components'
import { AppLoader } from '../components'


type AppProps = userState & {
    setUser: (arg0: loginResp) => void;
}
const Navigation: React.FC<AppProps> = ({ userData, isLoggedIn, setUser }) => {
    const [token, setToken] = useMMKVString("user.token");
    const [userDetail, setUserDetail] = useMMKVString("user");
    const [schedule, setSchedule] = useMMKVString("schedule")
    const [loading,setLoading] = React.useState(true)
    React.useEffect(() => {
        if (token && userDetail) {
            const userData = JSON.parse(userDetail);
            setUser(userData);
            setLoading(()=>false)
        }
        else{
            setLoading(()=>false);
        }
    }, [])
    return (
        <NavigationContainer>
            <AppLoader show={loading} />
            {isLoggedIn ? <AppHomeScreen /> : <AppAuthScreen />}
        </NavigationContainer>
    )
}
const mapStateToProps = (state: userState) => {
    return getUserState;
}

const mapDispatchToProps = {
    setUser: loginAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);