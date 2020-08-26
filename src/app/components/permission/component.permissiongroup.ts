import { Component, EventEmitter, Output } from "@angular/core";
import { UserGroupModel } from "../../models/model.usergroup";

@Component({
    selector: "permissiongroup",
    templateUrl: './component.permissiongroup.html',
    styleUrls: ['./component.permissiongroup.css']
})
export class PermissionGroupComponent {
    public visible: boolean;
    public selectedGroupId: number;
    public userGroups: Array<UserGroupModel> = new Array<UserGroupModel>();

    public checkedRead: boolean = false;
    public checkedWrite: boolean = false;
    public checkedDelete: boolean = false;
    public checkedFull: boolean = false;

    @Output()
    public onClosedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    public show(userGroups: Array<UserGroupModel>): void {
        this.userGroups = userGroups;
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