import { HttpHeaders } from '@angular/common/http';

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

    public getDefaultHeaders(): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        return headers;
    }
}