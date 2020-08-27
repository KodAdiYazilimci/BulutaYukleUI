import { Component, ViewChild } from "@angular/core";
import { GridComponent } from '../grid/component.grid';
import { FolderPathComponent } from '../folderpath/component.folderpath';
import { DiskService } from 'src/app/services/services.disk';
import { ContentModel } from 'src/app/models/model.content';

@Component({
    selector: "contentside",
    templateUrl: "./component.contentside.html",
    styleUrls: ["./component.contentside.css"],
    providers: [DiskService]
})
export class ContentSideComponent {

    @ViewChild(GridComponent, { static: true })
    private grid: GridComponent;

    @ViewChild(FolderPathComponent, { static: true })
    private pathBar: FolderPathComponent;

    constructor(private _diskService: DiskService) { }

    public async loadDiskContent(diskId: number) {
        console.log("3:Content Executed");
        let content: ContentModel = await this._diskService.getDiskContent(diskId);

        this.pathBar.loadPathBar(content.location);
        this.grid.loadGridData(content);
    }
}