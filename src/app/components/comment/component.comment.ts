import { Component, EventEmitter, Output } from "@angular/core";
import { CommentItemModel } from "../../models/model.commentitem";
import { FileService } from 'src/app/services/services.file';
import { FolderService } from 'src/app/services/services.folder';
import { ItemTypes } from 'src/app/util/util.itemtypes';

@Component({
    selector: "comment",
    templateUrl: "./component.comment.html",
    styleUrls: ["./component.comment.css"],
    providers: [FileService, FolderService]
})
export class CommentComponent {

    public title: string;
    public itemType: number;
    public itemId: number;
    public visible: boolean;

    public formText: string = "";

    public comments: Array<CommentItemModel> = new Array<CommentItemModel>();

    @Output()
    public onSendEmptyText: EventEmitter<{}> = new EventEmitter<{}>();

    constructor(
        private _fileService: FileService,
        private _folderService: FolderService) { }

    public show(title: string, itemType: number, itemId: number, comments: Array<CommentItemModel>): void {
        this.title = title;
        this.itemType = itemType;
        this.itemId = itemId;
        this.comments = comments;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public async send(): Promise<void> {
        if (this.formText.length > 0) {
            if (this.itemType == ItemTypes.folder()) {
                await this._folderService.createFolderComment(this.itemId, this.formText);
                this.comments = await this._folderService.getFolderComments(this.itemId);
            } else if (this.itemType == ItemTypes.file()) {
                await this._fileService.createFileComment(this.itemId, this.formText);
                this.comments = await this._fileService.getFileComments(this.itemId);
            }
        } else {
            this.onSendEmptyText.emit({});
        }

        this.formText = "";
    }
}