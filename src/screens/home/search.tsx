import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { HomeStackProps } from '../../navigators/homestack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block } from 'galio-framework'
import { Pictures, Theme, Utils } from '../../constants'
import { useQuery } from '@tanstack/react-query'
import { ApiController } from '../../networking'
import { loginResp } from '../../networking/resp-type'
import { AppIcon, AppInput, AppLoader } from '../../components'
import { TouchableRipple } from 'react-native-paper'


type ItemProps = {
    item: loginResp;
    onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => (
    <TouchableRipple onPress={onPress}>
        <Block row style={{ paddingVertical: "4%", borderBottomWidth: 1, borderColor: Theme.COLORS.MUTED, borderRadius: 5 }}>
            <AppIcon source={item.profile_picture ?? Pictures.authPictures.logo} size={50} imageStyle={{ borderRadius: 50, resizeMode: "contain" }} />
            <Block style={{ paddingHorizontal: "4%" }}>
                <Text style={[styles.text, { ...Utils.textBold, fontSize: 14 }]}>{item?.user?.username.toUpperCase()}</Text>
                <Text style={[styles.text, { fontSize: 12 }]}>{item?.user?.email || +item.phone}</Text>
                <Text style={[styles.text, { fontSize: 12 }]}>{item?.proffession ? item.proffession[0] : "None"}</Text>
            </Block>

        </Block>
    </TouchableRipple>
);


type searchProps = HomeStackProps<"Search">
export default function Search(props: searchProps) {
    const { navigation, route } = props;
    const [searchInput, setSearchInput] = React.useState<string>(route.params.name);
    const [selectedId, setSelectedId] = React.useState<loginResp | null>(null);
    const { isLoading, data, refetch } = useQuery({
        queryKey: ['search'],
        queryFn: () => {
            return ApiController.getSearch(searchInput)
        },
        enabled: !!route.params.name
    })
    const renderItem = ({ item }: { item: loginResp }) => {

        return (
            <Item
                item={item}
                onPress={() => {
                    navigation.navigate("Main", {
                        user: item
                    })
                }}
            />

        );
    };
    return (
        <SafeAreaView>
            <AppLoader show={isLoading} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Block style={styles.block}>
                        <Text style={[styles.text, { color: Theme.COLORS.THEME, fontSize: 18 }]}>SEARCH {route.params.name.slice(0, 10)}</Text>
                    </Block>
                </View>
                <View style={styles.body}>
                    <Block middle>
                        <AppInput right icon='card-search-outline' placeholder='Search' onPress={refetch} style={{ width: Utils.width / 1.25 }} rounded
                            editable={true} value={searchInput} onChangeText={(text) => { setSearchInput(() => text) }} />
                    </Block>
                    <Block style={[styles.block, { paddingBottom: "10%" }]}>
                        <FlatList
                            data={data?.results}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                            extraData={selectedId}
                        />
                    </Block>

                </View>

            </View>
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
        paddingVertical: "4%",
        maxHeight: Utils.height / 2,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
})