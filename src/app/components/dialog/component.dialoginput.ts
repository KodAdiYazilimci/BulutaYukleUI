import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "dialoginput",
    templateUrl: "./component.dialoginput.html",
    styleUrls: ["./component.dialoginput.css"]
})
export class DialogInputComponent {
    public visible: boolean;
    public title: string;
    public message: string;
    public placeholder: string;
    public value: string = "";

    @Output()
    public onOkClickedEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

    public show(title: string, message: string, placeholder: string) {
        this.title = title;
        this.message = message;
        this.placeholder = placeholder;

        this.visible = true;
    }

    public onOk(): void {
        this.onOkClickedEvent.emit(this.value);
        this.visible = false;
    }

    public hide(): void {
        this.visible = false;
    }
}