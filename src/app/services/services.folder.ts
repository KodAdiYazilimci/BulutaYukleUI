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

    public async getContextMenu(folderId: number): Promise<Array<ContextMenuItemModel>> {
        let result: ServiceResultData<Array<ContextMenuItemModel>> = await this._contextMenuRepository.getContextMenuOfFolder(folderId);

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
}