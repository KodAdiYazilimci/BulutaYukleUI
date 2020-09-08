import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";
import { BaseRepository } from "../repositories/repositories._base";
import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";
import { UserGroupModel } from '../models/model.usergroup';
import { UserModel } from '../models/model.user';

@Injectable()
export class UserRepository extends BaseRepository implements OnInit {

    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public async getGroups(): Promise<ServiceResultData<Array<UserGroupModel>>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.get<ServiceResultData<Array<UserGroupModel>>>(
            this.baseUrl + "User/GetGroups", { headers: headers }).toPromise();
    }

    public async getUsers(): Promise<ServiceResultData<Array<UserModel>>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.get<ServiceResultData<Array<UserModel>>>(
            this.baseUrl + "User/GetUsers", { headers: headers }).toPromise();
    }
}