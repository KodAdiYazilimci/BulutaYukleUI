import { Component, OnInit, EventEmitter } from "@angular/core";
import { DiskService } from 'src/app/services/services.disk';
import { DiskModel } from 'src/app/models/model.disk';

@Component({
    selector: "folderside",
    templateUrl: "./component.folderside.html",
    styleUrls: ["./component.folderside.css"],
    providers: [DiskService]
})
export class FolderSideComponent implements OnInit {
    public data: Array<DiskModel>;

    public onDiskOpened: EventEmitter<number> = new EventEmitter<number>();

    constructor(private _diskService: DiskService) {

    }

    async ngOnInit() {
        this.data = (await this._diskService.getDisks()).disks;
    }

    public openDisk(diskId: number): void {
        console.log("1:FolderSide Emitted");
        this.onDiskOpened.emit(diskId);
    }
}