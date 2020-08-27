import { Component, ViewChild, OnInit } from "@angular/core";
import { FolderSideComponent } from '../folderside/component.folderside';
import { ContentSideComponent } from '../contentside/component.contentside';

@Component({
    selector: "index",
    templateUrl: "./component.index.html",
    styleUrls: ["./component.index.css"]
})
export class IndexComponent implements OnInit {

    @ViewChild(FolderSideComponent, { static: true })
    private folderSide: FolderSideComponent;

    @ViewChild(ContentSideComponent, { static: true })
    private contentSide: ContentSideComponent;

    constructor() { }

    ngOnInit(): void {
        this.folderSide.onDiskOpened.subscribe(async event => await this.onDiskOpened(event));
    }

    private async onDiskOpened(diskId: number) {
        console.log("2:Index Called");
        await this.contentSide.loadDiskContent(diskId);
    }
}