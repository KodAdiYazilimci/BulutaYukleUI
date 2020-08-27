import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { DiskRepository } from "../repositories/repositories.disk";
import { DiskModel } from '../models/model.disk';
import { ContentModel } from '../models/model.content';

@Injectable()
export class DiskService implements OnInit, HttpInterceptor {

    private diskData: DiskModel = new DiskModel();
    private diskContent: ContentModel = new ContentModel();

    constructor(private _diskRepository: DiskRepository) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async getDisks(): Promise<DiskModel> {
        this.diskData.disks = (await this._diskRepository.getDisks()).resultObject;
        return this.diskData;
    }

    public async getDiskContent(diskId: number): Promise<ContentModel> {
        this.diskContent = (await this._diskRepository.getDiskContent(diskId)).resultObject;
        return this.diskContent;
    }
}