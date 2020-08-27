import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { from } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";

import { BaseRepository } from "../repositories/repositories._base";
import { DiskModel } from '../models/model.disk';
import { ContentModel } from '../models/model.content';

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

        return await this._http.get<ServiceResultData<Array<DiskModel>>>(
            this.baseUrl + "File/GetDisks", { headers: headers }
        ).toPromise();
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
}