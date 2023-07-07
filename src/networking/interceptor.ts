import Axios from "axios";
import { Database } from "../constants";
import { AuthenticationError, ServerError, NetworkError, ClientError } from './error-type';

const shopName = "https://dayflow.pythonanywhere.com/";



const client = Axios.create({
    headers: {
        "Content-Type": "application/json",
    }
});

client.interceptors.request.use(async (request: any) => {
    //console.log("request", request);
    const database = Database.getString("user.token");
    if (database) {
        request.headers['Authorization'] = `Token ${database}`;
    }
    return request;
});

client.interceptors.response.use(
    (response) => {
        //console.log("response",response.data);
        return response;
    },
    (error) => {
        //console.log("resp", error.response.data);
        //console.log("error", error)
        if (error.message === "Network Error") {
            return Promise.reject(new NetworkError('Please Turn On Your Mobile Data'));
        } else if (error.response.status >= 500) {
            return Promise.reject(
                new ServerError(error.response.data.error, error.response.status)
            );
        } else if (error.response.status === 401) {
            (() => {
                Database.delete("user.token")
                Database.delete("user")
            })()
            return Promise.reject(new AuthenticationError("The Phone number that you've entered is incorrect."));
        } else if (error.response.status >= 400 && error.response.status < 500) {
            return Promise.reject(
                new ClientError(
                    Object.entries(error.response.data.user ? error.response.data.user : error.response.data).join(" ").replace(",", " "),
                    error.response.status
                )
            );
        }
        return Promise.reject({ ...error });
    }
);



export { client, shopName };