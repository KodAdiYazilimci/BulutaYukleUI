import { Component, ViewChild, OnInit } from "@angular/core";
import { GridComponent } from '../grid/component.grid';
import { FolderPathComponent } from '../folderpath/component.folderpath';
import { DiskService } from 'src/app/services/services.disk';
import { ContentModel } from 'src/app/models/model.content';
import { Router } from '@angular/router';
import { GridItemModel } from 'src/app/models/model.gridItem';
import { ItemTypes } from 'src/app/util/util.itemtypes';
import { FolderService } from 'src/app/services/services.folder';

@Component({
    selector: "contentside",
    templateUrl: "./component.contentside.html",
    styleUrls: ["./component.contentside.css"],
    providers: [DiskService, FolderService]
})
export class ContentSideComponent implements OnInit {

    @ViewChild(GridComponent, { static: true })
    private grid: GridComponent;

    @ViewChild(FolderPathComponent, { static: true })
    private pathBar: FolderPathComponent;

    public width: string = "";

    constructor(private _router: Router,
        private _diskService: DiskService,
        private _folderService: FolderService) { }

    ngOnInit() {
        this.grid.onChangedPath.subscribe((event: Array<GridItemModel>) => {
            this.pathBar.loadPathBar(event);
        });
        this.pathBar.onClickedPath.subscribe(async (event: GridItemModel) => {
            if (event.type == ItemTypes.disk()) {
                await this.loadDiskContent(event.id);
            } else if (event.type == ItemTypes.folder()) {
                await this.loadFolderContent(event.id);
            }
        });
    }

    public async loadDiskContent(diskId: number) {
        try {
            let content: ContentModel = await this._diskService.getDiskContent(diskId);
            this.pathBar.loadPathBar(content.location);
            this.grid.loadGridData(diskId, null, content);
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

    public async loadFolderContent(folderId: number) {
        try {
            let content: ContentModel = await this._folderService.getFolderContent(folderId);
            this.pathBar.loadPathBar(content.location);
            this.grid.loadGridData(null, folderId, content);
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

}