import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Block } from 'galio-framework'
import { TouchableRipple } from 'react-native-paper'
import { schedule, shortSchedule } from '../screens/home/main'
import { Theme, Utils } from '../constants'
import { timeParser } from '../screens/home/profile'
import { Slider } from '@miblanchard/react-native-slider'
import { AppIcon, AppInput, AppNotification } from '.'
import { useMMKVString } from 'react-native-mmkv'
import { timeCreater } from '../networking/controller'

interface ScheduleProps {
    start: string,
    end: string,
    message: string,
    index: number
}

function timeParser24(time: string) {
    const date = new Date(time);
    const name = date.toLocaleTimeString('en-US', { hourCycle: "h24", hour: '2-digit', minute: '2-digit', second: "2-digit" })
    return name
}

interface newBannerType {
    index: number,
    item: ScheduleProps,
    setError: React.Dispatch<React.SetStateAction<boolean>>,
    selected: number | null,
}

const NewBanner: React.FC<newBannerType> = (prop) => {
    const { index, item, setError, selected } = prop;
    const [schedule, setSchedule] = useMMKVString("schedule");
    const parsedSchedule: schedule = schedule && shortSchedule(JSON.parse(schedule))
    const [sliderValue, setSliderValue] = React.useState<Array<number> | null>(null);
    const [clicked, setClicked] = React.useState(false)
    const [scheduleMessage, setScheduleMessage] = React.useState<string>("");
    const prevTime = timeParser24(item.start).split(":")[0]
    const nextTime = timeParser24(parsedSchedule[index + 1]?.start)?.split(":")[0]
    const prevDate = new Date(item.end)
    const nextTimeDate = timeCreater(`${prevTime}:59:00`)

    React.useEffect(() => {
        if (selected !== null) {
            setClicked(() => false)
        }
    }, [selected])

    const creaetSchedule = () => {
        let startMinute = ":00:00"
        let lastMinute = ":00:00"
        if (sliderValue !== null) {
            const firstMinut = sliderValue[0].toFixed(0).length < 2 ? `0${sliderValue[0].toFixed(0)}` : sliderValue[0].toFixed(0);
            const lastMinut = sliderValue[1].toFixed(0).length < 2 ? `0${sliderValue[1].toFixed(0)}` : sliderValue[1].toFixed(0);
            startMinute = `:${firstMinut}:00`
            lastMinute = `:${lastMinut}:00`
        }
        const startTime = timeParser24(item.start).split(":")[0] + startMinute
        const endTIme = lastMinute === ":00:00" ? timeParser24(item.end).split(":")[0] + lastMinute : timeParser24(item.start).split(":")[0] + lastMinute
        const scheduleTImeStart = timeCreater(startTime)
        const scheduleTImeEnd = timeCreater(endTIme)

        if ((scheduleTImeEnd.getMinutes() - scheduleTImeStart.getMinutes()) >= 15) {
            const makeSchedule = { start: scheduleTImeStart.toISOString(), end: scheduleTImeEnd.toISOString(), message: scheduleMessage, index: index };
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
            setError(() => true)
        }

    }
    if ((parseInt(nextTime) > parseInt(prevTime)) || (nextTime == "Invalid Date") && prevDate.getMinutes() + 15 < 60) {
        return (
            <Block>
                <TouchableRipple style={{ marginVertical: "4%" }} onPress={() => {
                    setClicked(() => !clicked)
                }}>
                    <Block row space='around' middle style={{
                        borderRadius: 24,
                        backgroundColor:
                            Theme.COLORS.BG, padding: "3.5%"
                    }}>
                        <Text style={[styles.text, {
                            textAlign: "center",
                            fontSize: 12,
                            color: Theme.COLORS.MUTED,
                        }]}>{timeParser(item.end)}</Text>
                        <Text style={[styles.text, {
                            textAlign: "center",
                            fontSize: 12,
                            color:
                                Theme.COLORS.MUTED
                        }]}>
                            -
                        </Text>
                        <Text style={[styles.text, {
                            textAlign: "center",
                            fontSize: 12,
                            color: Theme.COLORS.MUTED
                        }]}>
                            {timeParser(nextTimeDate.toISOString())}
                        </Text>
                    </Block>
                </TouchableRipple>
                {clicked &&
                    <Block style={{ marginTop: "6%" }}>
                        <Slider
                            containerStyle={{ marginHorizontal: "8%" }}
                            minimumValue={prevDate.getMinutes()}
                            maximumValue={59}
                            value={sliderValue ? sliderValue : [prevDate.getMinutes(), 59]}
                            onValueChange={value => {
                                setSliderValue(() => value)
                            }}
                            renderAboveThumbComponent={(value, index) => {
                                const frontPart = timeParser(item.start).split(":")[0]
                                const backPart = timeParser(item.start).split(" ")[1]
                                return (
                                    <Text style={[styles.text, { fontSize: 12 }]}>{sliderValue && `${frontPart}:${sliderValue[value].toFixed(0)} ${backPart}`}</Text>
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
                                }} textInputStyle={{ fontSize: 12 }} />
                            <TouchableRipple
                                style={{
                                    backgroundColor: Theme.COLORS.THEME, borderRadius: 24,
                                    paddingHorizontal: "5%", position: "absolute", bottom: 0, alignItems: "center"
                                }}
                                onPress={creaetSchedule}>
                                <AppIcon size={20} source={'check'} color={Theme.COLORS.WHITE} />
                            </TouchableRipple>
                        </Block>
                    </Block>
                }
            </Block>
        )
    }
    return null;
}

const Schedule: React.FC<{
    item: ScheduleProps, index: number,
    selected: number | null,
    setError: React.Dispatch<React.SetStateAction<boolean>>
}> = (prop) => {
    const { start, end, message } = prop.item;
    const { index, selected, setError } = prop;
    const [sliderValue, setSliderValue] = React.useState<Array<number> | null>(null);
    const [clicked, setClicked] = React.useState(false)
    const [schedule, setSchedule] = useMMKVString("schedule");
    const [messagePost, setMessage] = React.useState("")

    const updateSchedule = () => {
        let startMinute = ":00:00"
        let lastMinute = ":00:00"
        if (sliderValue !== null) {
            const firstMinut = sliderValue[0].toFixed(0).length < 2 ? `0${sliderValue[0].toFixed(0)}` : sliderValue[0].toFixed(0);
            const lastMinut = sliderValue[1].toFixed(0).length < 2 ? `0${sliderValue[1].toFixed(0)}` : sliderValue[1].toFixed(0);
            startMinute = `:${firstMinut}:00`
            lastMinute = `:${lastMinut}:00`
        }
        const startTime = timeParser24(start).split(":")[0] + startMinute
        const endTIme = lastMinute === ":00:00" ? timeParser24(end).split(":")[0] + lastMinute : timeParser24(start).split(":")[0] + lastMinute
        const scheduleTImeStart = timeCreater(startTime)
        const scheduleTImeEnd = timeCreater(endTIme)

        if ((scheduleTImeEnd.getMinutes() - scheduleTImeStart.getMinutes()) >= 15) {
            const makeSchedule = { start: scheduleTImeStart.toISOString(), end: scheduleTImeEnd.toISOString(), message: messagePost, index: index };
            AppNotification.scheduleNotification(makeSchedule)
            setSchedule(() => {
                if (schedule) {
                    const oldSchedule: schedule = shortSchedule(JSON.parse(schedule));
                    oldSchedule[index] = makeSchedule
                    return JSON.stringify(oldSchedule)
                }
            })
        }
        else {
            setError(() => true)
        }
        setClicked(() => !clicked)
    }

    React.useEffect(() => {
        if (selected !== null) {
            setClicked(() => false)
        }
    }, [selected])
    return (
        <Block>
            <TouchableRipple style={{ marginVertical: "4%" }} onPress={() => {
                setClicked(() => !clicked)
            }}>
                <Block row space='around' middle style={{
                    borderRadius: 24,
                    backgroundColor:
                        Theme.COLORS.THEME, padding: "3.5%"
                }}>
                    <Text style={[styles.text, {
                        textAlign: "center",
                        fontSize: 12,
                        color: Theme.COLORS.WHITE,
                    }]}>{timeParser(start)}</Text>
                    <Text style={[styles.text, {
                        textAlign: "center",
                        fontSize: 12,
                        color:
                            Theme.COLORS.WHITE
                    }]}>
                        -
                    </Text>
                    <Text style={[styles.text, {
                        textAlign: "center",
                        fontSize: 12,
                        color: Theme.COLORS.WHITE
                    }]}>
                        {timeParser(end)}
                    </Text>
                </Block>
            </TouchableRipple>
            <Block middle style={{ paddingVertical: "4%", borderWidth: 1, borderRadius: 8, borderColor: Theme.COLORS.THEME }}>
                <Text style={[styles.text, { fontSize: 14 }]}>{message || "No Message"}</Text>
            </Block>
            {clicked &&
                <Block style={{ marginTop: "6%" }}>
                    <Slider
                        containerStyle={{ marginHorizontal: "8%" }}
                        minimumValue={1}
                        maximumValue={59}
                        value={sliderValue ? sliderValue : [1, 59]}
                        onValueChange={value => {
                            setSliderValue(() => value)
                        }}
                        renderAboveThumbComponent={(value, index) => {
                            const frontPart = timeParser(start).split(":")[0]
                            const backPart = timeParser(start).split(" ")[1]
                            return (
                                <Text style={[styles.text, { fontSize: 12 }]}>{sliderValue && `${frontPart}:${sliderValue[value].toFixed(0)} ${backPart}`}</Text>
                            )
                        }}
                    />
                    <Block style={{ marginVertical: "4%" }}>
                        <AppInput placeholder="Write about your time (15 Words)" scrollEnabled={true}
                            onChangeText={(text) => {
                                setMessage(() => text)
                            }}
                            multiline={true} numberOfLines={4} style={{
                                height: Utils.height / 8,
                                borderWidth: 2, borderColor: Theme.COLORS.THEME,
                            }} textInputStyle={{ fontSize: 12 }} />
                        <TouchableRipple onPress={updateSchedule}
                            style={{
                                backgroundColor: Theme.COLORS.THEME, borderRadius: 24,
                                paddingHorizontal: "5%", position: "absolute", bottom: 0, alignItems: "center"
                            }}>
                            <AppIcon size={20} source={'check'} color={Theme.COLORS.WHITE} />
                        </TouchableRipple>
                    </Block>
                </Block>
            }
            <NewBanner index={index} item={prop.item} setError={setError} selected={selected} />
        </Block>
    )
}

const styles = StyleSheet.create({
    text: {
        ...Utils.text
    }
})

export default Schedule