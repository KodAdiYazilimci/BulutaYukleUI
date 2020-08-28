import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { DiskRepository } from "../repositories/repositories.disk";
import { DiskModel } from '../models/model.disk';
import { ContentModel } from '../models/model.content';
import { ContextMenuItemModel } from '../models/model.contextmenuitem';
import { ContextMenuRepository } from '../repositories/repositories.contextmenu';
import { ServiceResultData } from '../models/model.serviceresult';

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
}