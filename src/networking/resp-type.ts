const userResp = {
    "id": 1,
    "user": {
        "email": null || "",
        "username": "admin"
    },
    "phone": "",
    "proffession": new Array<string>,
    'profile_picture': "string" || {
        uri: "",
        type: "", name: ""
    },
    "interest": new Array<string>,
    'working_days': new Array<{
        name: string;
        selected: boolean;
        num: number;
    }>,
    "working_time_start": "09:12:54",
    "working_time_end": "09:12:55",
    "about": ""
}

export type loginResp = typeof userResp;