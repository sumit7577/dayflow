import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login, Otp } from '../screens/auth';
import { User } from '../screens/auth/login';


export type RootStackParamList = {
    Login: undefined,
    Otp: { mode: "Login" | "Signup", data: Partial<User> }
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