import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useMemo, useRef } from 'react'
import { Database, Pictures, Theme, Utils } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block, Button } from 'galio-framework'
import { AppDialogue, AppIcon, AppInput, AppNotification, AppSchedule, AppSnackBar } from '../../components'
import { TouchableRipple, Snackbar } from 'react-native-paper'
import { getUserState, userState } from '../../context/user/reducer'
import { HomeStackProps } from '../../navigators/homestack'
import { loginResp } from '../../networking/resp-type'
import { loginAction } from '../../context/user/action'
import { connect } from 'react-redux'
import { Slider } from '@miblanchard/react-native-slider';
import { timeCreater } from '../../networking/controller'
import { useMMKVString } from 'react-native-mmkv'
import { timeParser } from './profile'
import PushNotification, { Importance } from "react-native-push-notification";
import { find } from 'lodash'
import BackgroundFetch from "react-native-background-fetch";

type MainProps = userState & HomeStackProps<"Main"> & {
  setUser: (arg0: loginResp) => void;
}

function getDayName() {
  var date = new Date();
  const name = date.toLocaleDateString('en-US', { weekday: 'long' });
  return name.split(",")[0]
}

export type schedule = Array<{ start: string, end: string, message: string, index: number }>

const filterSchedule = (sch: schedule, items: { start: string, end: string }) => {
  return sch?.findIndex((item, indexs) => timeParser24(item.start).split(":")[0] === timeParser24(items.start).split(":")[0])
}

export const shortSchedule = (schedules: schedule): schedule => {
  return schedules?.sort((prev, next) => {
    const prevs = new Date(prev.end)
    const nexts = new Date(next.end)
    return prevs - nexts
  })
}


const secondParser = (time: string) => {
  var timeComponents = time.split(":");
  var hours = parseInt(timeComponents[0], 10);
  var minutes = parseInt(timeComponents[1], 10);
  var seconds = parseInt(timeComponents[2], 10);

  // Create a new Date object with the current date and the parsed time components
  var currentDate = new Date();
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(seconds);

  return timeParser(currentDate.toISOString())
}

function timeParser24(time: string) {
  const date = new Date(time);
  const name = date.toLocaleTimeString('en-US', { hourCycle: "h24", hour: '2-digit', minute: '2-digit', second: "2-digit" })
  return name
}

function Main(prop: MainProps) {
  const { navigation, userData, setUser, route } = prop;
  const [search, setSearch] = React.useState<string>(null!!);
  const [schedule, setSchedule] = useMMKVString("schedule");
  const parsedSchedule: schedule = schedule && shortSchedule(JSON.parse(schedule))
  const [selectedTime, setSelectedTime] = React.useState<number | null>(null);
  const [sliderValue, setSliderValue] = React.useState<Array<number> | null>([0, 60]);
  const [scheduleMessage, setScheduleMessage] = React.useState<string>("");
  const user = route.params?.user;
  const workingTable = user ? Utils.timeToArray(null, null) : Utils.timeToArray(userData?.working_time_start, userData?.working_time_end)
  const [error, setError] = React.useState<boolean>(false);
  const [timeError, setTimeError] = React.useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [lastPos, setLastPos] = React.useState<number>(0);

  React.useEffect(() => {
    AppNotification.createNotification()
    PushNotification.getScheduledLocalNotifications((item: typeof AppNotification.NotificationType) => {
      //console.log("items", item)
    });
    backgroundWork()
    if (schedule) {
      const day = new Date(parsedSchedule[0]?.start).getDate()
      const currDate = new Date().getDate()
      if (currDate > day) {
        Database.delete("schedule")
        PushNotification.cancelAllLocalNotifications()
      }
    }
  }, [])

  const event = async function event(id: string) {

  }

  const backgroundWork = async function initBackgroundFetch() {
    // BackgroundFetch event handler.
    const onEvent = async (taskId: string) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      await event(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId: string) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({ minimumFetchInterval: 60 * 12, enableHeadless: true, forceAlarmManager: true, startOnBoot: true, stopOnTerminate: false }, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  }




  const onRequest = () => {
    setError(() => !error)
  }

  const creaetSchedule = (index: number) => {
    let startMinute = ":00:00"
    let lastMinute = ":00:00"
    if (sliderValue !== null) {
      const firstMinut = sliderValue[0].toFixed(0).length < 2 ? `0${sliderValue[0].toFixed(0)}` : sliderValue[0].toFixed(0);
      const lastMinut = sliderValue[1].toFixed(0).length < 2 ? `0${sliderValue[1].toFixed(0)}` : sliderValue[1].toFixed(0);
      startMinute = `:${firstMinut}:00`
      lastMinute = `:${lastMinut}:00`
    }
    const startTime = timeParser24(workingTable[index].start).split(":")[0] + startMinute
    const endTIme = lastMinute === ":60:00" ? timeParser24(workingTable[index].end).split(":")[0] + ":00:00" : timeParser24(workingTable[index].start).split(":")[0] + lastMinute
    const scheduleTImeStart = timeCreater(startTime)
    const scheduleTImeEnd = timeCreater(endTIme)
    const makeSchedule = { start: scheduleTImeStart.toISOString(), end: scheduleTImeEnd.toISOString(), message: scheduleMessage, index: index };

    if (new Date(makeSchedule.start).getTime() > new Date(Date.now()).getTime()) {
      AppNotification.scheduleNotification(makeSchedule)
      setScheduleMessage("")
      setSchedule(() => {
        if (schedule) {
          const oldSchedule: schedule = shortSchedule(JSON.parse(schedule))
          oldSchedule.push(makeSchedule)
          return JSON.stringify(oldSchedule)
        }
        return JSON.stringify([makeSchedule])
      })
    }
    else {
      setTimeError(() => !error)
    }
  }

  const scrollToEdit = (clicked: boolean) => {
    if (clicked) {
      scrollViewRef?.current?.scrollTo({ x: 0, y: Math.round(lastPos) + 180, animated: true })
    }
    else {
      scrollViewRef?.current?.scrollTo({ x: 0, y: Math.round(lastPos) - 180, animated: true })
    }

  }
  return (
    <SafeAreaView>
      <Snackbar duration={2000} visible={timeError} style={{ backgroundColor: Theme.COLORS.ERROR, zIndex: 20 }} onDismiss={() => {
        setTimeError(() => false)
      }}>
        <Text style={[styles.text, { fontSize: 14, color: Theme.COLORS.WHITE }]}>The Time you selected is already passed!</Text>
      </Snackbar>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppDialogue show={error} error={{
          name: 'Coming Soon!',
          message: 'This Feature will arrive on 20th july'
        }} onSuccess={() => setError(() => !error)} />

        <View style={styles.container}>
          <View style={styles.header}>
            <Block style={styles.block}>
              <Text style={[styles.text, { color: Theme.COLORS.THEME, fontSize: 18 }]}>MAIN PAGE</Text>
            </Block>

            <Block middle row space='evenly'>
              <AppInput value={search} editable={true} style={{ width: Utils.width / 1.5 }} right rounded placeholder='Search' icon='magnify'
                onChangeText={(text) => { setSearch(() => text) }} onSubmitEditing={() => {
                  setError(() => true)
                }} />
              <Block style={{ borderWidth: 2, borderRadius: 50, borderColor: Theme.COLORS.THEME }}>
                <TouchableRipple onPress={() => {
                  navigation.navigate("Profile", {
                    name: "home"
                  })
                }}>
                  <AppIcon source={user?.profile_picture ?? userData?.profile_picture ?? Pictures.authPictures.profile} size={50} imageStyle={{ resizeMode: "contain", borderRadius: 50 }} />
                </TouchableRipple>
              </Block>
            </Block>
          </View>

          <View style={styles.body}>
            {!user ?
              <Block style={styles.block}>
                <Block center style={{ borderRadius: 24, backgroundColor: "#EAEAEA", width: "50%", marginVertical: "3%" }}>
                  <Text style={[styles.text, {
                    color: Theme.COLORS.THEME,
                    padding: "2%"
                  }]}>{getDayName().toUpperCase()}</Text>
                </Block>

                <View style={{ maxHeight: Utils.height / 1.8 }}>
                  <ScrollView showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    nestedScrollEnabled={true}
                    onMomentumScrollEnd={(e) => {
                      e.persist()
                      setLastPos(() => e?.nativeEvent?.contentOffset.y)
                    }}>
                    {workingTable?.map((item, index) => (
                      <>
                        {filterSchedule(parsedSchedule, item) == -1 || filterSchedule(parsedSchedule, item) == undefined ?
                          <TouchableRipple key={index} style={{ marginVertical: "4%" }} onPress={() => {
                            if (index === selectedTime) {
                              setSelectedTime(() => null)
                            }
                            else {
                              setSelectedTime(() => index)
                            }
                            scrollToEdit(selectedTime == null)
                          }}>
                            <Block row key={index} space='around' middle style={{
                              borderRadius: 24,
                              backgroundColor: index == selectedTime ?
                                Theme.COLORS.THEME : "#EAEAEA", padding: "3.5%"
                            }}>
                              <Text style={[styles.text, {
                                textAlign: "center",
                                fontSize: 12,
                                color: index == selectedTime ?
                                  Theme.COLORS.WHITE : Theme.COLORS.MUTED
                              }]}>{timeParser(item.start)}</Text>
                              <Text style={[styles.text, {
                                textAlign: "center",
                                fontSize: 12,
                                color: index == selectedTime ?
                                  Theme.COLORS.WHITE : Theme.COLORS.MUTED
                              }]}>
                                -
                              </Text>
                              <Text style={[styles.text, {
                                textAlign: "center",
                                fontSize: 12,
                                color: index == selectedTime ? Theme.COLORS.WHITE : Theme.COLORS.MUTED
                              }]}>
                                {timeParser(item.end)}
                              </Text>
                            </Block>
                          </TouchableRipple>
                          : null}

                        {selectedTime === index &&
                          <Block style={{ marginTop: "6%" }}>
                            <Slider
                              containerStyle={{ marginHorizontal: "8%" }}
                              minimumValue={0}
                              maximumValue={60}
                              step={15}
                              value={sliderValue ? sliderValue : [0, 60]}
                              onValueChange={value => {
                                setSliderValue(() => value)
                              }}
                              renderAboveThumbComponent={(value, index) => {
                                let time = sliderValue && timeParser(workingTable[selectedTime].start).split(":")[0] + `:${sliderValue[value].toFixed(0)}`
                                if (sliderValue && parseInt(sliderValue[value].toFixed(0)) == 60) {
                                  time = timeParser(workingTable[selectedTime].end).split(":")[0] + `:0`
                                }
                                const backPart = timeParser(workingTable[selectedTime]?.start).split(" ")[1]
                                return (
                                  <Text style={[styles.text, { fontSize: 12 }]}>{sliderValue && `${time} ${backPart}`}</Text>
                                )
                              }}
                            />
                            <Block style={{ marginVertical: "4%" }}>
                              <AppInput placeholder="Write about your time (15 Words)" scrollEnabled={true}
                                onChangeText={(text) => {
                                  setScheduleMessage(() => text)
                                }}
                                multiline={true} numberOfLines={4} style={{
                                  height: Utils.height / 8,
                                  borderWidth: 2, borderColor: Theme.COLORS.THEME,
                                }}
                                maxLength={30} textInputStyle={{ fontSize: 12 }} />

                              <TouchableRipple onPress={() => {
                                creaetSchedule(index)
                                setSelectedTime(() => null)
                              }}
                                style={{ backgroundColor: Theme.COLORS.THEME, borderRadius: 24, paddingHorizontal: "5%", position: "absolute", bottom: 0, alignItems: "center" }}>
                                <AppIcon size={20} source={'check'} color={Theme.COLORS.WHITE} />
                              </TouchableRipple>

                            </Block>
                          </Block>
                        }
                        {parsedSchedule?.map((chidItem, indexs) => {
                          const time = timeParser24(chidItem.start).split(":")[0]
                          const upperTime = timeParser24(item.start).split(":")[0]
                          if (time == upperTime) {
                            return <AppSchedule item={chidItem} scrollToEnd={scrollToEdit} index={indexs} upperIndex={index}
                              selected={selectedTime!!} setError={setTimeError} workingTable={workingTable} />
                          }
                          return null;
                        })}
                      </>
                    ))}
                  </ScrollView>
                </View>
                <Block middle>
                  <Button round color={Theme.COLORS.THEME} style={{ width: Utils.width / 1.2, marginVertical: "4%" }} onPress={onRequest}>
                    <Text style={[styles.text, { color: Theme.COLORS.WHITE, fontSize: 14 }]}>REQUEST</Text>
                  </Button>
                </Block>
              </Block>
              : <Block middle style={{ marginVertical: "8%", flex: 7 }}>
                <Text style={[styles.text, { ...Utils.textExtraBold }]}>No User Selected</Text>
              </Block>}
          </View>

          <View style={styles.footer}>
            <Block style={styles.block} row space='between'>
              <Block>
                <Block middle style={styles.buttons}>
                  <AppIcon source={"bell"} size={24} color={Theme.COLORS.WHITE} />
                </Block>
                <Text style={[styles.text, { textAlign: "center", fontSize: 12, color: Theme.COLORS.THEME }]}>NOTIFICATION</Text>
              </Block>

              <Block>
                <Block middle style={styles.buttons}>
                  <AppIcon source={"account"} size={24} color={Theme.COLORS.WHITE} />
                </Block>
                <Text style={[styles.text, { textAlign: "center", fontSize: 12, color: Theme.COLORS.THEME }]}>REQUESTS</Text>
              </Block>

              <Block>
                <TouchableRipple onPress={() => { navigation.navigate('Setting') }}>
                  <Block middle style={styles.buttons}>
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
  },
  buttons: {
    backgroundColor: Theme.COLORS.THEME,
    borderRadius: 24,
    padding: "10%"
  }
})

const mapStateToProps = (state: userState) => {
  return getUserState;
}

const mapDispatchToProps = {
  setUser: loginAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);