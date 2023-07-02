import { SignupPost } from "./authTypes";
import { client, shopName } from "./interceptor";
import { loginResp } from "./resp-type";


export const timeParser = (date: string) => {
    const time = new Date(date).toTimeString().split(" ");
    return time[0]
}

export const timeCreater = (time: string):Date => {
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

const pathchProfile = async (input: Partial<loginResp>, id: number): Promise<loginResp> => {
    const formInput = { ...input };
    if (formInput.working_time_end) {
        formInput.working_time_end = timeParser(formInput.working_time_end)
    }
    if (formInput.working_time_start) {
        formInput.working_time_start = timeParser(formInput.working_time_start)
    }
    const response = await client.patch(`${shopName}profile/${id}/`, {
        ...formInput
    })
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

export default { signup, login, profile, pathchProfile };