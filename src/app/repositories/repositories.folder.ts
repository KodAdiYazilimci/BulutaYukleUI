import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, from, last, lastValueFrom } from "rxjs";

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

        let getResult: Observable<ServiceResultData<ContentModel>> = await this._http.get<ServiceResultData<ContentModel>>(
            this.baseUrl + "File/GetContentsByFolder", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<ContentModel> = await lastValueFrom(getResult);

        return result;
    }

    public async createFolderOnDisk(diskId: number, name: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateFolder", {
            "diskId": diskId,
            "name": name
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async createFolderOnFolder(folderId: number, name: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateFolder", {
            "topFolderId": folderId,
            "name": name
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFolderProperties(folderId: number): Promise<ServiceResultData<PropertyModel>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        let getResult: Observable<ServiceResultData<PropertyModel>> = await this._http.get<ServiceResultData<PropertyModel>>(
            this.baseUrl + "File/GetFolderProperty", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<PropertyModel> = await lastValueFrom(getResult);

        return result;
    }

    public async renameFolder(folderId: number, name: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/RenameFolder", {
            "id": folderId,
            "name": name
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFolderComments(folderId: number): Promise<ServiceResultData<Array<CommentItemModel>>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        let getResult: Observable<ServiceResultData<Array<CommentItemModel>>> = await this._http.get<ServiceResultData<Array<CommentItemModel>>>(
            this.baseUrl + "File/GetFolderComments", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<Array<CommentItemModel>> = await lastValueFrom(getResult);

        return result;
    }

    public async createFolderComment(folderId: number, text: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateComment", {
            "folderId": folderId,
            "text": text
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFolderHistories(folderId: number): Promise<ServiceResultData<Array<HistoryItemModel>>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        let getResult: Observable<ServiceResultData<Array<HistoryItemModel>>> = await this._http.get<ServiceResultData<Array<HistoryItemModel>>>(
            this.baseUrl + "History/GetFolderHistory", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<Array<HistoryItemModel>> = await lastValueFrom(getResult);

        return result;
    }

    public async hideFolder(folderId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/HideFolder", {
            "id": folderId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async showFolder(folderId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/ShowFolder", {
            "id": folderId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFolderPermissions(folderId: number): Promise<ServiceResultData<PermissionModel>> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        let getResult: Observable<ServiceResultData<PermissionModel>> = await this._http.get<ServiceResultData<PermissionModel>>(
            this.baseUrl + "Permission/GetFolderPermissions", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<PermissionModel> = await lastValueFrom(getResult);

        return result;
    }

    public async removeFolderPermissionForUser(folderId: number, userId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "folderId": folderId.toString(),
            "userId": userId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async removeFolderPermissionForGroup(folderId: number, groupId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "folderId": folderId.toString(),
            "groupId": groupId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async appendFolderPermissionForGroup(folderId: number, groupId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "folderId": folderId,
            "groupId": groupId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async appendFolderPermissionForUser(folderId: number, userId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "folderId": folderId,
            "userId": userId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async lockFolder(folderId: number, password: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/LockFolder", {
            "id": folderId,
            "password": password
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async unLockFolder(folderId: number, password: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/UnLockFolder", {
            "id": folderId,
            "password": password
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async deleteFolder(folderId: number): Promise<ServiceResult> {
        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        let getResult: Observable<ServiceResult> = await this._http.get<ServiceResult>(
            this.baseUrl + "File/DeleteFolder", { params: params, headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(getResult);

        return result;
    }
}