import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";

import { BaseRepository } from "../repositories/repositories._base";
import { ContentModel } from '../models/model.content';
import { PropertyModel } from '../models/model.property';
import { CommentItemModel } from '../models/model.commentitem';
import { HistoryItemModel } from '../models/model.historyitem';
import { PermissionTypeModel } from '../models/model.permissiontype';
import { PermissionModel } from '../models/model.permission';

@Injectable()
export class FolderRepository extends BaseRepository implements OnInit {
    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public async getFolderContent(folderId: number): Promise<ServiceResultData<ContentModel>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<ContentModel>>(
            this.baseUrl + "File/GetContentsByFolder", { headers: this.getDefaultHeaders(), params: params }).toPromise();
    }

    public async createFolderOnDisk(diskId: number, name: string): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateFolder", {
            "diskId": diskId,
            "name": name
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async getFolderProperties(folderId: number): Promise<ServiceResultData<PropertyModel>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<PropertyModel>>(
            this.baseUrl + "File/GetFolderProperty", { headers: this.getDefaultHeaders(), params: params }).toPromise();
    }

    public async renameFolder(folderId: number, name: string): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/RenameFolder", {
            "id": folderId,
            "name": name
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async getFolderComments(folderId: number): Promise<ServiceResultData<Array<CommentItemModel>>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<Array<CommentItemModel>>>(
            this.baseUrl + "File/GetFolderComments", { headers: this.getDefaultHeaders(), params: params }).toPromise();
    }

    public async createFolderComment(folderId: number, text: string): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateComment", {
            "folderId": folderId,
            "text": text
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async getFolderHistories(folderId: number): Promise<ServiceResultData<Array<HistoryItemModel>>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<Array<HistoryItemModel>>>(
            this.baseUrl + "History/GetFolderHistory", { headers: this.getDefaultHeaders(), params: params }).toPromise();
    }

    public async hideFolder(folderId: number): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/HideFolder", {
            "id": folderId.toString()
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async showFolder(folderId: number): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/ShowFolder", {
            "id": folderId.toString()
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async getFolderPermissions(folderId: number): Promise<ServiceResultData<PermissionModel>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<PermissionModel>>(
            this.baseUrl + "Permission/GetFolderPermissions", { headers: this.getDefaultHeaders(), params: params }).toPromise();
    }

    public async removeFolderPermissionForUser(folderId: number, userId: number): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "folderId": folderId.toString(),
            "userId": userId.toString()
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async removeFolderPermissionForGroup(folderId: number, groupId: number): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "folderId": folderId.toString(),
            "groupId": groupId.toString()
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async appendFolderPermissionForGroup(folderId: number, groupId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "folderId": folderId,
            "groupId": groupId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async appendFolderPermissionForUser(folderId: number, userId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "folderId": folderId,
            "userId": userId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async lockFolder(folderId: number, password: string): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/LockFolder", {
            "id": folderId,
            "password": password
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async unLockFolder(folderId: number, password: string): Promise<ServiceResult> {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/UnLockFolder", {
            "id": folderId,
            "password": password
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }
}