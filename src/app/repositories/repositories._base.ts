export class BaseRepository {
    constructor() {

    }
    public baseUrl: string = "http://localhost:8709/";

    public getToken(): string {
        let token: string = localStorage.getItem("token");

        if (token == null) {
            token = "";
        }

        return token;
    }
}