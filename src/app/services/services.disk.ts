import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { DiskRepository } from "../repositories/repositories.disk";
import { DiskModel } from '../models/model.disk';
import { ContentModel } from '../models/model.content';
import { ContextMenuItemModel } from '../models/model.contextmenuitem';
import { ContextMenuRepository } from '../repositories/repositories.contextmenu';
import { ServiceResultData, ServiceResult } from '../models/model.serviceresult';
import { PermissionModel } from '../models/model.permission';
import { PermissionTypeModel } from '../models/model.permissiontype';

@Injectable()
export class DiskService implements OnInit, HttpInterceptor {
    constructor(
        private _contextMenuRepository: ContextMenuRepository,
        private _diskRepository: DiskRepository) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async getDisks(): Promise<Array<DiskModel>> {
        let result: ServiceResultData<Array<DiskModel>> = await this._diskRepository.getDisks();

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async getDiskContent(diskId: number): Promise<ContentModel> {
        let result: ServiceResultData<ContentModel> = await this._diskRepository.getDiskContent(diskId);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async getContextMenu(diskId: number): Promise<Array<ContextMenuItemModel>> {
        let result: ServiceResultData<Array<ContextMenuItemModel>> = await this._contextMenuRepository.getContextMenuOfDisk(diskId);

        if (result.isSuccess == false) {
            throw new Error(result.errorMessage);
        }

        return result.resultObject;
    }

    public async getDiskPermissions(diskId: number): Promise<PermissionModel> {
        let serviceResult: ServiceResultData<PermissionModel> = await this._diskRepository.getDiskPermissions(diskId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async removeDiskPermissionForUser(diskId: number, userId: number) {
        let serviceResult: ServiceResult = await this._diskRepository.removeDiskPermissionForUser(diskId, userId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async removeDiskPermissionForGroup(diskId: number, groupId: number) {
        let serviceResult: ServiceResult = await this._diskRepository.removeDiskPermissionForGroup(diskId, groupId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async appendDiskPermissionForUser(diskId: number, userId: number, permissions: Array<PermissionTypeModel>) {
        let serviceResult: ServiceResult = await this._diskRepository.appendDiskPermissionForUser(diskId, userId, permissions);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async appendDiskPermissionForGroup(diskId: number, groupId: number, permissions: Array<PermissionTypeModel>) {
        let serviceResult: ServiceResult = await this._diskRepository.appendDiskPermissionForGroup(diskId, groupId, permissions);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }
}