import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "dialoginfo",
    templateUrl: "./component.dialoginfo.html",
    styleUrls: ["./component.dialoginfo.css"]
})
export class DialogInfoComponent {
    public visible: boolean = false;
    public title: string;
    public message: string;

    @Output()
    public onClickedOk: EventEmitter<{}> = new EventEmitter<{}>();

    constructor() { }

    public hide(): void {
        this.visible = false;
    }

    public show(title: string, message: string): void {
        this.title = title;
        this.message = message;
        this.visible = true;
    }

    public Ok(): void {
        this.onClickedOk.emit({});
        this.visible = false;
    }
}