export class BaseRepository {
    constructor() {

    }
    public baseUrl: string = "http://localhost:8709/";

    public getToken(): string {
        return "3c9436d3-c3c5-490b-a4c3-e77976ea46b9";
    }
}