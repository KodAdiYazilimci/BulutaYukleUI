import { Component } from "@angular/core";
import { HistoryItemModel } from "../../models/model.historyitem";

@Component({
    selector: "history",
    templateUrl: "./component.history.html",
    styleUrls: ["./component.history.css"]
})
export class HistoryComponent {

    public title: string;
    public visible: boolean;
    public items: Array<HistoryItemModel> = new Array<HistoryItemModel>();

    public marginLeft: string = "33%";
    public marginTop: string = "5%";
    public mouseDowned: boolean = false;
    
    constructor() { }

    public show(title: string, items: Array<HistoryItemModel>): void {
        this.title = title;
        this.items = items;
        this.visible = true;
    }

    public hide(): void {
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