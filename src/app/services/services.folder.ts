import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { DiskRepository } from "../repositories/repositories.disk";
import { DiskModel } from '../models/model.disk';
import { ContentModel } from '../models/model.content';
import { ContextMenuItemModel } from '../models/model.contextmenuitem';
import { ContextMenuRepository } from '../repositories/repositories.contextmenu';
import { FolderRepository } from '../repositories/repositories.folder';
import { ServiceResultData, ServiceResult } from '../models/model.serviceresult';
import { PropertyModel } from '../models/model.property';
import { CommentItemModel } from '../models/model.commentitem';
import { HistoryItemModel } from '../models/model.historyitem';
import { PermissionModel } from '../models/model.permission';
import { PermissionTypeModel } from '../models/model.permissiontype';

@Injectable()
export class FolderService implements OnInit, HttpInterceptor {

    constructor(
        private _contextMenuRepository: ContextMenuRepository,
        private _folderRepository: FolderRepository) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async getFolderContent(folderId: number): Promise<ContentModel> {
        let result: ServiceResultData<ContentModel> = await this._folderRepository.getFolderContent(folderId);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async getContextMenu(folderId: number, inside: boolean): Promise<Array<ContextMenuItemModel>> {
        let result: ServiceResultData<Array<ContextMenuItemModel>> = await this._contextMenuRepository.getContextMenuOfFolder(folderId, inside);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async createFolderOnDisk(diskId: number, folderName: string) {
        let serviceResult: ServiceResult = await this._folderRepository.createFolderOnDisk(diskId, folderName);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async createFolderOnFolder(folderId: number, folderName: string) {
        let serviceResult: ServiceResult = await this._folderRepository.createFolderOnFolder(folderId, folderName);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async getFolderProperty(folderId: number): Promise<PropertyModel> {
        let result: ServiceResultData<PropertyModel> = await this._folderRepository.getFolderProperties(folderId);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async renameFolder(folderId: number, name: string) {
        let serviceResult: ServiceResult = await this._folderRepository.renameFolder(folderId, name);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async getFolderComments(folderId: number): Promise<Array<CommentItemModel>> {
        let serviceResult: ServiceResultData<Array<CommentItemModel>> = await this._folderRepository.getFolderComments(folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async createFolderComment(folderId: number, text: string) {
        let serviceResult: ServiceResult = await this._folderRepository.createFolderComment(folderId, text);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async getFolderHistories(folderId: number): Promise<Array<HistoryItemModel>> {
        let serviceResult: ServiceResultData<Array<HistoryItemModel>> = await this._folderRepository.getFolderHistories(folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async hideFolder(folderId: number) {
        let serviceResult: ServiceResult = await this._folderRepository.hideFolder(folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async showFolder(folderId: number) {
        let serviceResult: ServiceResult = await this._folderRepository.showFolder(folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async getFolderPermissions(folderId: number): Promise<PermissionModel> {
        let serviceResult: ServiceResultData<PermissionModel> = await this._folderRepository.getFolderPermissions(folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async removeFolderPermissionForUser(folderId: number, userId: number) {
        let serviceResult: ServiceResult = await this._folderRepository.removeFolderPermissionForUser(folderId, userId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async removeFolderPermissionForGroup(folderId: number, groupId: number) {
        let serviceResult: ServiceResult = await this._folderRepository.removeFolderPermissionForGroup(folderId, groupId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async appendFolderPermissionForGroup(folderId: number, groupId: number, permissions: Array<PermissionTypeModel>) {
        let serviceResult: ServiceResult = await this._folderRepository.appendFolderPermissionForGroup(folderId, groupId, permissions);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async appendFolderPermissionForUser(folderId: number, userId: number, permissions: Array<PermissionTypeModel>) {
        let serviceResult: ServiceResult = await this._folderRepository.appendFolderPermissionForUser(folderId, userId, permissions);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async lockFolder(folderId: number, password: string) {
        let serviceResult: ServiceResult = await this._folderRepository.lockFolder(folderId, password);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async unLockFolder(folderId: number, password: string) {
        let serviceResult: ServiceResult = await this._folderRepository.unLockFolder(folderId, password);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }
}