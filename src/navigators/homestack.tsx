import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { Profile } from '../screens/home';


export type RootStackParamList = {
    Profile:undefined
}
const Stack = createNativeStackNavigator<RootStackParamList>();

export type HomeStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
            <Stack.Screen component={Profile} name="Profile" />
        </Stack.Navigator>
    )
}