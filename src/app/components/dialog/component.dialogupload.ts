import { Component, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { FileService } from 'src/app/services/services.file';
import { FileUploadModel } from 'src/app/models/model.fileupload';
import { GridItemModel } from 'src/app/models/model.gridItem';

@Component({
    selector: "dialogupload",
    templateUrl: "./component.dialogupload.html",
    styleUrls: ["./component.dialogupload.css"],
    providers: [FileService]
})
export class DialogUploadComponent {
    private diskId: number = 0;

    public visible: boolean;
    public visibleSelectFile: boolean;
    public visibleUploading: boolean;
    public percentage: number;
    public onFileUploaded: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();
    public onFailed: EventEmitter<{}> = new EventEmitter<{}>();

    constructor(private _fileService: FileService) { }

    public uploadToDisk(diskId: number): void {
        this.diskId = diskId;
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
            }
        } catch (ex) {
            this.percentage = 100;
            this.onFailed.emit(ex);
        }
    }

    public hide(): void {
        this.visible = false;
    }
}