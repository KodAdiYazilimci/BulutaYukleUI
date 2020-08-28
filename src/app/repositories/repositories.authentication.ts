import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";
import { TokenModel } from "../models/model.token";

@Injectable()
export class AuthenticationRepository implements OnInit {
    constructor(private _http: HttpClient) {
    }

    ngOnInit(): void { }

    public async getToken(email: string, password: string, region: string): Promise<ServiceResultData<TokenModel>> {
        return await this._http.post<ServiceResultData<TokenModel>>("http://localhost:22588/Auth/GetToken", {
            "email": email,
            "password": password,
            "region": "tr-TR",
            "ipAddress":"::1",
            "userAgent":"Mozilla"
        }).toPromise();
    }
}