import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { ContextMenuItemModel } from "../../models/model.contextmenuitem";

@Component({
    selector: "contextmenu",
    templateUrl: "./component.contextmenu.html",
    styleUrls: ["./component.contextmenu.css"]
})
export class ContextMenuComponent implements OnInit {

    public visible: boolean;
    public marginLeft: string;
    public marginTop: string;

    public items: Array<ContextMenuItemModel>;
    public title: string;

    @Output()
    public onItemClickedEvent: EventEmitter<ContextMenuItemModel> = new EventEmitter<ContextMenuItemModel>();

    constructor() { }

    ngOnInit(): void {
        
    }

    public fillContextMenu(title: string, items: Array<ContextMenuItemModel>): void {
        this.items = items;
        this.title = title;
    }

    public onItemClicked(item: ContextMenuItemModel): void {
        this.onItemClickedEvent.emit(item);
    }
}