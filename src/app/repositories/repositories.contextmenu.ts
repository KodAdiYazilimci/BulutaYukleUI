import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, from, lastValueFrom } from "rxjs";
import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";
import { BaseRepository } from "../repositories/repositories._base";
import { ContextMenuItemModel } from '../models/model.contextmenuitem';


@Injectable()
export class ContextMenuRepository extends BaseRepository implements OnInit {
    constructor(private _http: HttpClient) {
        super();
    }

    ngOnInit(): void {

    }

    public async getContextMenuOfDisk(diskId: number, inside: boolean): Promise<ServiceResultData<Array<ContextMenuItemModel>>> {
        let postResult: Observable<ServiceResultData<Array<ContextMenuItemModel>>> = await this._http.post<ServiceResultData<Array<ContextMenuItemModel>>>(
            this.baseUrl + "File/GetContextMenu", {
            "folderInside": inside,
            "diskId": diskId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResultData<Array<ContextMenuItemModel>> = await lastValueFrom(postResult);

        return result;
    }

    public async getContextMenuOfFolder(folderId: number, inside: boolean): Promise<ServiceResultData<Array<ContextMenuItemModel>>> {
        let postResult: Observable<ServiceResultData<Array<ContextMenuItemModel>>> = await this._http.post<ServiceResultData<Array<ContextMenuItemModel>>>(
            this.baseUrl + "File/GetContextMenu", {
            "folderInside": inside,
            "folderId": folderId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResultData<Array<ContextMenuItemModel>> = await lastValueFrom(postResult);

        return result;
    }

    public async getContextMenuOfFile(fileId: number): Promise<ServiceResultData<Array<ContextMenuItemModel>>> {
        let postResult: Observable<ServiceResultData<Array<ContextMenuItemModel>>> = await this._http.post<ServiceResultData<Array<ContextMenuItemModel>>>(
            this.baseUrl + "File/GetContextMenu", {
            "folderInside": false,
            "fileId": fileId
        }, { headers: this.getDefaultHeaders() });

        let result: ServiceResultData<Array<ContextMenuItemModel>> = await lastValueFrom(postResult);

        return result;
    }
}