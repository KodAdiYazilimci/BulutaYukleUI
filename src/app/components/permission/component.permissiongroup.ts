import { Component, EventEmitter, Output } from "@angular/core";
import { UserGroupModel } from "../../models/model.usergroup";
import { DiskService } from 'src/app/services/services.disk';
import { FileService } from 'src/app/services/services.file';
import { FolderService } from 'src/app/services/services.folder';
import { ItemTypes } from 'src/app/util/util.itemtypes';
import { PermissionTypeModel } from 'src/app/models/model.permissiontype';
import { PermissionTypes } from "src/app/util/util.permissiontypes";

@Component({
    selector: "permissiongroup",
    templateUrl: './component.permissiongroup.html',
    styleUrls: ['./component.permissiongroup.css'],
    providers: [DiskService, FileService, FolderService]
})
export class PermissionGroupComponent {
    public visible: boolean;
    public itemType: number;
    public itemId: number;
    public selectedGroupId: number;
    public userGroups: Array<UserGroupModel> = new Array<UserGroupModel>();

    public checkedRead: boolean = false;
    public checkedWrite: boolean = false;
    public checkedDelete: boolean = false;
    public checkedFull: boolean = false;

    @Output()
    public onClosedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public marginLeft: string = "50%";
    public marginTop: string = "15%";
    public mouseDowned: boolean = false;

    constructor(
        private _diskService: DiskService,
        private _fileService: FileService,
        private _folderService: FolderService) { }

    public show(itemType: number, itemId: number, userGroups: Array<UserGroupModel>): void {
        this.itemType = itemType;
        this.itemId = itemId;
        this.userGroups = userGroups;
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
            await this._folderService.appendFolderPermissionForGroup(this.itemId, this.selectedGroupId, selectedPermissions);
        } else if (this.itemType == ItemTypes.file()) {
            await this._fileService.appendFilePermissionForGroup(this.itemId, this.selectedGroupId, selectedPermissions);
        } else if (this.itemType == ItemTypes.disk()) {
            await this._diskService.appendDiskPermissionForGroup(this.itemId, this.selectedGroupId, selectedPermissions);
        }

        this.onClosedEvent.emit(true);
        this.visible = false;
    }
    
    public mouseDown(event: any) {
        this.mouseDowned = true;
    }
    public mouseMove(event: any) {
        if (this.mouseDowned == true) {
            this.marginLeft = event.pageX + "px";
            this.marginTop = event.pageY + "px";
        }
    }
    public mouseUp(event: any) {
        this.mouseDowned = false;
    }
}