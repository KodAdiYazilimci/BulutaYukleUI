import { Component, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "dialogyesno",
    templateUrl: "./component.dialogyesno.html",
    styleUrls: ["./component.dialogyesno.css"]
})
export class DialogYesNoComponent {
    public visible: boolean;
    public title: string = "";
    public message: string = "";

    @Output()
    public onYesClicked: EventEmitter<{}> = new EventEmitter<{}>();

    @Output()
    public onNoClicked: EventEmitter<{}> = new EventEmitter<{}>();

    constructor() { }

    public show(title: string, message: string): void {
        this.title = title;
        this.message = message;
        this.visible = true;
    }
    public hide(): void {
        this.visible = false;
    }

    public onYes(): void {
        this.visible = false;
        this.onYesClicked.emit({});
    }
    public onNo(): void {
        this.visible = false;
        this.onNoClicked.emit({});
    }
}