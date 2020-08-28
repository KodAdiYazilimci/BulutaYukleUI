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

@Injectable()
export class FolderService implements OnInit, HttpInterceptor {
    private folderContent: ContentModel = new ContentModel();
    private contextMenu: Array<ContextMenuItemModel>;

    constructor(
        private _contextMenuRepository: ContextMenuRepository,
        private _diskRepository: DiskRepository,
        private _folderRepository: FolderRepository) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async getFolderContent(folderId: number): Promise<ContentModel> {
        this.folderContent = (await this._folderRepository.getFolderContent(folderId)).resultObject;
        return this.folderContent;
    }

    public async getContextMenu(folderId: number): Promise<Array<ContextMenuItemModel>> {
        this.contextMenu = (await this._contextMenuRepository.getContextMenuOfFolder(folderId)).resultObject;
        return this.contextMenu;
    }
}