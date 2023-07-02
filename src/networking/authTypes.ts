const Signup = {
    "id": {
        "type": "integer",
        "required": false,
        "read_only": true,
        "label": "ID"
    },
    "email": {
        "type": "email",
        "required": false,
        "read_only": false,
        "label": "Email address",
        "max_length": 254
    },
    "username": {
        "type": "string",
        "required": true,
        "read_only": false,
        "label": "Username",
        "help_text": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        "max_length": 150
    },
    "phone": {
        "type": "integer",
        "required": true,
        "read_only": false,
        "label": "Phone"
    },
    "proffession": {
        "type": new Array<string>,
        "required": false,
        "read_only": false,
        "label": "Proffession"
    },
    "interest": {
        "type": new Array<string>,
        "required": false,
        "read_only": false,
        "label": "Interest"
    },
    "working_time_start": {
        "type": "time",
        "required": false,
        "read_only": false,
        "label": "Working time start"
    },
    "working_time_end": {
        "type": "time",
        "required": false,
        "read_only": false,
        "label": "Working time end"
    }
}

export type SignupTypes = typeof Signup;
export type SignupPost = {
    [key in keyof SignupTypes]: SignupTypes[key]['type']
}