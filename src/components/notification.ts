import PushNotification, { Importance } from "react-native-push-notification";
/*PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token: any) {
        console.log("TOKEN:", token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification: any) {
        console.log("NOTIFICATION:", notification);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification: { action: any; }) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err: { message: any; }) {
        console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    popInitialNotification: false,
    requestPermissions: true,
});
*/
const createNotification = () => {
    PushNotification.createChannel(
        {
            channelId: "1", // (required)
            channelName: "Schedule", // (required)
            channelDescription: "A channel to Schedule Notifications", // (optional) default: undefined.
            importance: Importance.HIGH,
            playSound: true,
            vibrate: true,
            soundName: "default", // (optional) default: Importance.HIGH. Int value of the Android notification importance
        },
        (created: any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
}

const scheduleNotification = (item: { start: string, end: string, message: string, index: number }) => {
    PushNotification.localNotificationSchedule({
        channelId: "1",
        message: item?.message !== "" ? item.message : "You have some scheduled work", // (required)
        date: new Date(item.start), // in 60 secs
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
        repeatType: 'day',
        repeatTime: 1,
        playSound: true,
        soundName: "default",
        vibrate: true, // (optional) default: true
        vibration: 300
    });
}

const NotificationType = new Array<{
    id: number,
    date: Date,
    title: string,
    message: string,
    soundName: string,
    repeatInterval: number,
    number: number,
    data: AsyncGenerator
}>

export default { scheduleNotification, createNotification, NotificationType }