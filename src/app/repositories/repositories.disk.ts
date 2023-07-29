import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, from, lastValueFrom } from "rxjs";

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
        let getResult: Observable<ServiceResultData<Array<DiskModel>>> = await this._http.get<ServiceResultData<Array<DiskModel>>>(
            this.baseUrl + "File/GetDisks", { headers: this.getDefaultHeaders() }
        );

        let result: ServiceResultData<Array<DiskModel>> = await lastValueFrom(getResult);

        return result;
    }

    public async getDiskContent(diskId: number): Promise<ServiceResultData<ContentModel>> {
        let params = new HttpParams();
        params = params.append("diskId", diskId.toString());

        let getResult: Observable<ServiceResultData<ContentModel>> = await this._http.get<ServiceResultData<ContentModel>>(
            this.baseUrl + "File/GetContentsByDisk", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<ContentModel> = await lastValueFrom(getResult);

        return result;
    }

    public async getDiskPermissions(diskId: number): Promise<ServiceResultData<PermissionModel>> {
        let params = new HttpParams();
        params = params.append("diskId", diskId.toString());

        let getResult: Observable<ServiceResultData<PermissionModel>> = await this._http.get<ServiceResultData<PermissionModel>>(
            this.baseUrl + "Permission/GetDiskPermissions", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<PermissionModel> = await lastValueFrom(getResult);

        return result;
    }

    public async removeDiskPermissionForUser(diskId: number, userId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "diskId": diskId.toString(),
            "userId": userId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async removeDiskPermissionForGroup(diskId: number, groupId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "diskId": diskId.toString(),
            "groupId": groupId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async appendDiskPermissionForGroup(diskId: number, groupId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "diskId": diskId,
            "groupId": groupId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async appendDiskPermissionForUser(diskId: number, userId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "diskId": diskId,
            "userId": userId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }
}