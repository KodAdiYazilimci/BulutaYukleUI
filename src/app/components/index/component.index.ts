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

    private dragSideMouseDowned: boolean = false;

    constructor(private _router: Router) { }

    ngOnInit(): void {
        this.folderSide.onDiskOpened.subscribe(async event => await this.onDiskOpened(event));
        this.folderSide.onDragSideMouseDown.subscribe(event => {
            this.dragSideMouseDowned = true;
        });
        //event.pageX < (window.innerWidth - parseFloat(this.folderSide.width.replace("px", ""))-parseFloat(this.contentSide.width.replace("px","")))
        this.folderSide.onDragSideMouseMove.subscribe(event => {
            if (this.dragSideMouseDowned) {
                this.folderSide.width = event.pageX + "px";
                this.contentSide.width = (window.innerWidth - parseFloat(this.contentSide.width.replace("px", "")) - event.pageX) + "px";
            }
        });
        this.folderSide.onDragSideMouseUp.subscribe(event => {
            this.dragSideMouseDowned = false;
        });
    }

    private async onDiskOpened(diskId: number) {
        try {
            await this.contentSide.loadDiskContent(diskId);
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

    public mouseUp(event: any) {
        this.folderSide.mouseUp(event);
    }
    public mouseMove(event: any) {
        this.folderSide.mouseMove(event);
    }
    public mouseDown(event: any) {
        // this.folderSide.mouseDown(event);
    }
}