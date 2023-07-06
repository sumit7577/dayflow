import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { Main, Profile, Search } from '../screens/home';
import { loginResp } from '../networking/resp-type';
import { Setting } from '../screens/settings';



export type RootStackParamList = {
    Profile: undefined,
    Main: { user: loginResp | undefined },
    Search: { name: string },
    Setting: undefined
}
const Stack = createNativeStackNavigator<RootStackParamList>();

export type HomeStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
            <Stack.Screen component={Profile} name="Profile" />
            <Stack.Screen component={Main} name='Main' />
            <Stack.Screen component={Search} name='Search' />
            <Stack.Screen component={Setting} name='Setting' />
        </Stack.Navigator>
    )
}