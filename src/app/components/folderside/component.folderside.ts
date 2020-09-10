import { Component, OnInit, EventEmitter } from "@angular/core";
import { DiskService } from 'src/app/services/services.disk';
import { DiskModel } from 'src/app/models/model.disk';
import { Router } from '@angular/router';

@Component({
    selector: "folderside",
    templateUrl: "./component.folderside.html",
    styleUrls: ["./component.folderside.css"],
    providers: [DiskService]
})
export class FolderSideComponent implements OnInit {
    public data: Array<DiskModel>;

    public onDiskOpened: EventEmitter<number> = new EventEmitter<number>();
    public onDragSideMouseDown: EventEmitter<any> = new EventEmitter<any>();
    public onDragSideMouseUp: EventEmitter<any> = new EventEmitter<any>();
    public onDragSideMouseMove: EventEmitter<any> = new EventEmitter<any>();

    public width: string = "";

    constructor(
        private _router: Router,
        private _diskService: DiskService) {
    }

    async ngOnInit() {
        try {
            this.data = await this._diskService.getDisks();
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
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