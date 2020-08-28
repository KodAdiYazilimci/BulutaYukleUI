export class BaseRepository {
    constructor() {

    }
    public baseUrl: string = "http://localhost:8709/";

    public getToken(): string {
        return "f9e56c9c-e06e-4915-bf05-37088e9ad829";
    }
}