/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { AppRoot } from './src/screens';
import { name as appName } from './app.json';
import BackgroundFetch from "react-native-background-fetch";
import storage from './src/constants/database';
import { shortSchedule } from './src/screens/home/main';
import PushNotification from "react-native-push-notification";

let MyHeadlessTask = async (event) => {
    // Get task id from event {}:
    let taskId = event.taskId;
    let isTimeout = event.timeout;  // <-- true when your background-time has expired.
    if (isTimeout) {
        // This task has exceeded its allowed running-time.
        // You must stop what you're doing immediately finish(taskId)
        console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
        return;
    }
    const schedule = storage.getString("schedule")
    const parsedSchedule = schedule && shortSchedule(JSON.parse(schedule))
    if (schedule) {
        const day = new Date(parsedSchedule[0]?.start).getDate()
        const currDate = new Date().getDate()
        if (currDate > day) {
            storage.delete("schedule")
            PushNotification.cancelAllLocalNotifications()
        }
    }
    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
}

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent(appName, () => AppRoot);
