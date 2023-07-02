import * as React from 'react';
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';
interface LoaderProps{
    show:boolean,
}
function Loader(props:LoaderProps) {
    const {show} = props;
    return (
        <View >
            <Modal transparent={true} animationType={'none'} visible={show}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator color="#0000ff" size="large" animating={show} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Loader;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 45,
        width: 45,
        borderRadius: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})