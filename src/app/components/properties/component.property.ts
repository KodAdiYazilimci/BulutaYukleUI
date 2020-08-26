import { Component } from "@angular/core";

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
    public itemType: string = "";
    public location: string = "";
    public size: string = "";
    public content: string = "";
    public crypted: string = "";
    public permissions: string = "";
    public createDate: string = "";
    public creatorUser: string = "";
    public modifyDate: string = "";
    public modifierUser: string = "";

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
        this.visible = false;
    }
}