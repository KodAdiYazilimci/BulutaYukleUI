import { Component, ViewChild } from "@angular/core";
import { PermissionGroupComponent } from './component.permissiongroup';
import { PermissionUserComponent } from './component.permissionuser';
import { PermissionModel } from "../../models/model.permission";
import { UserGroupModel } from 'src/app/models/model.usergroup';
import { UserModel } from 'src/app/models/model.user';
import { ItemTypes } from 'src/app/util/util.itemtypes';
import { DiskService } from 'src/app/services/services.disk';
import { FileService } from 'src/app/services/services.file';
import { FolderService } from 'src/app/services/services.folder';
import { UserService } from 'src/app/services/services.user';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
    selector: "permission",
    templateUrl: "./component.permission.html",
    styleUrls: ["./component.permission.css"],
    providers: [DiskService, FileService, FolderService, UserService]
})
export class PermissionComponent {
    public visible: boolean;
    public title: string;

    @ViewChild(PermissionGroupComponent, { static: true })
    private permissionGroupWindow: PermissionGroupComponent;

    @ViewChild(PermissionUserComponent, { static: true })
    private permissionUserWindow: PermissionUserComponent;

    public itemType: number;
    public itemId: number;

    public groups: Array<PermissionModel> = new Array<PermissionModel>();
    public users: Array<PermissionModel> = new Array<PermissionModel>();
    public solidPermissions: PermissionModel = new PermissionModel();

    public marginLeft: string = "33%";
    public marginTop: string = "5%";
    public mouseDowned: boolean = false;

    constructor(
        private _diskService: DiskService,
        private _fileService: FileService,
        private _folderService: FolderService,
        private _userService: UserService) {
    }

    public async show(itemType: number, itemId: number, title: string) {
        this.itemType = itemType;
        this.itemId = itemId;
        this.title = title;

        await this.loadPermissions();

        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    private async loadPermissions() {
        let permissions: PermissionModel;
        if (this.itemType == ItemTypes.folder()) {
            permissions = await this._folderService.getFolderPermissions(this.itemId);
        } else if (this.itemType == ItemTypes.file()) {
            permissions = await this._fileService.getFilePermissions(this.itemId);
        } else if (this.itemType == ItemTypes.disk()) {
            permissions = await this._diskService.getDiskPermissions(this.itemId);
        }

        this.groups = permissions.groups;
        this.users = permissions.users;
        this.solidPermissions = permissions.solidPermissions;
    }

    public async deletePermissionUserItem(userId: number) {
        if (this.itemType == ItemTypes.folder()) {
            await this._folderService.removeFolderPermissionForUser(this.itemId, userId);
        } else if (this.itemType == ItemTypes.file()) {
            await this._fileService.removeFilePermissionForUser(this.itemId, userId);
        } else if (this.itemType == ItemTypes.disk()) {
            await this._diskService.removeDiskPermissionForUser(this.itemId, userId);
        }

        await this.loadPermissions();
    }

    public async deletePermissionGroupItem(groupId: number) {
        if (this.itemType == ItemTypes.folder()) {
            await this._folderService.removeFolderPermissionForGroup(this.itemId, groupId);
        } else if (this.itemType == ItemTypes.file()) {
            await this._fileService.removeFilePermissionForGroup(this.itemId, groupId);
        } else if (this.itemType == ItemTypes.disk()) {
            await this._diskService.removeDiskPermissionForGroup(this.itemId, groupId);
        }

        await this.loadPermissions();
    }

    public async showAddPermissionGroup() {

        let groups: Array<UserGroupModel> = await this._userService.getGroups();

        this.permissionGroupWindow.onClosedEvent.subscribe(async event => await this.onClosedPermissionGroupWindow(event));
        this.permissionGroupWindow.show(this.itemType, this.itemId, groups);
    }

    private async onClosedPermissionGroupWindow(clickedOk: boolean) {
        if (clickedOk) {
            await this.loadPermissions();
        }
    }

    public async showAddPermissionUser() {

        let users: Array<UserModel> = await this._userService.getUsers();

        this.permissionUserWindow.onClosedEvent.subscribe(async event => await this.onClosedPermissionUserWindow(event));
        this.permissionUserWindow.show(this.itemType, this.itemId, users);
    }

    private async onClosedPermissionUserWindow(clickedOk: boolean) {
        if (clickedOk) {
            await this.loadPermissions();
        }
    }

    public mouseDown(event: any) {
        this.mouseDowned = true;
    }
    public mouseMove(event: any) {
        if (this.mouseDowned == true) {
            this.marginLeft = event.pageX + "px";
            this.marginTop = event.pageY + "px";
        }

        this.permissionGroupWindow.mouseMove(event);
        this.permissionUserWindow.mouseMove(event);
    }
    public mouseUp(event: any) {
        this.mouseDowned = false;
    }
}