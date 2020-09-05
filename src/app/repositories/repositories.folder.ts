import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";

import { BaseRepository } from "../repositories/repositories._base";
import { ContentModel } from '../models/model.content';
import { PropertyModel } from '../models/model.property';

@Injectable()
export class FolderRepository extends BaseRepository implements OnInit {
    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public async getFolderContent(folderId: number): Promise<ServiceResultData<ContentModel>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<ContentModel>>(
            this.baseUrl + "File/GetContentsByFolder", { headers: headers, params: params }).toPromise();
    }

    public async createFolderOnDisk(diskId: number, name: string): Promise<ServiceResult> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/CreateFolder", {
            "diskId": diskId,
            "name": name
        }, { headers: headers }).toPromise();
    }

    public async getFolderProperties(folderId: number): Promise<ServiceResultData<PropertyModel>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        let params = new HttpParams();
        params = params.append("folderId", folderId.toString());

        return await this._http.get<ServiceResultData<PropertyModel>>(
            this.baseUrl + "File/GetFolderProperty", { headers: headers, params: params }).toPromise();
    }

    public async renameFolder(folderId: number, name: string): Promise<ServiceResult> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Accept", "application/json");
        headers = headers.append("token", this.getToken());

        return await this._http.post<ServiceResult>(
            this.baseUrl + "File/RenameFolder", {
            "id": folderId,
            "name": name
        }, { headers: headers }).toPromise();
    }
}