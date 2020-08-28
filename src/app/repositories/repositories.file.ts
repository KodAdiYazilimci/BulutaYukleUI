import { Injectable, OnInit, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";
import { from } from "rxjs";

import { ServiceResult, ServiceResultData } from "../models/model.serviceresult";
import { FileUploadModel } from "../models/model.fileupload";

import { BaseRepository } from "../repositories/repositories._base";
import { map } from 'rxjs/operators';
import { GridItemModel } from '../models/model.gridItem';

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

        this._http.post(this.baseUrl + "File/UploadFile", formData, { headers: headers, reportProgress: true, observe: "events" }).subscribe(resp => {

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
}