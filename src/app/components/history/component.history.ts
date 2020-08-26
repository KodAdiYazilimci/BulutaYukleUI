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

    constructor() { }

    public show(title: string, items: Array<HistoryItemModel>): void {
        this.title = title;
        this.items = items;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }
}