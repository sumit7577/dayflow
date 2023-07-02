import { loginResp } from "../../networking/resp-type";
import { userActionKind } from "./reducer";


function loginAction(value: loginResp) {
    return ({ type: userActionKind.LOGIN, data: value });
}

function logoutAction() {
    return ({ type: userActionKind.LOGOUT });
}


export { loginAction, logoutAction }