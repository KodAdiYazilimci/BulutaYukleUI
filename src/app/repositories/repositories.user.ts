import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, from, lastValueFrom } from "rxjs";
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
        let getResult: Observable<ServiceResultData<Array<UserGroupModel>>> = await this._http.get<ServiceResultData<Array<UserGroupModel>>>(
            this.baseUrl + "User/GetGroups", { headers: this.getDefaultHeaders() });

        let result: ServiceResultData<Array<UserGroupModel>> = await lastValueFrom(getResult);

        return result;
    }

    public async getUsers(): Promise<ServiceResultData<Array<UserModel>>> {
        let getResult: Observable<ServiceResultData<Array<UserModel>>> = await this._http.get<ServiceResultData<Array<UserModel>>>(
            this.baseUrl + "User/GetUsers", { headers: this.getDefaultHeaders() });

        let result: ServiceResultData<Array<UserModel>> = await lastValueFrom(getResult);

        return result;
    }
}