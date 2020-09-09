import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { from, Observable } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";

import { BaseRepository } from "../repositories/repositories._base";
import { ContentModel } from '../models/model.content';
import { GridItemModel } from '../models/model.gridItem';

@Injectable()
export class ContentRepository extends BaseRepository implements OnInit {
    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void { }

    public async shareItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<ServiceResultData<string>> {
        return await this._http.post<ServiceResultData<string>>(
            this.baseUrl + "ShareItems", {
            "folders": folders,
            "files": files
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async unShareItems(folders: Array<GridItemModel>, files: Array<GridItemModel>) {
        return await this._http.post<ServiceResult>(
            this.baseUrl + "UnShareItems", {
            "folders": folders,
            "files": files
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async downloadItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<Blob> {
        return await this._http.post(
            this.baseUrl + "File/DownloadItems", {
            "folders": folders,
            "files": files
        }, { headers: this.getDefaultHeaders(), responseType: "blob" }).toPromise();
    }
}