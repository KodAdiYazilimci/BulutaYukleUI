import { Component, Output, EventEmitter } from "@angular/core";
import { UserModel } from "../../models/model.user";

@Component({
    selector: "permissionuser",
    templateUrl: './component.permissionuser.html',
    styleUrls: ['./component.permissionuser.css']
})
export class PermissionUserComponent {
    public visible: boolean;
    public selectedUserId: number;
    public users: Array<UserModel> = new Array<UserModel>();

    public checkedRead: boolean = false;
    public checkedWrite: boolean = false;
    public checkedDelete: boolean = false;
    public checkedFull: boolean = false;

    @Output()
    public onClosedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    public show(users: Array<UserModel>): void {
        this.users = users;
        this.visible = true;
    }

    public hide(): void {
        this.onClosedEvent.emit(false);
        this.visible = false;
    }

    public Ok(): void {
        this.onClosedEvent.emit(true);
        this.visible = false;
    }
}