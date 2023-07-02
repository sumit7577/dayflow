const userResp = {
    "id": 1,
    "user": {
        "email": null || "",
        "username": "admin"
    },
    "phone": "",
    "proffession": { proffession: new Array<string> },
    "interest": { interest: new Array<string> },
    "working_time_start": "09:12:54",
    "working_time_end": "09:12:55",
    "about": ""
}

export type loginResp = typeof userResp;