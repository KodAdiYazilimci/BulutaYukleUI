import { Injectable, OnInit, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";
import { Observable, from, lastValueFrom } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";
import { FileUploadModel } from "../models/model.fileupload";

import { BaseRepository } from "../repositories/repositories._base";
import { map } from 'rxjs/operators';
import { GridItemModel } from '../models/model.gridItem';
import { PropertyModel } from "../models/model.property";
import { CommentItemModel } from '../models/model.commentitem';
import { HistoryItemModel } from '../models/model.historyitem';
import { PermissionModel } from '../models/model.permission';
import { PermissionTypeModel } from '../models/model.permissiontype';

@Injectable()
export class FileRepository extends BaseRepository implements OnInit {

    public onUploadingEventHandler: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();

    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public uploadFileToDisk(diskId: number, files: any) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        let formData: FormData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("diskId", diskId.toString());

        this._http.post(this.baseUrl + "File/UploadFile", formData, { headers: headers, reportProgress: true, observe: "events" })
            .subscribe(resp => {
                let uploadModel: FileUploadModel = new FileUploadModel();
                if (resp.type == HttpEventType.Response) {
                    uploadModel.complete = true;
                    uploadModel.percentage = 100;
                    uploadModel.status = resp.status;
                    uploadModel.body = resp.body;
                }
                if (resp.type == HttpEventType.UploadProgress) {
                    uploadModel.percentage = Math.round(100 * resp.loaded / resp.total);
                    uploadModel.complete = false;
                }
                this.onUploadingEventHandler.emit(uploadModel);
            }, errorObj => {
                let uploadModel: FileUploadModel = new FileUploadModel();
                uploadModel.complete = true;
                uploadModel.status = errorObj.status;
                uploadModel.error = (errorObj.error as ServiceResult).errorMessage;
                uploadModel.percentage = 100;
                this.onUploadingEventHandler.emit(uploadModel);
            });
    }

    public uploadFileToFolder(folderId: number, files: any) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        let formData: FormData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("folderId", folderId.toString());

        this._http.post(this.baseUrl + "File/UploadFile", formData, { headers: headers, reportProgress: true, observe: "events" })
            .subscribe(resp => {
                let uploadModel: FileUploadModel = new FileUploadModel();
                if (resp.type == HttpEventType.Response) {
                    uploadModel.complete = true;
                    uploadModel.percentage = 100;
                    uploadModel.status = resp.status;
                    uploadModel.body = resp.body;
                }
                if (resp.type == HttpEventType.UploadProgress) {
                    uploadModel.percentage = Math.round(100 * resp.loaded / resp.total);
                    uploadModel.complete = false;
                }
                this.onUploadingEventHandler.emit(uploadModel);
            }, errorObj => {
                let uploadModel: FileUploadModel = new FileUploadModel();
                uploadModel.complete = true;
                uploadModel.status = errorObj.status;
                uploadModel.error = (errorObj.error as ServiceResult).errorMessage;
                uploadModel.percentage = 100;
                this.onUploadingEventHandler.emit(uploadModel);
            });
    }

    public async getFileProperties(fileId: number): Promise<ServiceResultData<PropertyModel>> {
        let params = new HttpParams();
        params = params.append("fileId", fileId.toString());

        let getResult: Observable<ServiceResultData<PropertyModel>> = await this._http.get<ServiceResultData<PropertyModel>>(
            this.baseUrl + "File/GetFileProperty", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<PropertyModel> = await lastValueFrom(getResult);

        return result;
    }

    public async renameFile(fileId: number, name: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/RenameFile", {
            "id": fileId,
            "name": name
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFileComments(fileId: number): Promise<ServiceResultData<Array<CommentItemModel>>> {
        let params = new HttpParams();
        params = params.append("fileId", fileId.toString());

        let getResult: Observable<ServiceResultData<Array<CommentItemModel>>> = await this._http.get<ServiceResultData<Array<CommentItemModel>>>(
            this.baseUrl + "File/GetFileComments", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<Array<CommentItemModel>> = await lastValueFrom(getResult);

        return result;
    }

    public async createFileComment(fileId: number, text: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateComment", {
            "fileId": fileId,
            "text": text
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFileHistories(fileId: number): Promise<ServiceResultData<Array<HistoryItemModel>>> {
        let params = new HttpParams();
        params = params.append("fileId", fileId.toString());

        let getResult: Observable<ServiceResultData<Array<HistoryItemModel>>> = await this._http.get<ServiceResultData<Array<HistoryItemModel>>>(
            this.baseUrl + "History/GetFileHistory", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<Array<HistoryItemModel>> = await lastValueFrom(getResult);

        return result;
    }

    public async hideFile(fileId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/HideFile", {
            "id": fileId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async showFile(fileId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/ShowFile", {
            "id": fileId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async getFilePermissions(fileId: number): Promise<ServiceResultData<PermissionModel>> {
        let params = new HttpParams();
        params = params.append("fileId", fileId.toString());

        let getResult: Observable<ServiceResultData<PermissionModel>> = await this._http.get<ServiceResultData<PermissionModel>>(
            this.baseUrl + "Permission/GetFilePermissions", { headers: this.getDefaultHeaders(), params: params });

        let result: ServiceResultData<PermissionModel> = await lastValueFrom(getResult);

        return result;
    }

    public async removeFilePermissionForUser(fileId: number, userId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "fileId": fileId.toString(),
            "userId": userId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async removeFilePermissionForGroup(fileId: number, groupId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/RemovePermission", {
            "fileId": fileId.toString(),
            "groupId": groupId.toString()
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async appendFilePermissionForGroup(fileId: number, groupId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "fileId": fileId,
            "groupId": groupId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async appendFilePermissionForUser(fileId: number, userId: number, permissions: Array<PermissionTypeModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "Permission/AppendPermission", {
            "fileId": fileId,
            "userId": userId,
            "permissionTypes": permissions
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async lockFile(fileId: number, password: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/LockFile", {
            "id": fileId,
            "password": password
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async unLockFile(fileId: number, password: string): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/UnLockFile", {
            "id": fileId,
            "password": password
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async deleteFile(fileId: number): Promise<ServiceResult> {
        let params = new HttpParams();
        params = params.append("fileId", fileId.toString());

        let getResult: Observable<ServiceResult> = await this._http.get<ServiceResult>(
            this.baseUrl + "File/DeleteFile", { params: params, headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(getResult);

        return result;
    }
}