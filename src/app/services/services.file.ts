import { Injectable, OnInit, EventEmitter } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { FileRepository } from '../repositories/repositories.file';
import { FileUploadModel } from '../models/model.fileupload';
import { ServiceResultData, ServiceResult } from '../models/model.serviceresult';
import { PropertyModel } from '../models/model.property';
import { ContextMenuItemModel } from '../models/model.contextmenuitem';
import { ContextMenuRepository } from '../repositories/repositories.contextmenu';

@Injectable()
export class FileService implements OnInit, HttpInterceptor {

    public onFileUploadingEventHandler: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();

    constructor(
        private _contextMenuRepository: ContextMenuRepository,
        private _fileRepository: FileRepository) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public uploadFileToDisk(diskId: number, files: any) {
        this._fileRepository.onUploadingEventHandler.subscribe((event: FileUploadModel) => {
            this.onFileUploadingEventHandler.emit(event);
        });
        this._fileRepository.uploadFileToDisk(diskId, files);
    }

    public async getContextMenu(folderId: number): Promise<Array<ContextMenuItemModel>> {
        let result: ServiceResultData<Array<ContextMenuItemModel>> = await this._contextMenuRepository.getContextMenuOfFile(folderId);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async getFileProperty(fileId: number): Promise<PropertyModel> {
        let result: ServiceResultData<PropertyModel> = await this._fileRepository.getFileProperties(fileId);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async renameFile(fileId: number, name: string) {
        let serviceResult: ServiceResult = await this._fileRepository.renameFile(fileId, name);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }
}