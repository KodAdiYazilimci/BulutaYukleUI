import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";

import { BaseRepository } from "../repositories/repositories._base";
import { DiskModel } from '../models/model.disk';
import { ContentModel } from '../models/model.content';
import { PermissionModel } from '../models/model.permission';
import { PermissionTypeModel } from '../models/model.permissiontype';

@Injectable()
export class DiskRepository extends BaseRepository implements OnInit {
    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public async getDisks(): Promise<ServiceResultData<Array<DiskModel>>> {

        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        let result = await this._http.get<ServiceResultData<Array<DiskModel>>>(
            this.baseUrl + "File/GetDisks", { headers: headers }
        ).toPromise();

        return result;
    }

    public async getDiskContent(diskId: number): Promise<ServiceResultData<ContentModel>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        let params = new HttpParams();
        params = params.append("diskId", diskId.toString());

        return await this._http.get<ServiceResultData<ContentModel>>(
            this.baseUrl + "File/GetContentsByDisk", { headers: headers, params: params }).toPromise();
    }

    public async getDiskPermissions(diskId: number): Promise<ServiceResultData<PermissionModel>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        let params = new HttpParams();
        params = params.append("diskId", diskId.toString());

        return await this._http.get<ServiceResultData<PermissionModel>>(
            this.baseUrl + "Permission/GetDiskPermissions", { headers: headers, params: params }).toPromise();
    }

    public async removeDiskPermissionForUser(diskId: number, userId: number): Promise<ServiceResult> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "diskId": diskId.toString(),
            "userId": userId.toString()
        }, { headers: headers }).toPromise();
    }

    public async removeDiskPermissionForGroup(diskId: number, groupId: number): Promise<ServiceResult> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "diskId": diskId.toString(),
            "groupId": groupId.toString()
        }, { headers: headers }).toPromise();
    }

    public async appendDiskPermissionForGroup(diskId: number, groupId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "diskId": diskId,
            "groupId": groupId,
            "permissionTypes": permissions
        }, { headers: headers }).toPromise();
    }

    public async appendDiskPermissionForUser(diskId: number, userId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "diskId": diskId,
            "userId": userId,
            "permissionTypes": permissions
        }, { headers: headers }).toPromise();
    }
}