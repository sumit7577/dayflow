import { View, Text, StyleSheet, ScrollView, Image, LogBox } from 'react-native'
import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block, Button } from 'galio-framework'
import { Database, Pictures, Theme, Utils } from '../../constants'
import { TouchableRipple } from 'react-native-paper'
import _ from 'lodash';
import reject from "lodash/reject";
import MultiSelect from 'react-native-multiple-select'
import { AppDialogue, AppIcon, AppInput, AppLoader } from '../../components'
import DatePicker from 'react-native-date-picker'
import { List } from '../../constants'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { ApiController } from '../../networking'
import { getUserState, userState } from '../../context/user/reducer'
import { HomeStackProps } from '../../navigators/homestack'
import { loginResp } from '../../networking/resp-type'
import { loginAction } from '../../context/user/action'
import { connect } from 'react-redux'
import { timeCreater } from '../../networking/controller'
import { useMMKVString } from 'react-native-mmkv'
import { launchImageLibrary } from 'react-native-image-picker'


export const Dates = [
  { "name": "Mon", "selected": false, num: 1 },
  { "name": "Tue", "selected": false, num: 2 },
  { "name": "Wed", "selected": false, num: 3 },
  { "name": "Thu", "selected": false, num: 4 },
  { "name": "Fri", "selected": false, num: 5 },
  { "name": "Sat", "selected": false, num: 6 },
  { "name": "Sun", "selected": false, num: 7 }
]


type ProfileProps = userState & HomeStackProps<"Profile"> & {
  setUser: (arg0: loginResp) => void;
}

export function timeParser(time: string) {
  const date = new Date(time);
  const name = date.toLocaleTimeString('en-US', { hourCycle: "h12", hour: '2-digit', minute: '2-digit' })
  return name
}

function Profile(props: ProfileProps) {
  const { userData, navigation, setUser, route } = props;
  const [userDetail, setUserDetail] = useMMKVString("user");
  const [daySelected, setDaySelected] = React.useState<typeof Dates>(Dates);
  const [profileData, setProfileData] = React.useState<Partial<loginResp>>({ working_time_start: timeCreater("8:00:00").toISOString(), working_time_end: timeCreater("17:00:00").toISOString() });
  const selectProffession = (items: Array<string>) => {
    setProfileData((prev) => ({ ...prev, proffession: items }))
  }
  const selecteInterest = (items: Array<string>) => {
    setProfileData((prev) => ({ ...prev, interest: items }))
  }
  const [open, setOpen] = React.useState(false)
  const [openEnd, setOpenEnd] = React.useState(false)

  const patchProfile = useMutation({
    mutationKey: ["patchProfile"],
    mutationFn: () => {
      return ApiController.pathchProfile(profileData, userData?.id!!, daySelected)
    },
    onSuccess: (data) => {
      setUser(data)
      setUserDetail(JSON.stringify(data))
    }
  })

  const openCamera = async () => {
    const selectedImage = await launchImageLibrary({ mediaType: "photo", selectionLimit: 2 });
    setProfileData((prev: any) => {
      if (selectedImage.assets && selectedImage.assets.length > 0) {
        return {
          ...prev, profile_picture: {
            uri: selectedImage.assets[0].uri,
            type: selectedImage.assets[0].type, name: selectedImage.assets[0].fileName
          }
        }
      }
      else {
        return { ...prev }
      }
    })
  }

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: ApiController.profile,
    onSuccess: (data) => {
      const response = { ...data[0] };
      delete response.id;
      delete response.user;
      if (response.working_time_start?.length > 1) {
        response.working_time_start = timeCreater(response.working_time_start).toISOString()
      }
      else {
        response.working_time_start = timeCreater("8:00:00").toISOString()
      }
      if (response.working_time_end?.length > 1) {
        response.working_time_end = timeCreater(response.working_time_end).toISOString()
      }
      else {
        response.working_time_end = timeCreater("17:00:00").toISOString()
      }
      if (response.working_days?.length > 1) {
        setDaySelected(response.working_days)
      }
      if (response.proffession == null) {
        response.proffession = []
      }
      if (response.interest == null) {
        response.interest = []
      }
      setProfileData(response)
      setUserDetail(JSON.stringify(data[0]))
    }
  })

  const submit = () => {
    patchProfile.mutate()
  }
  React.useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])
  return (
    <SafeAreaView>
      <AppDialogue show={patchProfile.isError} error={patchProfile.error} />
      <AppDialogue show={patchProfile.isSuccess} error={{ name: "Success", message: "Profile Updated Successfully!" }} icon={"sticker-check"} onSuccess={() => {
        navigation.goBack()
      }} />
      <AppLoader show={patchProfile.isLoading || isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={styles.container}>
          <DatePicker
            modal
            mode='time'
            open={open}
            date={profileData?.working_time_start ? new Date(profileData.working_time_start) : new Date()}
            onConfirm={(date) => {
              setProfileData((prev) => ({ ...prev, working_time_start: date.toISOString() }))
            }}
            onCancel={() => {
              setOpen(!open)
            }}
          />
          <DatePicker
            modal
            mode='time'
            open={openEnd}
            date={profileData?.working_time_end ? new Date(profileData.working_time_end) : new Date()}
            onConfirm={(date) => {
              setProfileData((prev) => ({ ...prev, working_time_end: date.toISOString() }))
            }}
            onCancel={() => {
              setOpenEnd(!openEnd)
            }}
          />
          <View style={styles.header}>
            <Block style={styles.block}>
              <Text style={[styles.text, {
                color: Theme.COLORS.THEME,
                padding: "4%",
                fontSize: 20
              }]}>PROFILE PAGE</Text>
            </Block>
          </View>

          <View style={styles.body}>

            <Block style={[styles.block, { paddingVertical: "6%", paddingHorizontal: "4%", marginTop: "10%" }]}>
              <Block center style={{ position: "absolute", top: "-15%" }}>
                <TouchableRipple onPress={openCamera} style={{
                  borderWidth: 2, borderColor: Theme.COLORS.THEME,
                  height: Utils.height / 8, width: Utils.width / 4, borderRadius: 50,
                  alignItems: "center"
                }}>
                  <AppIcon source={profileData?.profile_picture?.uri ?? profileData?.profile_picture ?? Pictures.authPictures.profile}
                    imageStyle={{ height: Utils.height / 8.4, width: Utils.width / 4.2, resizeMode: "contain", borderRadius: 50 }} size={0} />

                </TouchableRipple>
                <Block middle style={{
                  position: "absolute", bottom: 5, right: 0,
                  borderRadius: 50,
                  padding: "3%",
                  backgroundColor: Theme.COLORS.THEME
                }}>
                  <AppIcon color={Theme.COLORS.WHITE} size={20} source='pencil-outline' />

                </Block>
              </Block>

              <Block style={{ paadingHorizontal: "4%", marginTop: "25%" }}>
                <MultiSelect
                  canAddItems={true}
                  onAddItem={(item) => {
                    selectProffession(item)
                  }}
                  hideTags={true}
                  items={List.Proffession}
                  styleItemsContainer={{ maxHeight: Utils.height / 4, borderWidth: 2, borderColor: Theme.COLORS.MUTED, borderRadius: 8, marginVertical: "4%" }}
                  uniqueKey='name'
                  fontFamily={Theme.FONTFAMILY.REGULAR}
                  tagBorderColor={Theme.COLORS.MUTED}
                  itemFontSize={14}
                  itemFontFamily={Theme.FONTFAMILY.MEDIUM}
                  selectedItemFontFamily={Theme.FONTFAMILY.BOLD}
                  onSelectedItemsChange={selectProffession}
                  selectedItems={profileData.proffession}
                  selectText="Proffession"
                  searchInputPlaceholderText="Search Proffession..."
                  altFontFamily={Theme.FONTFAMILY.MEDIUM}
                  tagRemoveIconColor={Theme.COLORS.ERROR}
                  tagTextColor={Theme.COLORS.MUTED}
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC', fontFamily: Theme.FONTFAMILY.MEDIUM }}
                  styleTextDropdownSelected={{ fontFamily: Theme.FONTFAMILY.MEDIUM, fontSize: 14, paddingHorizontal: "4%" }}
                  styleTextDropdown={{ fontFamily: Theme.FONTFAMILY.MEDIUM, fontSize: 14, paddingHorizontal: "4%" }}
                  styleDropdownMenuSubsection={{ borderWidth: 1, padding: "8%", borderRadius: 8, height: 48 }}
                  submitButtonColor={Theme.COLORS.THEME}
                  submitButtonText="Submit"
                />
                <Block>
                  {_.map(_.chunk(profileData?.proffession, 2), (element: string, index: number) => (
                    <Block row style={{ maxWidth: Utils.width / 1.3, flexWrap: 'wrap' }}>
                      {_.map(element, (item: string, i: number) => (
                        <Block style={[styles.selectedItem, { padding: "4%" }]} row>
                          <Text style={[styles.text, {
                            color: Theme.COLORS.MUTED, fontFamily: Theme.FONTFAMILY.REGULAR,
                            fontSize: 14, padding: 2
                          }]}>{item}</Text>
                          <TouchableRipple onPress={() => {
                            const newItems = reject(profileData?.proffession,
                              singleItem => singleItem === item);

                            setProfileData((prev) => {
                              return { ...prev, proffession: newItems }
                            })
                          }}>
                            <AppIcon size={20} source={'close-circle'} color={Theme.COLORS.ERROR} />
                          </TouchableRipple>
                        </Block>

                      ))}
                    </Block>
                  ))}
                </Block>
              </Block>

            </Block>
            <Block style={[styles.block, { paddingBottom: "4%" }]}>
              <Block center style={{ borderRadius: 24, backgroundColor: "#EAEAEA", marginVertical: "5%", width: "50%" }}>
                <Text style={[styles.text, {
                  color: Theme.COLORS.THEME,
                  padding: "4%"
                }]}>WORKING DAYS</Text>
              </Block>
              {_.map(_.chunk(daySelected, 4), (element: typeof Dates, index: number) => (
                <Block row space='evenly' key={index} style={{ padding: "2%" }}>
                  {_.map(element, (item: typeof Dates[number], i: number) => (
                    <TouchableRipple key={i}
                      style={{
                        backgroundColor: item.selected ? Theme.COLORS.THEME : "#EAEAEA",
                        borderRadius: 24,
                        paddingHorizontal: "4%",
                        paddingVertical: "1%",
                      }}
                      onPress={() => {
                        setDaySelected((prev) => {
                          const previousData = [...prev];
                          previousData[index > 0 ? i + 4 : i].selected = !previousData[index > 0 ? i + 4 : i].selected
                          return previousData;
                        })
                      }}>
                      <Block key={index}>
                        <Text style={[styles.text, { color: item.selected ? Theme.COLORS.WHITE : "#898989" }]}>{item.name}</Text>
                      </Block>
                    </TouchableRipple>
                  ))}
                </Block>
              ))}
            </Block>

            <Block style={styles.block}>
              <Block center style={{ borderRadius: 24, backgroundColor: "#EAEAEA", marginTop: "5%", width: "50%" }}>
                <Text style={[styles.text, {
                  color: Theme.COLORS.THEME,
                  padding: "4%"
                }]}>SHIFT HOURS</Text>
              </Block>
              <Block row space='between' style={{ paddingHorizontal: '4%', paddingVertical: "4%" }}>

                <Block middle>
                  <Text style={[styles.text, { color: Theme.COLORS.THEME, fontSize: 14 }]}>
                    Starting
                  </Text>
                  <TouchableRipple onPress={() => { setOpen(!open) }}>
                    <Block row space='between' middle>
                      <Text style={[styles.text, { fontSize: 10 }]}>{timeParser(profileData?.working_time_start)}</Text>
                      <Block>
                        <AppIcon size={15} source={"menu-up"} />
                        <AppIcon size={15} source={"menu-down"} />
                      </Block>

                    </Block>
                  </TouchableRipple>

                </Block>

                <Block middle>
                  <Text style={[styles.text, { color: Theme.COLORS.THEME, fontSize: 14 }]}>
                    End
                  </Text>
                  <TouchableRipple onPress={() => { setOpenEnd(!openEnd) }}>
                    <Block row space='between' middle>
                      <Text style={[styles.text, { fontSize: 10 }]}>{timeParser(profileData?.working_time_end)}</Text>
                      <Block>
                        <AppIcon size={15} source={"menu-up"} />
                        <AppIcon size={15} source={"menu-down"} />
                      </Block>

                    </Block>
                  </TouchableRipple>


                </Block>

              </Block>
            </Block>

            <Block style={[styles.block, { paddingVertical: "6%", paddingHorizontal: "4%" }]}>
              <MultiSelect
                hideTags={true}
                canAddItems={true}
                onAddItem={(item) => {
                  selecteInterest(item)
                }}
                items={List.Interest}
                styleItemsContainer={{ maxHeight: Utils.height / 4, borderWidth: 2, borderColor: Theme.COLORS.MUTED, borderRadius: 8, marginVertical: "4%" }}
                uniqueKey='name'
                fontFamily={Theme.FONTFAMILY.REGULAR}
                itemFontSize={14}
                tagBorderColor={Theme.COLORS.MUTED}
                itemFontFamily={Theme.FONTFAMILY.MEDIUM}
                selectedItemFontFamily={Theme.FONTFAMILY.BOLD}
                onSelectedItemsChange={selecteInterest}
                selectedItems={profileData?.interest}
                selectText="Interest"
                searchInputPlaceholderText="Search Interest..."
                altFontFamily={Theme.FONTFAMILY.MEDIUM}
                tagRemoveIconColor={Theme.COLORS.ERROR}
                tagTextColor={Theme.COLORS.MUTED}
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC', fontFamily: Theme.FONTFAMILY.MEDIUM }}
                styleTextDropdownSelected={{ fontFamily: Theme.FONTFAMILY.MEDIUM, fontSize: 14, paddingHorizontal: "4%" }}
                styleTextDropdown={{ fontFamily: Theme.FONTFAMILY.MEDIUM, fontSize: 14, paddingHorizontal: "4%" }}
                styleDropdownMenuSubsection={{ borderWidth: 1, padding: "8%", borderRadius: 8, height: 48 }}
                submitButtonColor={Theme.COLORS.THEME}
                submitButtonText="Submit"
              />
              <Block>
                {_.map(_.chunk(profileData?.interest, 3), (element: string, index: number) => (
                  <Block row style={{ maxWidth: Utils.width / 1.3, flexWrap: 'wrap' }}>
                    {_.map(element, (item: string, i: number) => (
                      <Block style={[styles.selectedItem, { padding: "4%" }]} row>
                        <Text style={[styles.text, {
                          color: Theme.COLORS.MUTED, fontFamily: Theme.FONTFAMILY.REGULAR,
                          fontSize: 14, padding: 2
                        }]}>{item}</Text>
                        <TouchableRipple onPress={() => {
                          const newItems = reject(profileData?.interest, singleItem => singleItem === item);

                          setProfileData((prev) => {
                            return { ...prev, interest: newItems }
                          })
                        }}>
                          <AppIcon size={20} source={'close-circle'} color={Theme.COLORS.ERROR} />
                        </TouchableRipple>
                      </Block>

                    ))}
                  </Block>
                ))}
              </Block>
            </Block>

            <Block style={styles.block}>
              <Block center style={{ borderRadius: 24, backgroundColor: "#EAEAEA", marginVertical: "5%", width: "50%" }}>
                <Text style={[styles.text, {
                  color: Theme.COLORS.THEME,
                  padding: "4%"
                }]}>ABOUT</Text>
              </Block>
              <Block style={{ paddingHorizontal: "6%", paddingBottom: "4%" }}>
                <AppInput placeholder='Description About Yourself (100 words)'
                  onChangeText={(text) => {
                    setProfileData((prev) => ({ ...prev, about: text }))
                  }} textInputStyle={{ fontSize: 12 }} editable
                  style={{ height: Utils.height / 4.5, borderWidth: 2 }} multiline
                  value={profileData?.about}
                  numberOfLines={4} />
              </Block>
            </Block>

            <Block middle>
              <Button color={Theme.COLORS.THEME} round style={{ width: "100%", marginVertical: "5%" }} onPress={submit}>
                <Text style={[styles.text, { ...Utils.textWhite, fontSize: 14 }]}>SUBMIT</Text>
              </Button>
            </Block>
          </View>


        </View >
      </ScrollView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "6%",
  },
  header: {
    marginVertical: "8%"
  },
  body: {

  },
  footer: {

  },
  text: {
    ...Utils.text
  },
  block: {
    backgroundColor: Theme.COLORS.WHITE,
    borderRadius: 4,
    elevation: 4,
    marginVertical: "4%",
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Theme.COLORS.MUTED
  }

})

const mapStateToProps = (state: userState) => {
  return getUserState;
}

const mapDispatchToProps = {
  setUser: loginAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);