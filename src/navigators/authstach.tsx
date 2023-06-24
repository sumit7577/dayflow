import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { Login } from '../screens/auth';


export type RootStackParamList = {
    Login: undefined,
    Otp: undefined,
}
const Stack = createNativeStackNavigator<RootStackParamList>();

export type AuthStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <Stack.Screen component={Login} name="Login" />
        </Stack.Navigator>
    )
}