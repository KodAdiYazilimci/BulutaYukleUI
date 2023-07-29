import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { TokenModel } from "../models/model.token";
import { ServiceResultData } from "../models/model.serviceresult";
import { Observable, lastValueFrom } from "rxjs";

@Injectable()
export class AuthenticationRepository implements OnInit {
    constructor(private _http: HttpClient) {
    }

    ngOnInit(): void { }

    public async getToken(email: string, password: string, region: string): Promise<ServiceResultData<TokenModel>> {
        let postResult: Observable<ServiceResultData<TokenModel>> = await this._http.post<ServiceResultData<TokenModel>>("http://localhost:22588/Auth/GetToken", {
            "email": email,
            "password": password,
            "region": "tr-TR",
            "ipAddress": "::1",
            "userAgent": "Mozilla"
        });

        let result: ServiceResultData<TokenModel> = await lastValueFrom(postResult);

        return result;
    }
}