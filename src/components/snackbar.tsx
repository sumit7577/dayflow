import { View, Text } from 'react-native'
import React from 'react'
import { Snackbar } from 'react-native-paper';
import { Theme, Utils } from '../constants';

interface snackbarProps {
    show: boolean,
    message: string
}

export default function Snackbars(prop: snackbarProps) {
    const { show, message } = prop;
    const [hide, setHide] = React.useState(show)
    React.useEffect(() => {
        const interval = setTimeout(() => {
            setHide(() => !hide)
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [show])
    return (
        <Snackbar duration={2000} visible={hide} style={{ zIndex: 20, backgroundColor: Theme.COLORS.ERROR }}
            onDismiss={() => { setHide(() => !hide) }}>
            <Text style={[{ ...Utils.text, ...Utils.textWhite, fontSize: 14 }]}>{message ?? "Oops! There is some error."}</Text>
        </Snackbar>
    )
}