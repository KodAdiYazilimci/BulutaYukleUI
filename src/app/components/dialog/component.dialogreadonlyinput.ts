import { Component } from "@angular/core";
import { BaseDialog } from './component._dialogbase';

@Component({
    selector: "dialogreadonly",
    templateUrl: "./component.dialogreadonlyinput.html",
    styleUrls: ["./component.dialogreadonlyinput.css"]
})
export class DialogReadOnlyInputComponent extends BaseDialog {
    public visible: boolean;
    public title: string = "";
    public message: string = "";
    public content: string = "";

    constructor() {
        super();
    }

    public show(title: string, message: string, content: string): void {
        this.title = title;
        this.message = message;
        this.content = content;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }
}