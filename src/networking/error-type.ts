export class NetworkError extends Error {}
export class AuthenticationError extends Error {}
export class ClientError extends Error {
    statusCode: number;
    constructor(message:string, statusCode:number) {
        super(message);
        this.statusCode = statusCode;
    }
}
export class ServerError extends Error {
    statusCode: number;
    constructor(message: string | undefined, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}