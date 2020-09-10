import { Component, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { FileService } from 'src/app/services/services.file';
import { FileUploadModel } from 'src/app/models/model.fileupload';
import { GridItemModel } from 'src/app/models/model.gridItem';
import { Router } from '@angular/router';
import { BaseDialog } from './component._dialogbase';

@Component({
    selector: "dialogupload",
    templateUrl: "./component.dialogupload.html",
    styleUrls: ["./component.dialogupload.css"],
    providers: [FileService]
})
export class DialogUploadComponent extends BaseDialog {
    private diskId: number = 0;
    private folderId: number = 0;

    public visible: boolean;
    public visibleSelectFile: boolean;
    public visibleUploading: boolean;
    public percentage: number;
    public onFileUploaded: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();
    public onFailed: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _router: Router,
        private _fileService: FileService) {
        super();
    }

    public uploadToDisk(diskId: number): void {
        this.diskId = diskId;
        this.visibleSelectFile = true;
        this.visibleUploading = false;
        this.visible = true;
    }

    public uploadToFolder(folderId: number): void {
        this.folderId = folderId;
        this.visibleSelectFile = true;
        this.visibleUploading = false;
        this.visible = true;
    }

    public upload(event: any) {
        try {
            this.visibleSelectFile = false;
            this.visibleUploading = true;

            this._fileService.onFileUploadingEventHandler.subscribe((event: FileUploadModel) => {
                this.percentage = event.percentage;
                if (event.complete && event.status == 200) {
                    this.visible = false;
                    this.onFileUploaded.emit(event);
                } else if (event.complete) {
                    this.visible = false;
                    this.onFailed.emit(event.error);
                }
            });
            if (this.diskId > 0) {
                this._fileService.uploadFileToDisk(this.diskId, event.target.files);
            } else if (this.folderId > 0) {
                this._fileService.uploadFileToFolder(this.folderId, event.target.files);
            }
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
            this.percentage = 100;
            this.onFailed.emit(ex);
        }
    }

    public hide(): void {
        this.visible = false;
    }
}