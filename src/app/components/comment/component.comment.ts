import { Component } from "@angular/core";
import { CommentItemModel } from "../../models/model.commentitem";

@Component({
    selector: "comment",
    templateUrl: "./component.comment.html",
    styleUrls: ["./component.comment.css"]
})
export class CommentComponent {

    public title: string;
    public itemType: number;
    public itemId: number;
    public visible: boolean;

    public formText: string;

    public comments: Array<CommentItemModel> = new Array<CommentItemModel>();

    constructor() { }

    public show(title: string, itemType: number, itemId: number, comments: Array<CommentItemModel>): void {
        this.title = title;
        this.itemType = itemType;
        this.itemId = itemId;
        this.comments = comments;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public send(): void {
        let commentitem: CommentItemModel = new CommentItemModel();
        commentitem.comment = this.formText;
        commentitem.name = "serkancamur@gmail.com";
        commentitem.logo = "/assets/images/person.png";
        commentitem.date = new Date().getDate().toLocaleString();
        commentitem.time = new Date().getTime().toLocaleString();
        this.comments.push(commentitem);

        this.formText = "";
    }
}