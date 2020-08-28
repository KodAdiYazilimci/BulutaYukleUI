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

    constructor(
        private _router: Router,
        private _diskService: DiskService) {
    }

    async ngOnInit() {
        try {
            this.data = (await this._diskService.getDisks()).disks;
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
            console.log(JSON.stringify(ex));
        }
    }

    public openDisk(diskId: number): void {
        this.onDiskOpened.emit(diskId);
    }
}