import { Injectable, OnInit, EventEmitter } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { FileRepository } from '../repositories/repositories.file';
import { FileUploadModel } from '../models/model.fileupload';

@Injectable()
export class FileService implements OnInit, HttpInterceptor {

    public onFileUploadingEventHandler: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();

    constructor(private _fileRepository: FileRepository) {
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
}