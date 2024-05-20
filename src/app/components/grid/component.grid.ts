import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef, EventEmitter } from "@angular/core";
import { ContextMenuComponent } from '../contextmenu/component.contextmenu';

import { ContentModel } from "../../models/model.content";
import { PermissionModel } from 'src/app/models/model.permission';
import { ContextMenuItemModel } from 'src/app/models/model.contextmenuitem';
import { ItemTypes } from "../../util/util.itemtypes";
import { ContextMenuTypes } from "../../util/util.contextmenutypes";
import { CommentComponent } from '../comment/component.comment';
import { CommentItemModel } from "../../models/model.commentitem";
import { HistoryComponent } from '../history/component.history';
import { HistoryItemModel } from 'src/app/models/model.historyitem';
import { PermissionComponent } from '../permission/component.permission';
import { PropertyComponent } from '../properties/component.property';
import { DialogYesNoComponent } from '../dialog/component.dialogyesno';
import { DialogReadOnlyInputComponent } from '../dialog/component.dialogreadonlyinput';
import { DialogInputComponent } from '../dialog/component.dialoginput';
import { DialogInfoComponent } from '../dialog/component.dialoginfo';
import { DialogPasswordConfirmComponent } from '../dialog/component.dialogpasswordconfirm';
import { PasswordConfirmModel } from 'src/app/models/model.passwordconfirm';
import { DiskService } from 'src/app/services/services.disk';
import { DialogUploadComponent } from '../dialog/component.dialogupload';
import { async } from 'rxjs/internal/scheduler/async';
import { FileUploadModel } from 'src/app/models/model.fileupload';
import { ServiceResult } from 'src/app/models/model.serviceresult';
import { Router } from '@angular/router';
import { FolderService } from 'src/app/services/services.folder';
import { PropertyModel } from 'src/app/models/model.property';
import { FileService } from 'src/app/services/services.file';
import { DialogPasswordInputComponent } from '../dialog/component.dialogpasswordinput';
import { GridItemModel } from 'src/app/models/model.gridItem';
import { ContentService } from 'src/app/services/services.content';

@Component({
    selector: "grid",
    templateUrl: "./component.grid.html",
    styleUrls: ["./component.grid.css"],
    providers: [ContentService, DiskService, FileService, FolderService]
})
export class GridComponent implements OnInit {
    private selectedItemType: number;
    private selectedItemId: number;

    private movingFolders: Array<GridItemModel> = new Array<GridItemModel>();
    private movingFiles: Array<GridItemModel> = new Array<GridItemModel>();

    private copyingFolders: Array<GridItemModel> = new Array<GridItemModel>();
    private copyingFiles: Array<GridItemModel> = new Array<GridItemModel>();

    public currentDiskId: number = 0;
    public currentFolderId: number = 0;
    public content: ContentModel;

    private checkedItems: Array<GridItemModel> = new Array<GridItemModel>();

    public onChangedPath: EventEmitter<Array<GridItemModel>> = new EventEmitter<Array<GridItemModel>>();

    private contextMenu: ComponentRef<ContextMenuComponent> = null;
    private commentsWindow: ComponentRef<CommentComponent> = null;
    private historiesWindow: ComponentRef<HistoryComponent> = null;
    private permissionsWindow: ComponentRef<PermissionComponent> = null;
    private propertiesWindow: ComponentRef<PropertyComponent> = null;
    private yesNoDialog: ComponentRef<DialogYesNoComponent> = null;
    private readonlyDialog: ComponentRef<DialogReadOnlyInputComponent> = null;
    private inputDialog: ComponentRef<DialogInputComponent> = null;
    private infoDialog: ComponentRef<DialogInfoComponent> = null;
    private passwordConfirmDialog: ComponentRef<DialogPasswordConfirmComponent> = null;
    private passwordInputDialog: ComponentRef<DialogPasswordInputComponent> = null;
    private uploadDialog: ComponentRef<DialogUploadComponent> = null;

    constructor(private _router: Router,
        private _viewContainerRef: ViewContainerRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _contentService: ContentService,
        private _diskService: DiskService,
        private _fileService: FileService,
        private _folderService: FolderService) { }

    ngOnInit(): void {
        this.content = new ContentModel();
    }
    private mouseDowned: boolean = false;
    private mouseDownedColumnIndex = -1;
    public firstColumnWidth: string = "500px";
    public secondColumnWidth: string = "150px";
    public thirdColumnWidth: string = "150px";
    public fourthColumnWidth: string = "150px";

    public mouseDownGridColumn(event: any, index: number, width: number) {
        this.mouseDowned = true;
        this.mouseDownedColumnIndex = index;
        switch (index) {
            case 0: this.firstColumnWidth = width + "px"; break;
            case 1: this.secondColumnWidth = width + "px"; break;
            case 2: this.thirdColumnWidth = width + "px"; break;
            case 3: this.fourthColumnWidth = width + "px"; break;
        }
    }

    public mouseMove(event: any) {
        if (this.mouseDowned) {
            if (this.mouseDownedColumnIndex == 0) {
                this.firstColumnWidth = (event.pageX - parseFloat(this.firstColumnWidth.replace("px", "")) + window.screenX) + "px";
            } else if (this.mouseDownedColumnIndex == 1) {
                this.secondColumnWidth = (event.pageX - parseFloat(this.secondColumnWidth.replace("px", "")) + window.screenX) + "px";
            } else if (this.mouseDownedColumnIndex == 2) {
                this.thirdColumnWidth = (event.pageX - parseFloat(this.thirdColumnWidth.replace("px", "")) + window.screenX) + "px";
            } else if (this.mouseDownedColumnIndex == 3) {
                this.fourthColumnWidth = (event.pageX - parseFloat(this.fourthColumnWidth.replace("px", "")) + window.screenX) + "px";
            }
        }

        if (this.commentsWindow != null) {
            this.commentsWindow.instance.mouseMove(event);
        }
        if (this.historiesWindow != null) {
            this.historiesWindow.instance.mouseMove(event);
        }
        if (this.infoDialog != null) {
            this.infoDialog.instance.mouseMove(event);
        }
        if (this.inputDialog != null) {
            this.inputDialog.instance.mouseMove(event);
        }
        if (this.yesNoDialog != null) {
            this.yesNoDialog.instance.mouseMove(event);
        }
        if (this.uploadDialog != null) {
            this.uploadDialog.instance.mouseMove(event);
        }
        if (this.readonlyDialog != null) {
            this.readonlyDialog.instance.mouseMove(event);
        }
        if (this.passwordInputDialog != null) {
            this.passwordInputDialog.instance.mouseMove(event);
        }
        if (this.passwordConfirmDialog != null) {
            this.passwordConfirmDialog.instance.mouseMove(event);
        }
        if (this.permissionsWindow != null) {
            this.permissionsWindow.instance.mouseMove(event);
        }
        if (this.propertiesWindow != null) {
            this.propertiesWindow.instance.mouseMove(event);
        }
    }
    public mouseUp(event: any) {
        this.mouseDowned = false;

        if (this.commentsWindow != null) {
            this.commentsWindow.instance.mouseUp(event);
        }
        if (this.historiesWindow != null) {
            this.historiesWindow.instance.mouseUp(event);
        }
        if (this.infoDialog != null) {
            this.infoDialog.instance.mouseUp(event);
        }
        if (this.inputDialog != null) {
            this.inputDialog.instance.mouseUp(event);
        }
        if (this.yesNoDialog != null) {
            this.yesNoDialog.instance.mouseUp(event);
        }
        if (this.uploadDialog != null) {
            this.uploadDialog.instance.mouseUp(event);
        }
        if (this.readonlyDialog != null) {
            this.readonlyDialog.instance.mouseUp(event);
        }
        if (this.passwordInputDialog != null) {
            this.passwordInputDialog.instance.mouseUp(event);
        }
        if (this.passwordConfirmDialog != null) {
            this.passwordConfirmDialog.instance.mouseUp(event);
        }
        if (this.permissionsWindow != null) {
            this.permissionsWindow.instance.mouseUp(event);
        }
        if (this.propertiesWindow != null) {
            this.propertiesWindow.instance.mouseUp(event);
        }
    }

    public loadGridData(diskId: number, folderId: number, content: ContentModel) {
        this.currentDiskId = diskId;
        this.currentFolderId = folderId;
        this.content = content;
        this.checkedItems = new Array<GridItemModel>();
    }

    private async refreshGrid(): Promise<void> {
        try {
            if (this.currentDiskId != null) {
                this.content = await this._diskService.getDiskContent(this.currentDiskId);
                this.selectedItemType = ItemTypes.disk();
                this.selectedItemId = this.currentDiskId;
            } else if (this.currentFolderId != null) {
                this.content = await this._folderService.getFolderContent(this.currentFolderId);
                this.selectedItemType = ItemTypes.folder();
                this.selectedItemId = this.currentFolderId;
            }
            this.checkedItems = new Array<GridItemModel>();
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

    private checkedAll: boolean = false;

    public setCheckedAll() {
        this.checkedItems = new Array<GridItemModel>();
        this.content.folders.forEach(item => {
            if (this.checkedAll) {
                item.checked = false;
                const index = this.checkedItems.indexOf(item);
                if (index > -1) {
                    this.checkedItems.splice(index, 1);
                }
            } else {
                item.checked = true;
                this.checkedItems.push(item);
            }
        });
        this.content.files.forEach(item => {
            if (this.checkedAll) {
                item.checked = false;
                const index = this.checkedItems.indexOf(item);
                if (index > -1) {
                    this.checkedItems.splice(index, 1);
                }
            } else {
                item.checked = true;
                this.checkedItems.push(item);
            }
        });
        this.checkedAll = !this.checkedAll;
    }

    public setChecked(item: GridItemModel) {
        if (item.checked == null || item.checked == undefined) {
            item.checked = true;
            this.checkedItems.push(item);
        } else {
            item.checked = !item.checked;

            if (!item.checked) {
                const index = this.checkedItems.indexOf(item);
                if (index > -1) {
                    this.checkedItems.splice(index, 1);
                }
            } else {
                this.checkedItems.push(item);
            }
        }
    }

    public async showContextMenu(event: any, type: number, id: number, inside: boolean) {
        console.log(this.checkedItems);
        this.selectedItemType = type;
        this.selectedItemId = id;
        if (type == null) {
            if (this.currentDiskId != null) {
                this.selectedItemType = ItemTypes.disk();
                this.selectedItemId = this.currentDiskId;
            } else if (this.currentFolderId != null) {
                this.selectedItemType = ItemTypes.folder();
                this.selectedItemId = this.currentFolderId;
            }
        }

        if (this.contextMenu != null) {
            this.contextMenu.destroy();
        }
        this.contextMenu = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(ContextMenuComponent));

        try {
            this.contextMenu.instance.visible = true;
            this.contextMenu.instance.marginLeft = event.x + "px";
            this.contextMenu.instance.marginTop = event.y + "px";

            let contextMenuTitle: string = ""
            let contextMenuItems: Array<ContextMenuItemModel> = null;

            if (this.selectedItemType == ItemTypes.folder()) {
                contextMenuTitle = "Klasör Seçenekleri";
                contextMenuItems = await this._folderService.getContextMenu(this.selectedItemId, inside);
            } else if (this.selectedItemType == ItemTypes.disk()) {
                contextMenuTitle = "Disk Seçenekleri";
                contextMenuItems = await this._diskService.getContextMenu(this.selectedItemId, inside);
            } else if (this.selectedItemType == ItemTypes.file()) {
                contextMenuTitle = "Dosya Seçenekleri";
                contextMenuItems = await this._fileService.getContextMenu(this.selectedItemId);
            }

            this.contextMenu.instance.show(contextMenuTitle, contextMenuItems);
            this.contextMenu.instance.onItemClickedEvent.subscribe(e => this.onContextMenuItemClicked(e));
            event.preventDefault();
        } catch (ex) {
            this.contextMenu.destroy();
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

    public hideContextMenu(): void {
        if (this.contextMenu != null) {
            this.contextMenu.instance.hide();
        }
    }

    public async openFolder(folderId: number) {
        this.content = await this._folderService.getFolderContent(folderId);
        this.currentFolderId = folderId;
        this.currentDiskId = null;
        this.selectedItemId = folderId;
        this.selectedItemType = ItemTypes.folder();
        this.checkedItems = new Array<GridItemModel>();
        this.onChangedPath.emit(this.content.location);
    }

    public async onContextMenuItemClicked(item: ContextMenuItemModel) {
        try {
            if (item.index == ContextMenuTypes.Cut()) {
                this.movingFiles = new Array<GridItemModel>();
                this.movingFolders = new Array<GridItemModel>();
                this.copyingFiles = new Array<GridItemModel>();
                this.copyingFolders = new Array<GridItemModel>();

                let currentSelected: boolean = false;
                this.content.folders.forEach(folder => {
                    if (folder.checked) {
                        this.movingFolders.push(folder);
                        if (this.selectedItemType == ItemTypes.folder() && folder.id == this.selectedItemId) {
                            currentSelected = true;
                        }
                    }
                });
                this.content.files.forEach(file => {
                    if (file.checked) {
                        this.movingFiles.push(file);
                        if (this.selectedItemType == ItemTypes.file() && file.id == this.selectedItemId) {
                            currentSelected = true;
                        }
                    }
                });
                if (currentSelected == false) {
                    if (this.selectedItemType == ItemTypes.folder()) {
                        let currentFocusedFolder: GridItemModel = new GridItemModel();
                        currentFocusedFolder.id = this.selectedItemId;
                        currentFocusedFolder.type = ItemTypes.folder();
                        this.movingFolders.push(currentFocusedFolder);
                    } else if (this.selectedItemType == ItemTypes.file()) {
                        let currentFocusedFile: GridItemModel = new GridItemModel();
                        currentFocusedFile.id = this.selectedItemId;
                        currentFocusedFile.type = ItemTypes.file();
                        this.movingFiles.push(currentFocusedFile);
                    }
                }
            } else if (item.index == ContextMenuTypes.Copy()) {
                this.movingFiles = new Array<GridItemModel>();
                this.movingFolders = new Array<GridItemModel>();
                this.copyingFiles = new Array<GridItemModel>();
                this.copyingFolders = new Array<GridItemModel>();

                let currentSelected: boolean = false;
                this.content.folders.forEach(folder => {
                    if (folder.checked) {
                        this.copyingFolders.push(folder);
                        if (this.selectedItemType == ItemTypes.folder() && folder.id == this.selectedItemId) {
                            currentSelected = true;
                        }
                    }
                });
                this.content.files.forEach(file => {
                    if (file.checked) {
                        this.copyingFiles.push(file);
                        if (this.selectedItemType == ItemTypes.file() && file.id == this.selectedItemId) {
                            currentSelected = true;
                        }
                    }
                });
                if (currentSelected == false) {
                    if (this.selectedItemType == ItemTypes.folder()) {
                        let currentFocusedFolder: GridItemModel = new GridItemModel();
                        currentFocusedFolder.id = this.selectedItemId;
                        currentFocusedFolder.type = ItemTypes.folder();
                        this.copyingFolders.push(currentFocusedFolder);
                    } else if (this.selectedItemType == ItemTypes.file()) {
                        let currentFocusedFile: GridItemModel = new GridItemModel();
                        currentFocusedFile.id = this.selectedItemId;
                        currentFocusedFile.type = ItemTypes.file();
                        this.copyingFiles.push(currentFocusedFile);
                    }
                }
            } else if (item.index == ContextMenuTypes.Paste()) {
                if (this.copyingFolders.length > 0 || this.copyingFiles.length > 0) {
                    if (this.selectedItemType == ItemTypes.disk()) {
                        await this._contentService.copyItemsToDisk(this.copyingFolders, this.copyingFiles, this.selectedItemId);
                    } else if (this.selectedItemType == ItemTypes.folder()) {
                        await this._contentService.copyItemsToFolder(this.copyingFolders, this.copyingFiles, this.selectedItemId);
                    }
                    this.copyingFiles = new Array<GridItemModel>();
                    this.copyingFolders = new Array<GridItemModel>();
                } else if (this.movingFolders.length > 0 || this.movingFiles.length > 0) {
                    if (this.selectedItemType == ItemTypes.disk()) {
                        await this._contentService.moveItemsToDisk(this.movingFolders, this.movingFiles, this.selectedItemId);
                    } else if (this.selectedItemType == ItemTypes.folder()) {
                        await this._contentService.moveItemsToFolder(this.movingFolders, this.movingFiles, this.selectedItemId);
                    }
                    this.movingFiles = new Array<GridItemModel>();
                    this.movingFolders = new Array<GridItemModel>();
                }
                this.refreshGrid();
            } else if (item.index == ContextMenuTypes.Delete()) {
                if (this.yesNoDialog != null) {
                    this.yesNoDialog.destroy();
                }
                this.yesNoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogYesNoComponent));
                this.yesNoDialog.instance.onYesClicked.subscribe(async event => {
                    if (this.checkedItems.length > 0) {
                        for (var item of this.checkedItems) {
                            if (item.type == ItemTypes.folder()) {
                                await this._folderService.deleteFolder(item.id);
                            } else if (item.type == ItemTypes.file()) {
                                await this._fileService.deleteFile(item.id);
                            }
                        }
                    } else {
                        if (this.selectedItemType == ItemTypes.folder()) {
                            await this._folderService.deleteFolder(this.selectedItemId);
                        }
                        if (this.selectedItemType == ItemTypes.file()) {
                            await this._fileService.deleteFile(this.selectedItemId);
                        }
                    }
                    await this.refreshGrid();
                });
                if (this.selectedItemType == ItemTypes.folder()) {
                    this.yesNoDialog.instance.show("Onay", "Klasörü silmek istediğinize emin misiniz?");
                } else if (this.selectedItemType == ItemTypes.file()) {
                    this.yesNoDialog.instance.show("Onay", "Dosyayı silmek istediğinize emin misiniz?");
                }
            }
            if (item.index == ContextMenuTypes.Refresh()) {
                await this.refreshGrid();
            } else if (item.index == ContextMenuTypes.Upload()) {
                this.uploadDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogUploadComponent));
                this.uploadDialog.instance.onFileUploaded.subscribe(async (event: FileUploadModel) => {
                    if (event.complete && (event.body as ServiceResult).isSuccess) {
                        await this.refreshGrid();
                    } else if (event.complete) {
                        let error: string = (event.body as ServiceResult).errorMessage;
                        if (this.infoDialog != null) {
                            this.infoDialog.destroy();
                        }
                        this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                        this.infoDialog.instance.show("Hata", error);
                    }
                });
                this.uploadDialog.instance.onFailed.subscribe(event => {
                    if (this.infoDialog != null) {
                        this.infoDialog.destroy();
                    }
                    this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                    this.infoDialog.instance.show("Hata", event);
                });
                if (this.selectedItemType == ItemTypes.disk()) {
                    this.uploadDialog.instance.uploadToDisk(this.selectedItemId);
                } else if (this.selectedItemType == ItemTypes.folder()) {
                    this.uploadDialog.instance.uploadToFolder(this.selectedItemId);
                }
            } else if (item.index == ContextMenuTypes.Comments()) {
                let title: string = "";
                let comments: Array<CommentItemModel> = new Array<CommentItemModel>();

                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Yorumları";
                    comments = await this._folderService.getFolderComments(this.selectedItemId);
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Yorumları";
                    comments = await this._fileService.getFileComments(this.selectedItemId);
                }
                if (this.commentsWindow != null) {
                    this.commentsWindow.destroy();
                }
                this.commentsWindow = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(CommentComponent));
                this.commentsWindow.instance.onSendEmptyText.subscribe(event => {
                    if (this.infoDialog != null) {
                        this.infoDialog.destroy();
                    }
                    this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                    this.infoDialog.instance.show("Uyarı", "Lütfen bir yorum yazınız!");
                });
                this.commentsWindow.instance.show(title, this.selectedItemType, this.selectedItemId, comments);
            } else if (item.index == ContextMenuTypes.History()) {
                let title: string = "";
                let histories: Array<HistoryItemModel> = null;
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Geçmişi";
                    histories = await this._folderService.getFolderHistories(this.selectedItemId);
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Geçmişi";
                    histories = await this._fileService.getFileHistories(this.selectedItemId);
                }
                if (this.commentsWindow != null) {
                    this.commentsWindow.destroy();
                }
                this.historiesWindow = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(HistoryComponent));
                this.historiesWindow.instance.show(title, histories);
            } else if (item.index == ContextMenuTypes.Permissions()) {
                let title: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Yetkileri";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Yetkileri";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Disk Yetkileri";
                }
                if (this.permissionsWindow != null) {
                    this.permissionsWindow.destroy();
                }
                this.permissionsWindow = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(PermissionComponent));
                await this.permissionsWindow.instance.show(this.selectedItemType, this.selectedItemId, title);
            } else if (item.index == ContextMenuTypes.Properties()) {
                let properties: PropertyModel = null;
                let title: string = "";
                let logo: string = "";

                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Özellikleri";
                    logo = "/assets/images/folder.png";
                    properties = await this._folderService.getFolderProperty(this.selectedItemId);
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Özellikleri";
                    logo = "/assets/images/file.png";
                    properties = await this._fileService.getFileProperty(this.selectedItemId);
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Disk Özellikleri";
                    logo = "/assets/images/disk.png";
                }

                this.propertiesWindow = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(PropertyComponent));

                this.propertiesWindow.instance.content = properties.content;
                this.propertiesWindow.instance.createDate = properties.createDate;
                this.propertiesWindow.instance.creatorUser = properties.creatorUser;
                this.propertiesWindow.instance.crypted = properties.crypted;
                this.propertiesWindow.instance.type = properties.type;
                this.propertiesWindow.instance.path = properties.path;
                this.propertiesWindow.instance.modifierUser = properties.modifierUser;
                this.propertiesWindow.instance.modifyDate = properties.modifyDate;
                this.propertiesWindow.instance.access = properties.access;
                this.propertiesWindow.instance.size = properties.size;
                this.propertiesWindow.instance.onClickedOk.subscribe(async event => {
                    if (event.length > 0 && event != properties.name) {
                        if (this.selectedItemType == ItemTypes.folder()) {
                            await this._folderService.renameFolder(this.selectedItemId, event);
                        } else if (this.selectedItemType == ItemTypes.file()) {
                            await this._fileService.renameFile(this.selectedItemId, event);
                        }
                        await this.refreshGrid();
                    } else if (event.length == 0) {
                        let errorMessage: string = "";
                        if (this.selectedItemType == ItemTypes.folder()) {
                            errorMessage = "Klasör adı boş geçilemez!";
                        } else if (this.selectedItemType == ItemTypes.file()) {
                            errorMessage = "Dosya adı boş geçilemez!";
                        }
                        if (this.infoDialog != null) {
                            this.infoDialog.destroy();
                        }
                        this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                        this.infoDialog.instance.show("Uyarı", errorMessage)
                    }
                });
                this.propertiesWindow.instance.show(title, logo, properties.name);
            } else if (item.index == ContextMenuTypes.Share()) {
                if (this.yesNoDialog != null) {
                    this.yesNoDialog.destroy();
                }
                this.yesNoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogYesNoComponent));
                this.yesNoDialog.instance.onYesClicked.subscribe(async event => await this.onAcceptInternetSharing());
                this.yesNoDialog.instance.show("Uyarı", "Seçtiginiz ögeyi/ögeleri internete açik halde paylasmak istediginize emin misiniz?");
            } else if (item.index == ContextMenuTypes.UnShare()) {
                if (this.yesNoDialog != null) {
                    this.yesNoDialog.destroy();
                }
                this.yesNoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogYesNoComponent));
                this.yesNoDialog.instance.onYesClicked.subscribe(async event => await this.onAcceptInternetSharingClosed());
                this.yesNoDialog.instance.show("Uyarı", "Seçtiginiz ögenin/ögelerin internete açık paylaşımını kapatmak istediginize emin misiniz?");
            } else if (item.index == ContextMenuTypes.ShareUrl()) {
                //Burada ne yapılacağı şimdilik belirsiz
            } else if (item.index == ContextMenuTypes.Rename()) {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasörü Yeniden Adlandır";
                    message = "Klasörün yeni adini giriniz:";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Yeniden Adlandır";
                    message = "Dosyanin yeni adini giriniz:";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Diski Yeniden Adlandır";
                    message = "Diskin yeni adini giriniz:";
                }

                if (this.inputDialog != null) {
                    this.inputDialog.destroy();
                }
                this.inputDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInputComponent));
                this.inputDialog.instance.onOkClickedEvent.subscribe(async (event: string) => {
                    if (event.length > 0) {
                        if (this.selectedItemType == ItemTypes.folder()) {
                            await this._folderService.renameFolder(this.selectedItemId, event);
                        } else if (this.selectedItemType == ItemTypes.file()) {
                            await this._fileService.renameFile(this.selectedItemId, event);
                        }
                        await this.refreshGrid();
                    } else {
                        if (this.infoDialog != null) {
                            this.infoDialog.destroy();
                        }
                        this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                        this.infoDialog.instance.show("Uyarı", "Lütfen bir isim belirtiniz!");
                    }
                });
                this.inputDialog.instance.show(title, message, "İsim giriniz..");
            } else if (item.index == ContextMenuTypes.Lock()) {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasörü Kilitle";
                    message = "Klasörü kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Kilitle";
                    message = "Dosyayı kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                }
                if (this.passwordConfirmDialog != null) {
                    this.passwordConfirmDialog.destroy();
                }
                this.passwordConfirmDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogPasswordConfirmComponent));
                this.passwordConfirmDialog.instance.onOkClicked.subscribe(async event => await this.onAcceptLockedItem(event));
                this.passwordConfirmDialog.instance.show(title, message, "Bir parola girin..", "Parolayi tekrar girin..");
            } else if (item.index == ContextMenuTypes.UnLock()) {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Kilidi Kaldır";
                    message = "Klasör kilidini kaldırırsanız diger kullanicilar bu dosya üzerinde islem yapabilecek!";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Kilidi Kaldır";
                    message = "Dosya kilidini kaldırırsanız diger kullanicilar bu dosya üzerinde islem yapabilecek!";
                }
                if (this.passwordInputDialog != null) {
                    this.passwordInputDialog.destroy();
                }
                this.passwordInputDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogPasswordInputComponent));
                this.passwordInputDialog.instance.onOkClicked.subscribe(async event => await this.onAcceptUnLockedItem(event));
                this.passwordInputDialog.instance.show(title, message, "Parolayı girin..");
            } else if (item.index == ContextMenuTypes.NewFolder()) {
                if (this.inputDialog != null) {
                    this.inputDialog.destroy();
                }
                this.inputDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInputComponent));
                this.inputDialog.instance.onOkClickedEvent.subscribe(async (event: string) => {
                    if (event.length > 0) {
                        if (this.selectedItemType == ItemTypes.disk()) {
                            await this._folderService.createFolderOnDisk(this.selectedItemId, event);
                        } else if (this.selectedItemType == ItemTypes.folder()) {
                            await this._folderService.createFolderOnFolder(this.selectedItemId, event);
                        }
                        await this.refreshGrid();
                    } else {
                        if (this.infoDialog != null) {
                            this.infoDialog.destroy();
                        }
                        this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
                        this.infoDialog.instance.show("Uyarı", "Klasör adı boş geçilemez!");
                    }
                });
                this.inputDialog.instance.show("Yeni Klasör", "Oluşturulacak Klasörün Adını Giriniz:", "İsim giriniz..");
            } else if (item.index == ContextMenuTypes.Hide()) {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasörü Gizle";
                    message = "Klasörü diğer kullanıcılara gizlemek istediğinize emin misiniz?";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Gizle";
                    message = "Dosyayı diğer kullanıcılara gizlemek istediğinize emin misiniz?";
                }
                if (this.yesNoDialog != null) {
                    this.yesNoDialog.destroy();
                }
                this.yesNoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogYesNoComponent));
                this.yesNoDialog.instance.onYesClicked.subscribe(async event => {
                    if (this.selectedItemType == ItemTypes.folder()) {
                        await this._folderService.hideFolder(this.selectedItemId);
                    } else if (this.selectedItemType == ItemTypes.file()) {
                        await this._fileService.hideFile(this.selectedItemId);
                    }
                });
                this.yesNoDialog.instance.show(title, message);
            } else if (item.index == ContextMenuTypes.Show()) {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasörü Gizle";
                    message = "Klasörü diğer kullanıcılara göstermek istediğinize emin misiniz?";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Gizle";
                    message = "Dosyayı diğer kullanıcılara göstermek istediğinize emin misiniz?";
                }
                if (this.yesNoDialog != null) {
                    this.yesNoDialog.destroy();
                }
                this.yesNoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogYesNoComponent));
                this.yesNoDialog.instance.onYesClicked.subscribe(async event => {
                    if (this.selectedItemType == ItemTypes.folder()) {
                        await this._folderService.showFolder(this.selectedItemId);
                    } else if (this.selectedItemType == ItemTypes.file()) {
                        await this._fileService.showFile(this.selectedItemId);
                    }
                });
                this.yesNoDialog.instance.show(title, message);
            } else if (item.index == ContextMenuTypes.SendEmail()) {
                //Web servisi hazır değil
            } else if (item.index == ContextMenuTypes.Download()) {
                let foldersToDownload: Array<GridItemModel> = new Array<GridItemModel>();
                let filesToDownload: Array<GridItemModel> = new Array<GridItemModel>();
                let currentSelected: boolean = false;
                this.content.folders.forEach(folder => {
                    if (folder.checked) {
                        foldersToDownload.push(folder);
                        if (this.selectedItemType == ItemTypes.folder() && folder.id == this.selectedItemId) {
                            currentSelected = true;
                        }
                    }
                });
                this.content.files.forEach(file => {
                    if (file.checked) {
                        filesToDownload.push(file);
                        if (this.selectedItemType == ItemTypes.file() && file.id == this.selectedItemId) {
                            currentSelected = true;
                        }
                    }
                });
                if (currentSelected == false) {
                    if (this.selectedItemType == ItemTypes.folder()) {
                        let currentFocusedFolder: GridItemModel = new GridItemModel();
                        currentFocusedFolder.id = this.selectedItemId;
                        currentFocusedFolder.type = ItemTypes.folder();
                        foldersToDownload.push(currentFocusedFolder);
                    } else if (this.selectedItemType == ItemTypes.file()) {
                        let currentFocusedFile: GridItemModel = new GridItemModel();
                        currentFocusedFile.id = this.selectedItemId;
                        currentFocusedFile.type = ItemTypes.file();
                        filesToDownload.push(currentFocusedFile);
                    }
                }
                let data = await this._contentService.downloadItems(foldersToDownload, filesToDownload);
                const url = window.URL.createObjectURL(data);
                var anchor = document.createElement("a");
                anchor.download = "Files.zip";
                anchor.href = url;
                anchor.click();
            }
            this.contextMenu.destroy();
            this.contextMenu = null;
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }
    private async onAcceptLockedItem(model: PasswordConfirmModel) {
        if (model.passwordFirst.length == 0 || model.passwordSecond.length == 0 || model.passwordFirst != model.passwordSecond) {
            if (this.infoDialog != null) {
                this.infoDialog.destroy();
            }
            this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
            this.infoDialog.instance.show("Uyarı", "Girilen parolalar birbirleriyle eslesmiyor!");
        } else {
            if (this.selectedItemType == ItemTypes.folder()) {
                await this._folderService.lockFolder(this.selectedItemId, model.passwordFirst);
            } else if (this.selectedItemType == ItemTypes.file()) {
                await this._fileService.lockFile(this.selectedItemId, model.passwordFirst);
            }
        }
    }
    private async onAcceptUnLockedItem(password: string) {
        if (password.length == 0) {
            if (this.infoDialog != null) {
                this.infoDialog.destroy();
            }
            this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
            this.infoDialog.instance.show("Uyarı", "Bir parola giriniz!");
        } else {
            if (this.selectedItemType == ItemTypes.folder()) {
                await this._folderService.unLockFolder(this.selectedItemId, password);
            } else if (this.selectedItemType == ItemTypes.file()) {
                await this._fileService.unLockFile(this.selectedItemId, password);
            }
        }
    }
    public async onAcceptInternetSharing() {
        let foldersToShare: Array<GridItemModel> = new Array<GridItemModel>();
        let filesToShare: Array<GridItemModel> = new Array<GridItemModel>();

        let currentSelected: boolean = false;
        this.content.folders.forEach(folder => {
            if (folder.checked) {
                foldersToShare.push(folder);
                if (this.selectedItemType == ItemTypes.folder() && folder.id == this.selectedItemId) {
                    currentSelected = true;
                }
            }
        });

        this.content.files.forEach(file => {
            if (file.checked) {
                filesToShare.push(file);
                if (this.selectedItemType == ItemTypes.file() && file.id == this.selectedItemId) {
                    currentSelected = true;
                }
            }
        });

        if (currentSelected == false) {
            if (this.selectedItemType == ItemTypes.folder()) {
                let currentFocusedFolder: GridItemModel = new GridItemModel();
                currentFocusedFolder.id = this.selectedItemId;
                currentFocusedFolder.type = ItemTypes.folder();
                foldersToShare.push(currentFocusedFolder);
            } else if (this.selectedItemType == ItemTypes.file()) {
                let currentFocusedFile: GridItemModel = new GridItemModel();
                currentFocusedFile.id = this.selectedItemId;
                currentFocusedFile.type = ItemTypes.file();
                filesToShare.push(currentFocusedFile);
            }
        }

        let shareUrl: string = await this._contentService.shareItems(foldersToShare, filesToShare);

        if (this.readonlyDialog != null) {
            this.readonlyDialog.destroy();
        }
        this.readonlyDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogReadOnlyInputComponent));
        this.readonlyDialog.instance.show("Paylaşım Bağlantısı", "Asagidaki baglantiyi kullanarak ögeleri sistem kullanicilari disinda internete açik halde paylasabilirsiniz.", shareUrl)
    }
    public async onAcceptInternetSharingClosed() {
        let foldersToUnShare: Array<GridItemModel> = new Array<GridItemModel>();
        let filesToUnShare: Array<GridItemModel> = new Array<GridItemModel>();

        let currentSelected: boolean = false;
        this.content.folders.forEach(folder => {
            if (folder.checked) {
                foldersToUnShare.push(folder);
                if (this.selectedItemType == ItemTypes.folder() && folder.id == this.selectedItemId) {
                    currentSelected = true;
                }
            }
        });

        this.content.files.forEach(file => {
            if (file.checked) {
                filesToUnShare.push(file);
                if (this.selectedItemType == ItemTypes.file() && file.id == this.selectedItemId) {
                    currentSelected = true;
                }
            }
        });
        if (currentSelected == false) {
            if (this.selectedItemType == ItemTypes.folder()) {
                let currentFocusedFolder: GridItemModel = new GridItemModel();
                currentFocusedFolder.id = this.selectedItemId;
                currentFocusedFolder.type = ItemTypes.folder();
                foldersToUnShare.push(currentFocusedFolder);
            } else if (this.selectedItemType == ItemTypes.file()) {
                let currentFocusedFile: GridItemModel = new GridItemModel();
                currentFocusedFile.id = this.selectedItemId;
                currentFocusedFile.type = ItemTypes.file();
                filesToUnShare.push(currentFocusedFile);
            }
        }
        await this._contentService.unShareItems(foldersToUnShare, filesToUnShare);
        if (this.infoDialog != null) {
            this.infoDialog.destroy();
        }
        this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
        this.infoDialog.instance.show("İşlem Sonucu", "Paylaşım internete kapatıldı");
    }
}