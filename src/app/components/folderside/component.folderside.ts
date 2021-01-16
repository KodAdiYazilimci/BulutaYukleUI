import { Component, OnInit, EventEmitter, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from "@angular/core";
import { DiskService } from 'src/app/services/services.disk';
import { DiskModel } from 'src/app/models/model.disk';
import { Router } from '@angular/router';
import { DialogInfoComponent } from "../dialog/component.dialoginfo";

@Component({
    selector: "folderside",
    templateUrl: "./component.folderside.html",
    styleUrls: ["./component.folderside.css"],
    providers: [DiskService]
})
export class FolderSideComponent implements OnInit {
    private infoDialog: ComponentRef<DialogInfoComponent> = null;

    public data: Array<DiskModel>;

    public onDiskOpened: EventEmitter<number> = new EventEmitter<number>();
    public onDragSideMouseDown: EventEmitter<any> = new EventEmitter<any>();
    public onDragSideMouseUp: EventEmitter<any> = new EventEmitter<any>();
    public onDragSideMouseMove: EventEmitter<any> = new EventEmitter<any>();

    public width: string = "";

    constructor(
        private _router: Router,
        private _viewContainerRef: ViewContainerRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _diskService: DiskService) {
    }

    async ngOnInit() {
        try {
            this.data = await this._diskService.getDisks();
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

    public openDisk(diskId: number): void {
        this.onDiskOpened.emit(diskId);
    }

    public mouseDown(event: any) {
        this.onDragSideMouseDown.emit(event);
    }
    public mouseMove(event: any) {
        this.onDragSideMouseMove.emit(event);
    }
    public mouseUp(event: any) {
        this.onDragSideMouseUp.emit(event);
    }
}