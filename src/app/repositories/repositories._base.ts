export class BaseRepository {
    constructor() {

    }
    public baseUrl: string = "http://localhost:8709/";

    public getToken(): string {
        return localStorage.getItem("token");
    }
}