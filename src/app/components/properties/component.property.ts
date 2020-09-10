import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "property",
    templateUrl: "./component.property.html",
    styleUrls: ["./component.property.css"]
})
export class PropertyComponent {
    public visible: boolean = false;
    public title: string = "";
    public logo: string = "";
    public name: string = "";
    public type: string = "";
    public path: string = "";
    public size: string = "";
    public content: string = "";
    public crypted: string = "";
    public access: string = "";
    public createDate: string = "";
    public creatorUser: string = "";
    public modifyDate: string = "";
    public modifierUser: string = "";

    @Output()
    public onClickedOk: EventEmitter<string> = new EventEmitter<string>();

    public marginLeft: string = "33%";
    public marginTop: string = "5%";
    public mouseDowned: boolean = false;

    constructor() { }

    public show(title: string, logo: string, name: string): void {
        this.title = title;
        this.logo = logo;
        this.name = name;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public Ok(): void {
        this.onClickedOk.emit(this.name);
        this.visible = false;
    }

    public mouseDown(event: any) {
        this.mouseDowned = true;
    }
    public mouseMove(event: any) {
        if (this.mouseDowned == true) {
            this.marginLeft = event.pageX + "px";
            this.marginTop = event.pageY + "px";
        }
    }
    public mouseUp(event: any) {
        this.mouseDowned = false;
    }
}