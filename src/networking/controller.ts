import { AxiosRequestConfig } from "axios";
import { Dates } from "../screens/home/profile";
import { SignupPost } from "./authTypes";
import { client, shopName } from "./interceptor";
import { loginResp } from "./resp-type";
import { fromPairs, toString } from "lodash";


export const timeParser = (date: string) => {
    const time = new Date(date).toTimeString().split(" ");
    return time[0]
}

export const timeCreater = (time: string): Date => {
    var timeComponents = time.split(":");
    var hours = parseInt(timeComponents[0], 10);
    var minutes = parseInt(timeComponents[1], 10);
    var seconds = parseInt(timeComponents[2], 10);

    // Create a new Date object with the current date and the parsed time components
    var currentDate = new Date();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(seconds);

    return currentDate;
}

const signup = async (input: Partial<Omit<loginResp, "id">>): Promise<loginResp> => {
    const response = await client.post(`${shopName}signup/`, {
        ...input
    })
    const data = await response.data;
    return data;
}

const pathchProfile = async (input: Partial<loginResp>, id: number, working_days: typeof Dates): Promise<loginResp> => {
    const formInput = { ...input, working_days: working_days };
    const formData = new FormData();
    Object.keys(formInput).map((item: keyof loginResp) => {
        if (item === "profile_picture") return;
        if (item === "working_time_start") return;
        if (item === "working_time_end") return;
        if (item === "proffession") return;
        if(item ==="interest") return;
        if(item ==="working_days") return;
        else {
            formData.append(item, formInput[item])
        }
    });
    formData.append("proffession",JSON.stringify(formInput.proffession))
    formData.append("interest",JSON.stringify(formInput.interest))
    formData.append("working_days",JSON.stringify(formInput.working_days))
    if (formInput.working_time_end) {
        formData.append("working_time_end", timeParser(formInput.working_time_end))
    }
    if(formInput.proffession){
        
    }
    if (formInput.working_time_start) {
        formData.append("working_time_start", timeParser(formInput.working_time_start))
    }
    if (formInput.profile_picture && typeof formInput.profile_picture === "object") {
        formData.append('profile_picture', formInput.profile_picture);
    }
    const config: AxiosRequestConfig = {
        method: "patch",
        url: `${shopName}profile/${id}/`,
        responseType: "json",
        headers: {
            'Content-Type': 'multipart/form-data',
            // if backend supports u can use gzip request encoding
            // "Content-Encoding": "gzip",
        },
        transformRequest: (data, headers) => {
            // !!! override data to return formData
            // since axios converts that to string
            return formData;
        },
        data: formData,
    };
    // send post request and get response
    const response = await client.request(config);
    const data = await response.data;
    return data;
}

const login = async (input: { phone: string }): Promise<{ success: boolean, message: string }> => {
    const response = await client.post(`${shopName}login/`, {
        ...input
    });
    const data = await response.data;
    return data;
}

const profile = async (): Promise<Array<loginResp>> => {
    const response = await client.get(`${shopName}profile/`);
    const data = await response.data;
    return data;
}

const getSearch = async (input: string): Promise<{
    "count": 0,
    "next": null,
    "previous": null,
    "results": Array<loginResp>
}> => {
    const response = await client.get(`${shopName}search/${input}/`);
    const data = await response.data;
    return data;
}

const validate = async (phone: string, otp: string): Promise<{ success: boolean, message: string }> => {
    const response = await client.post(`${shopName}/validate/`, {
        phone: phone,
        otp: otp
    });
    const data = await response.data;
    return data;
}

export default { signup, login, profile, pathchProfile, getSearch, validate };