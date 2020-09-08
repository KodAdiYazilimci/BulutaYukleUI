import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";
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
        return await this._http.post<ServiceResultData<Array<ContextMenuItemModel>>>(
            this.baseUrl + "File/GetContextMenu", {
            "folderInside": inside,
            "diskId": diskId
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async getContextMenuOfFolder(folderId: number, inside: boolean): Promise<ServiceResultData<Array<ContextMenuItemModel>>> {
        return await this._http.post<ServiceResultData<Array<ContextMenuItemModel>>>(
            this.baseUrl + "File/GetContextMenu", {
            "folderInside": inside,
            "folderId": folderId
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }

    public async getContextMenuOfFile(fileId: number): Promise<ServiceResultData<Array<ContextMenuItemModel>>> {
        return await this._http.post<ServiceResultData<Array<ContextMenuItemModel>>>(
            this.baseUrl + "File/GetContextMenu", {
            "folderInside": false,
            "fileId": fileId
        }, { headers: this.getDefaultHeaders() }).toPromise();
    }
}