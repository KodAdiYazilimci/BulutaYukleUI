import { Component, ViewChild, OnInit } from "@angular/core";
import { ContextMenuComponent } from '../contextmenu/component.contextmenu';

import { GridItemModel } from "../../models/model.gridItem";
import { PermissionModel } from 'src/app/models/model.permission';
import { ContextMenuItemModel } from 'src/app/models/model.contextmenuitem';
import { ItemTypes } from "../../util/util.itemtypes";
import { CommentComponent } from '../comment/component.comment';
import { CommentItemModel } from "../../models/model.commentitem";

@Component({
    selector: "grid",
    templateUrl: "./component.grid.html",
    styleUrls: ["./component.grid.css"]
})
export class GridComponent implements OnInit {

    @ViewChild(ContextMenuComponent, { static: true })
    private contextMenu: ContextMenuComponent;

    private selectedItemType: number;
    private selectedItemId: number;

    @ViewChild(CommentComponent, { static: true })
    private commentsWindow: CommentComponent;

    public diskId = 99;
    public gridItems: Array<GridItemModel>;

    constructor() {


    }

    ngOnInit(): void {
        this.gridItems = new Array<GridItemModel>();

        let item: GridItemModel = new GridItemModel();
        item.checked = false;
        item.itemType = ItemTypes.folder();
        item.itemId = 393;
        item.size = "393,5 KB";
        item.name = "test";
        item.createDate = "18.08.2020 18:56:14";
        item.updateDate = "19.08.2020 18:50:00";
        item.logo = "/assets/images/folder.png";

        item.permissions = new Array<PermissionModel>();

        let permission1 = new PermissionModel();
        permission1.logo = "/assets/images/person.png";
        permission1.title = "Full";
        item.permissions.push(permission1);

        let permission2 = new PermissionModel();
        permission2.logo = "/assets/images/search.png";
        permission2.title = "Read";
        item.permissions.push(permission2);

        let permission3 = new PermissionModel();
        permission3.logo = "/assets/images/upload.png";
        permission3.title = "Create";
        item.permissions.push(permission3);

        let permission4 = new PermissionModel();
        permission4.logo = "/assets/images/delete.png";
        permission4.title = "Delete";
        item.permissions.push(permission4);

        this.gridItems.push(item);
    }

    public showContextMenu(event: any, itemType: number, itemId: number): void {

        console.log(itemType);
        this.selectedItemType = itemType;
        this.selectedItemId = itemId;

        this.contextMenu.visible = true;
        this.contextMenu.marginLeft = event.x + "px";
        this.contextMenu.marginTop = event.y + "px";

        let contextMenuItems: Array<ContextMenuItemModel> = new Array<ContextMenuItemModel>();
        let item: ContextMenuItemModel = new ContextMenuItemModel();
        item.index = 0;
        item.splitted = true;
        item.text = "Test";
        item.logo = "/assets/images/upload.png";
        contextMenuItems.push(item);

        let contextMenuTitle: string = ""
        if (itemType == ItemTypes.folder()) {
            contextMenuTitle = "Klasör Seçenekleri";
        } else if (itemType == ItemTypes.disk()) {
            contextMenuTitle = "Disk Seçenekleri";
        } else if (itemType == ItemTypes.file()) {
            contextMenuTitle = "Dosya Seçenekleri";
        }

        this.contextMenu.fillContextMenu(contextMenuTitle, contextMenuItems);

        this.contextMenu.onItemClickedEvent.subscribe(e => this.onContextMenuItemClicked(e));

        event.preventDefault();
    }

    public hideContextMenu(): void {
        this.contextMenu.visible = false;
    }

    public onContextMenuItemClicked(item: ContextMenuItemModel): void {
        if (item.index == 0) {
            let title: string = "";
            if (this.selectedItemType == ItemTypes.folder()) {
                title = "Klasör Yorumları";
            } else if (this.selectedItemType == ItemTypes.file()) {
                title = "Dosya Yorumları";
            } else if (this.selectedItemType == ItemTypes.disk()) {
                title = "Disk Yorumları";
            }

            let comments: Array<CommentItemModel> = new Array<CommentItemModel>();
            let comment: CommentItemModel = new CommentItemModel();
            comment.name = "serkancamur@gmal.com";
            comment.logo = "/assets/images/person.png";
            comment.date = "26.08.2020";
            comment.time = "10:06";
            comment.comment = "deneme";
            comments.push(comment);

            this.commentsWindow.show(title, this.selectedItemType, this.selectedItemId, comments);
        }
        this.contextMenu.visible = false;
    }
}