import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ContentRepository } from '../repositories/repositories.content';
import { GridItemModel } from '../models/model.gridItem';
import { ServiceResult, ServiceResultData } from '../models/model.serviceresult';

@Injectable()
export class ContentService implements OnInit, HttpInterceptor {
    constructor(
        private _contentRepository: ContentRepository) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async shareItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<string> {
        let serviceResult: ServiceResultData<string> = await this._contentRepository.shareItems(folders, files);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async unShareItems(folders: Array<GridItemModel>, files: Array<GridItemModel>) {
        let serviceResult: ServiceResult = await this._contentRepository.unShareItems(folders, files);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async downloadItems(folders: Array<GridItemModel>, files: Array<GridItemModel>): Promise<Blob> {
        return await this._contentRepository.downloadItems(folders, files);
    }

    public async moveItemsToDisk(folders: Array<GridItemModel>, files: Array<GridItemModel>, diskId: number) {
        let serviceResult: ServiceResult = await this._contentRepository.moveItemsToDisk(folders, files, diskId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async moveItemsToFolder(folders: Array<GridItemModel>, files: Array<GridItemModel>, folderId: number) {
        let serviceResult: ServiceResult = await this._contentRepository.moveItemsToFolder(folders, files, folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async copyItemsToDisk(folders: Array<GridItemModel>, files: Array<GridItemModel>, diskId: number) {
        let serviceResult: ServiceResult = await this._contentRepository.copyItemsToDisk(folders, files, diskId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }

    public async copyItemsToFolder(folders: Array<GridItemModel>, files: Array<GridItemModel>, folderId: number) {
        let serviceResult: ServiceResult = await this._contentRepository.copyItemsToFolder(folders, files, folderId);

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }
    }
}