import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { Login, Otp } from '../screens/auth';
import { Main, Profile } from '../screens/home';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';


export type RootStackParamList = {
    Login: undefined,
    Otp: { callback: FirebaseAuthTypes.ConfirmationResult }
}
const Stack = createNativeStackNavigator<RootStackParamList>();

export type AuthStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
            <Stack.Screen component={Login} name="Login" />
            <Stack.Screen component={Otp} name='Otp' />
        </Stack.Navigator>
    )
}