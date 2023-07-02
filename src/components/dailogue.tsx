import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { Theme } from '../constants';

interface DialogueProps {
    show: boolean,
    error: { name: string, message: string },
    action?: boolean,
    confirmPress?: () => void;
    icon?: string,
    onSuccess?: () => void,
}
const Dialogue: React.FC<DialogueProps> = (prop: DialogueProps) => {
    const [show, setShow] = React.useState<boolean>(false);
    React.useEffect(() => {
        setShow(() => prop.show);
    }, [prop.show]);
    const { error, action, confirmPress, icon, onSuccess } = prop;
    const dismiss = () => {
        setShow(() => false);
        onSuccess && onSuccess()
    }
    return (
        <Portal>
            <Dialog visible={show} dismissable={true} onDismiss={dismiss}>
                <Dialog.Icon icon={icon ? icon : "alert-box-outline"} size={35} color={Theme.COLORS.BLACK} />
                <Dialog.Title style={[styles.text, { textAlign: "center", fontSize: 16 }]}>{error?.name}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={[styles.text, { textAlign: "center" }]}>{error?.message}</Paragraph>
                </Dialog.Content>
                {action && <Dialog.Actions>
                    <Button onPress={() => { setShow(() => false) }}>Cancel</Button>
                    <Button onPress={() => confirmPress && confirmPress}>Confirm</Button>
                </Dialog.Actions>}

            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: Theme.FONTFAMILY.BOLD,
        fontSize: 14,
        color: Theme.COLORS.BLACK
    }
})

export default Dialogue;