import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { from, lastValueFrom, Observable } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";

import { BaseRepository } from "../repositories/repositories._base";
import { ContentModel } from '../models/model.content';
import { GridItemModel } from '../models/model.gridItem';
import { ItemTypes } from '../util/util.itemtypes';

@Injectable()
export class ContentRepository extends BaseRepository implements OnInit {
    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public async shareItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<ServiceResultData<string>> {
        let postResult: Observable<ServiceResultData<string>> = await this._http.post<ServiceResultData<string>>(
            this.baseUrl + "ShareItems", {
            "folders": folders,
            "files": files
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResultData<string> = await lastValueFrom(postResult);

        return result;
    }

    public async unShareItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "UnShareItems", {
            "folders": folders,
            "files": files
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async downloadItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<Blob> {
        let postResult: Observable<Blob> = await this._http.post(
            this.baseUrl + "File/DownloadItems", {
            "folders": folders,
            "files": files
        }, { headers: this.getDefaultHeaders(), responseType: "blob" });

        let result: Blob = await lastValueFrom(postResult);

        return result;
    }

    public async moveItemsToDisk(folders: Array<GridItemModel>, files: Array<GridItemModel>, diskId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/MoveItems", {
            "folders": folders,
            "files": files,
            "type": ItemTypes.disk(),
            "targetId": diskId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async moveItemsToFolder(folders: Array<GridItemModel>, files: Array<GridItemModel>, folderId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/MoveItems", {
            "folders": folders,
            "files": files,
            "type": ItemTypes.folder(),
            "targetId": folderId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async copyItemsToDisk(folders: Array<GridItemModel>, files: Array<GridItemModel>, diskId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/CopyItems", {
            "folders": folders,
            "files": files,
            "type": ItemTypes.disk(),
            "targetId": diskId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }

    public async copyItemsToFolder(folders: Array<GridItemModel>, files: Array<GridItemModel>, folderId: number): Promise<ServiceResult> {
        let postResult: Observable<ServiceResult> = await this._http.post<ServiceResult>(
            this.baseUrl + "File/CopyItems", {
            "folders": folders,
            "files": files,
            "type": ItemTypes.folder(),
            "targetId": folderId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResult = await lastValueFrom(postResult);

        return result;
    }
}