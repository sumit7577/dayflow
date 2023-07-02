import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block, Button } from 'galio-framework'
import { Pictures, Theme, Utils } from '../../constants'
import { TouchableRipple } from 'react-native-paper'
import _ from 'lodash';
import MultiSelect from 'react-native-multiple-select'
import { SignupPost } from '../../networking/authTypes'
import { AppDialogue, AppIcon, AppInput, AppLoader } from '../../components'
import DatePicker from 'react-native-date-picker'
import { List } from '../../constants'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { ApiController } from '../../networking'
import { getUserState, userState } from '../../context/user/reducer'
import { HomeStackProps } from '../../navigators/homestack'
import { loginResp, profileResp } from '../../networking/resp-type'
import { loginAction } from '../../context/user/action'
import { connect } from 'react-redux'
import { timeCreater } from '../../networking/controller'


const Dates = [
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

function Profile(props: ProfileProps) {
  const { userData, navigation, setUser } = props;

  const [daySelected, setDaySelected] = React.useState<typeof Dates>(Dates);
  const [profileData, setProfileData] = React.useState<Partial<loginResp>>({ working_time_start: new Date().toISOString(), working_time_end: new Date().toISOString() });

  const selectProffession = (items: Array<string>) => {
    setProfileData(({ proffession: { "proffession": items } }))
  }
  const selecteInterest = (items: Array<string>) => {
    setProfileData(({ interest: { "interest": items } }))
  }
  const [open, setOpen] = React.useState(false)
  const [openEnd, setOpenEnd] = React.useState(false)

  const patchProfile = useMutation({
    mutationKey: ["patchProfile"],
    mutationFn: () => {
      return ApiController.pathchProfile(profileData, userData?.id)
    },
    onSuccess: (data) => {
      console.log(data)
    }
  })

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: ApiController.profile,
    onSuccess: (data) => {
      const response = { ...data[0] };
      delete response.id;
      delete response.user;
      if (response.working_time_start) {
        response.working_time_start = timeCreater(response.working_time_start).toISOString()
      }
      if(response.working_time_end){
        response.working_time_end = timeCreater(response.working_time_end).toISOString()
      }
      setProfileData(response)
    }
  })

  const submit = () => {
    patchProfile.mutate()
  }
  return (
    <SafeAreaView>
      <AppDialogue show={patchProfile.isError} error={patchProfile.error} />
      <AppLoader show={patchProfile.isLoading || isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={styles.container}>
          <DatePicker
            modal
            open={open}
            date={profileData?.working_time_start ? new Date(profileData.working_time_start) : new Date()}
            onConfirm={(date) => {
              setProfileData(({ working_time_start: date.toISOString() }))
            }}
            onCancel={() => {
              setOpen(!open)
            }}
          />
          <DatePicker
            modal
            open={openEnd}
            date={profileData?.working_time_end ? new Date(profileData.working_time_end) : new Date()}
            onConfirm={(date) => {
              setProfileData(({ working_time_end: date.toISOString() }))
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

            <Block style={[styles.block, { paddingVertical: "6%", paddingHorizontal: "4%" }]}>
              <Block center style={{
                borderWidth: 2, borderColor: Theme.COLORS.THEME,
                zIndex: 5,
                height: Utils.height / 8, width: Utils.width / 4, borderRadius: 50,
              }}>
                <Image source={Pictures.authPictures.logo} style={{ height: Utils.height / 8, resizeMode: "contain", width: Utils.width / 4 }} />
              </Block>
              <Block style={{ paadingHorizontal: "4%", marginTop: "2%" }}>
                <MultiSelect
                  hideTags={false}
                  items={List.Proffession}
                  styleItemsContainer={{ maxHeight: Utils.height / 3 }}
                  uniqueKey='name'
                  onSelectedItemsChange={selectProffession}
                  selectedItems={profileData?.proffession?.proffession}
                  selectText="Proffession"
                  searchInputPlaceholderText="Search Items..."
                  altFontFamily={Theme.FONTFAMILY.MEDIUM}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor={Theme.COLORS.THEME}
                  submitButtonText="Submit"
                />
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
                          previousData[i].selected = !previousData[i].selected
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
                      <Text style={[styles.text, { fontSize: 10 }]}>{new Date(profileData.working_time_start).toLocaleTimeString()}</Text>
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
                      <Text style={[styles.text, { fontSize: 10 }]}>{new Date(profileData.working_time_end).toLocaleTimeString()}</Text>
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
                hideTags={false}
                items={List.Interest}
                uniqueKey="name"
                styleItemsContainer={{ maxHeight: Utils.height / 3 }}
                onSelectedItemsChange={selecteInterest}
                selectedItems={profileData?.interest?.interest}
                selectText="Interest"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={(text) => console.log(text)}
                altFontFamily={Theme.FONTFAMILY.MEDIUM}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor={Theme.COLORS.THEME}
                submitButtonText="Submit"
              />
            </Block>

            <Block style={styles.block}>
              <Block center style={{ borderRadius: 24, backgroundColor: "#EAEAEA", marginVertical: "5%", width: "50%" }}>
                <Text style={[styles.text, {
                  color: Theme.COLORS.THEME,
                  padding: "4%"
                }]}>ABOUT</Text>
              </Block>
              <Block style={{ paddingHorizontal: "6%", paddingBottom: "4%" }}>
                <AppInput inpu placeholder='Description About Yourself (100 words)' textInputStyle={{ fontSize: 12 }} editable
                  style={{ height: Utils.height / 4.5, borderWidth: 2 }} multiline
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
  }
})

const mapStateToProps = (state: userState) => {
  return getUserState;
}

const mapDispatchToProps = {
  setUser: loginAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);