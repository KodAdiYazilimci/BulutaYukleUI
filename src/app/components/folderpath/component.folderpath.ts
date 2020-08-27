import { Component } from "@angular/core";
import { GridItemModel } from 'src/app/models/model.gridItem';

@Component({
    selector: "folderpath",
    templateUrl: "./component.folderpath.html",
    styleUrls: ["./component.folderpath.css"]
})
export class FolderPathComponent {
    public paths: Array<GridItemModel>;

    constructor() { }

    public loadPathBar(paths: Array<GridItemModel>): void {
        this.paths = paths;
    }
}