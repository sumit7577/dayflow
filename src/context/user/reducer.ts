import { loginResp } from "../../networking/resp-type";


export enum userActionKind {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT"
}

interface userAction {
    type: userActionKind
    data: loginResp,
}

export type userState = {
    userData: null | loginResp,
    isLoggedIn: boolean,
}

export const initialState: userState = {
    userData: null,
    isLoggedIn: false,
}

export function getUserState(state: any) {
    return state.userReducer;
}


function userReducer(state = initialState, action: userAction) {
    switch (action.type) {
        case userActionKind.LOGIN:
            return {
                ...state,
                userData: action.data,
                isLoggedIn: action.data !== undefined,
            }
        case userActionKind.LOGOUT:
            return {
                initialState,
            }

        default:
            return {
                ...state
            }
    }

}

export default userReducer;