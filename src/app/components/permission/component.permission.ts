import { Component, ViewChild } from "@angular/core";
import { PermissionGroupComponent } from './component.permissiongroup';
import { PermissionUserComponent } from './component.permissionuser';
import { PermissionModel } from "../../models/model.permission";
import { UserGroupModel } from 'src/app/models/model.usergroup';
import { UserModel } from 'src/app/models/model.user';

@Component({
    selector: "permission",
    templateUrl: "./component.permission.html",
    styleUrls: ["./component.permission.css"]
})
export class PermissionComponent {
    public visible: boolean;
    public title: string;

    @ViewChild(PermissionGroupComponent, { static: true })
    private permissionGroupWindow: PermissionGroupComponent;

    @ViewChild(PermissionUserComponent, { static: true })
    private permissionUserWindow: PermissionUserComponent;

    public groups: Array<PermissionModel> = new Array<PermissionModel>();
    public users: Array<PermissionModel> = new Array<PermissionModel>();
    public solidPermissions: Array<PermissionModel> = new Array<PermissionModel>();

    constructor() { }

    public show(title: string, groups: Array<PermissionModel>, users: Array<PermissionModel>, solidPermissions: Array<PermissionModel>): void {
        this.title = title;
        this.groups = groups;
        this.users = users;
        this.solidPermissions = solidPermissions;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public deletePermissionUserItem(): void {

    }

    public showAddPermissionGroup(): void {

        let groups: Array<UserGroupModel> = new Array<UserGroupModel>();
        let group: UserGroupModel = new UserGroupModel();
        group.id = 1;
        group.name = "Admins (Full,Read,Write,Delete)";
        groups.push(group);

        this.permissionGroupWindow.onClosedEvent.subscribe(event => this.onClosedPermissionGroupWindow(event));
        this.permissionGroupWindow.show(groups);
    }

    private onClosedPermissionGroupWindow(clickedOk: boolean) {

    }

    public showAddPermissionUser(): void {

        let users: Array<UserModel> = new Array<UserModel>();
        let user: UserModel = new UserModel();
        user.id = 1;
        user.name = "serkancamur@gmail.com (Full,Read,Write,Delete)";
        users.push(user);

        this.permissionUserWindow.onClosedEvent.subscribe(event => this.onClosedPermissionUserWindow(event));
        this.permissionUserWindow.show(users);
    }

    private onClosedPermissionUserWindow(clickedOk: boolean) {

    }
}