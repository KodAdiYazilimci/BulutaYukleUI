import { Component, Output, EventEmitter } from "@angular/core";
import { UserModel } from "../../models/model.user";
import { PermissionTypeModel } from 'src/app/models/model.permissiontype';
import { PermissionTypes } from 'src/app/util/util.permissiontypes';
import { ItemTypes } from 'src/app/util/util.itemtypes';
import { DiskService } from 'src/app/services/services.disk';
import { FileService } from 'src/app/services/services.file';
import { FolderService } from 'src/app/services/services.folder';

@Component({
    selector: "permissionuser",
    templateUrl: './component.permissionuser.html',
    styleUrls: ['./component.permissionuser.css'],
    providers: [DiskService, FileService, FolderService]
})
export class PermissionUserComponent {
    public visible: boolean;
    public itemType: number;
    public itemId: number;
    public selectedUserId: number;
    public users: Array<UserModel> = new Array<UserModel>();

    public checkedRead: boolean = false;
    public checkedWrite: boolean = false;
    public checkedDelete: boolean = false;
    public checkedFull: boolean = false;

    @Output()
    public onClosedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private _diskService: DiskService,
        private _fileService: FileService,
        private _folderService: FolderService) { }

    public show(itemType: number, itemId: number, users: Array<UserModel>): void {
        this.itemType = itemType;
        this.itemId = itemId;
        this.users = users;
        this.visible = true;
    }

    public hide(): void {
        this.onClosedEvent.emit(false);
        this.visible = false;
    }

    public async Ok() {
        let selectedPermissions: Array<PermissionTypeModel> = new Array<PermissionTypeModel>();

        if (this.checkedRead || this.checkedFull) {
            let permissionTypeRead: PermissionTypeModel = new PermissionTypeModel();
            permissionTypeRead.id = PermissionTypes.Read();
            selectedPermissions.push(permissionTypeRead);
        }

        if (this.checkedWrite || this.checkedFull) {
            let permissionTypeWrite: PermissionTypeModel = new PermissionTypeModel();
            permissionTypeWrite.id = PermissionTypes.Write();
            selectedPermissions.push(permissionTypeWrite);
        }

        if (this.checkedDelete || this.checkedFull) {
            let permissionTypeDelete: PermissionTypeModel = new PermissionTypeModel();
            permissionTypeDelete.id = PermissionTypes.Delete();
            selectedPermissions.push(permissionTypeDelete);
        }

        if (this.checkedFull) {
            let permissionTypeFull: PermissionTypeModel = new PermissionTypeModel();
            permissionTypeFull.id = PermissionTypes.Full();
            selectedPermissions.push(permissionTypeFull);
        }

        if (this.itemType == ItemTypes.folder()) {
            await this._folderService.appendFolderPermissionForUser(this.itemId, this.selectedUserId, selectedPermissions);
        } else if (this.itemType == ItemTypes.file()) {
            await this._fileService.appendFilePermissionForUser(this.itemId, this.selectedUserId, selectedPermissions);
        } else if (this.itemType == ItemTypes.disk()) {
            await this._diskService.appendDiskPermissionForUser(this.itemId, this.selectedUserId, selectedPermissions);
        }
        this.onClosedEvent.emit(true);
        this.visible = false;
    }
}