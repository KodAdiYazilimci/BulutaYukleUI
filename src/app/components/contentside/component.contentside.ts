import { Component, ViewChild, OnInit, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from "@angular/core";
import { GridComponent } from '../grid/component.grid';
import { FolderPathComponent } from '../folderpath/component.folderpath';
import { DiskService } from 'src/app/services/services.disk';
import { ContentModel } from 'src/app/models/model.content';
import { Router } from '@angular/router';
import { GridItemModel } from 'src/app/models/model.gridItem';
import { ItemTypes } from 'src/app/util/util.itemtypes';
import { FolderService } from 'src/app/services/services.folder';
import { DialogInfoComponent } from "../dialog/component.dialoginfo";

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

    private infoDialog: ComponentRef<DialogInfoComponent> = null;

    public width: string = "";

    constructor(private _router: Router,
        private _viewContainerRef: ViewContainerRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
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
            } else if (ex.status == 400) {
                if (this.infoDialog != null) {
                    this.infoDialog.destroy();
                }
                this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                this.infoDialog.instance.show("Hata", ex.error.errorMessage);
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
            } else if (ex.status == 400) {
                if (this.infoDialog != null) {
                    this.infoDialog.destroy();
                }
                this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                this.infoDialog.instance.show("Hata", ex.error.errorMessage);
            }
        }
    }

}