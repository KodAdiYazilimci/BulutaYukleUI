import { Component, ViewChild, OnInit } from "@angular/core";
import { FolderSideComponent } from '../folderside/component.folderside';
import { ContentSideComponent } from '../contentside/component.contentside';
import { Router } from '@angular/router';

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

    constructor(private _router: Router) { }

    ngOnInit(): void {
        this.folderSide.onDiskOpened.subscribe(async event => await this.onDiskOpened(event));
    }

    private async onDiskOpened(diskId: number) {
        try {
            await this.contentSide.loadDiskContent(diskId);
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
            console.log(JSON.stringify(ex));
        }
    }
}