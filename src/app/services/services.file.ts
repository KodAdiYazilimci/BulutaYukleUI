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
import { CommentItemModel } from '../models/model.commentitem';
import { HistoryItemModel } from '../models/model.historyitem';
import { PermissionModel } from '../models/model.permission';
import { PermissionTypeModel } from '../models/model.permissiontype';

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

    public uploadFileToFolder(folderId: number, files: any) {
        this._fileRepository.onUploadingEventHandler.subscribe((event: FileUploadModel) => {
            this.onFileUploadingEventHandler.emit(event);
        });
        this._fileRepository.uploadFileToFolder(folderId, files);
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

    public async getFileComments(fileId: number): Promise<Array<CommentItemModel>> {
        let serviceResult: ServiceResultData<Array<CommentItemModel>> = await this._fileRepository.getFileComments(fileId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async createFileComment(fileId: number, text: string) {
        let serviceResult: ServiceResult = await this._fileRepository.createFileComment(fileId, text);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async getFileHistories(fileId: number): Promise<Array<HistoryItemModel>> {
        let serviceResult: ServiceResultData<Array<HistoryItemModel>> = await this._fileRepository.getFileHistories(fileId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async hideFile(fileId: number) {
        let serviceResult: ServiceResult = await this._fileRepository.hideFile(fileId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async showFile(fileId: number) {
        let serviceResult: ServiceResult = await this._fileRepository.showFile(fileId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async getFilePermissions(fileId: number): Promise<PermissionModel> {
        let serviceResult: ServiceResultData<PermissionModel> = await this._fileRepository.getFilePermissions(fileId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async removeFilePermissionForUser(fileId: number, userId: number) {
        let serviceResult: ServiceResult = await this._fileRepository.removeFilePermissionForUser(fileId, userId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async removeFilePermissionForGroup(fileId: number, groupId: number) {
        let serviceResult: ServiceResult = await this._fileRepository.removeFilePermissionForGroup(fileId, groupId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async appendFilePermissionForGroup(fileId: number, groupId: number, permissions: Array<PermissionTypeModel>) {
        let serviceResult: ServiceResult = await this._fileRepository.appendFilePermissionForGroup(fileId, groupId, permissions);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async appendFilePermissionForUser(fileId: number, userId: number, permissions: Array<PermissionTypeModel>) {
        let serviceResult: ServiceResult = await this._fileRepository.appendFilePermissionForUser(fileId, userId, permissions);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async lockFile(fileId: number, password: string) {
        let serviceResult: ServiceResult = await this._fileRepository.lockFile(fileId, password);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async unLockFile(fileId: number, password: string) {
        let serviceResult: ServiceResult = await this._fileRepository.unLockFile(fileId, password);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async deleteFile(fileId: number) {
        let serviceResult: ServiceResult = await this._fileRepository.deleteFile(fileId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }
}