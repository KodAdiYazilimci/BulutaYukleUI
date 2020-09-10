import { Component, EventEmitter, Output, Input } from "@angular/core";
import { PasswordConfirmModel } from "../../models/model.passwordconfirm";
import { from } from "rxjs";
import { BaseDialog } from './component._dialogbase';

@Component({
    selector: "dialogpasswordinput",
    templateUrl: "./component.dialogpasswordinput.html",
    styleUrls: ["./component.dialogpasswordinput.css"]
})
export class DialogPasswordInputComponent extends BaseDialog {
    public visible: boolean = false;
    public title: string;
    public message: string;
    public placeholder: string;

    @Input()
    public password: string = "";

    @Output()
    public onOkClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
        super();
    }

    public show(title: string, message: string, placeholder: string): void {
        this.title = title;
        this.message = message;
        this.placeholder = placeholder;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public Ok(): void {
        this.onOkClicked.emit(this.password);
        this.visible = false;
    }
}