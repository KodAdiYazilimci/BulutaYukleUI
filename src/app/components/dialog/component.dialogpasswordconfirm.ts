import { Component, EventEmitter, Output, Input } from "@angular/core";
import { PasswordConfirmModel } from "../../models/model.passwordconfirm";
import { from } from "rxjs";

@Component({
    selector: "dialogpasswordconfirm",
    templateUrl: "./component.dialogpasswordconfirm.html",
    styleUrls: ["./component.dialogpasswordconfirm.css"]
})
export class DialogPasswordConfirmComponent {
    public visible: boolean = false;
    public title: string;
    public message: string;
    public placeholderfirst: string;
    public placeholdersecond: string;

    @Input()
    public passwordFirst: string = "";

    @Input()
    public passwordSecond: string = "";

    @Output()
    public onOkClicked: EventEmitter<PasswordConfirmModel> = new EventEmitter<PasswordConfirmModel>();

    constructor() { }

    public show(title: string, message: string, placeholderfirst: string, placeholdersecond: string): void {
        this.title = title;
        this.message = message;
        this.placeholderfirst = placeholderfirst;
        this.placeholdersecond = placeholdersecond;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public Ok(): void {

        let confirmedModel: PasswordConfirmModel = new PasswordConfirmModel();
        confirmedModel.passwordFirst = this.passwordFirst;
        confirmedModel.passwordSecond = this.passwordSecond;

        this.onOkClicked.emit(confirmedModel);
        this.visible = false;
    }
}