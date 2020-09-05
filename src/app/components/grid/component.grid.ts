import { Component, ViewChild, OnInit } from "@angular/core";
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

@Component({
    selector: "grid",
    templateUrl: "./component.grid.html",
    styleUrls: ["./component.grid.css"],
    providers: [DiskService, FileService, FolderService]
})
export class GridComponent implements OnInit {
    private selectedItemType: number;
    private selectedItemId: number;

    public currentDiskId: number = 0;
    public currentFolderId: number = 0;
    public content: ContentModel;

    @ViewChild(ContextMenuComponent, { static: true })
    private contextMenu: ContextMenuComponent;

    @ViewChild(CommentComponent, { static: true })
    private commentsWindow: CommentComponent;

    @ViewChild(HistoryComponent, { static: true })
    private historiesWindow: HistoryComponent;

    @ViewChild(PermissionComponent, { static: true })
    private permissionsWindow: PermissionComponent;

    @ViewChild(PropertyComponent, { static: true })
    private propertiesWindow: PropertyComponent;

    @ViewChild(DialogYesNoComponent, { static: true })
    private yesNoDialog: DialogYesNoComponent;

    @ViewChild(DialogReadOnlyInputComponent, { static: true })
    private readonlyDialog: DialogReadOnlyInputComponent;

    @ViewChild(DialogInputComponent, { static: true })
    private inputDialog: DialogInputComponent;

    @ViewChild(DialogInfoComponent, { static: true })
    private infoDialog: DialogInfoComponent;

    @ViewChild(DialogPasswordConfirmComponent, { static: true })
    private passwordConfirmDialog: DialogPasswordConfirmComponent;

    @ViewChild(DialogUploadComponent, { static: true })
    private uploadDialog: DialogUploadComponent;

    constructor(private _router: Router,
        private _diskService: DiskService,
        private _fileService: FileService,
        private _folderService: FolderService) { }

    ngOnInit(): void {
        this.content = new ContentModel();
    }

    public loadGridData(diskId: number, content: ContentModel) {
        this.currentDiskId = diskId;
        this.content = content;
    }

    private async refreshGrid(): Promise<void> {
        try {
            this.content = await this._diskService.getDiskContent(this.currentDiskId);
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

    public async showContextMenu(event: any, type: number, id: number) {
        try {
            this.selectedItemType = type;
            this.selectedItemId = id;

            this.contextMenu.visible = true;
            this.contextMenu.marginLeft = event.x + "px";
            this.contextMenu.marginTop = event.y + "px";

            let contextMenuTitle: string = ""
            let contextMenuItems: Array<ContextMenuItemModel> = null;

            if (type == ItemTypes.folder()) {
                contextMenuTitle = "Klasör Seçenekleri";
                contextMenuItems = await this._folderService.getContextMenu(this.selectedItemId);
            } else if (type == ItemTypes.disk()) {
                contextMenuTitle = "Disk Seçenekleri";
                contextMenuItems = await this._diskService.getContextMenu(this.currentDiskId);
            } else if (type == ItemTypes.file()) {
                contextMenuTitle = "Dosya Seçenekleri";
                contextMenuItems = await this._fileService.getContextMenu(this.selectedItemId);
            }

            this.contextMenu.show(contextMenuTitle, contextMenuItems);
            this.contextMenu.onItemClickedEvent.subscribe(e => this.onContextMenuItemClicked(e));
            event.preventDefault();
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }

    public hideContextMenu(): void {
        this.contextMenu.hide();
    }

    public async onContextMenuItemClicked(item: ContextMenuItemModel) {
        try {
            if (item.index == ContextMenuTypes.Refresh()) {
                await this.refreshGrid();
            } else if (item.index == ContextMenuTypes.Upload()) {
                this.uploadDialog.onFileUploaded.subscribe(async (event: FileUploadModel) => {
                    if (event.complete && (event.body as ServiceResult).isSuccess) {
                        await this.refreshGrid();
                    } else if (event.complete) {
                        let error: string = (event.body as ServiceResult).errorMessage;
                        this.infoDialog.show("Hata", error);
                    }
                });
                this.uploadDialog.onFailed.subscribe(event => {
                    this.infoDialog.show("Hata", event);
                });
                this.uploadDialog.uploadToDisk(this.currentDiskId);
            }
            if (item.index == ContextMenuTypes.Comments()) {
                let title: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Yorumları";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Yorumları";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Disk Yorumları";
                }

                let comments: Array<CommentItemModel> = new Array<CommentItemModel>();
                let comment: CommentItemModel = new CommentItemModel();
                comment.name = "serkancamur@gmal.com";
                comment.logo = "/assets/images/person.png";
                comment.date = "26.08.2020";
                comment.time = "10:06";
                comment.comment = "deneme";
                comments.push(comment);

                this.commentsWindow.show(title, this.selectedItemType, this.selectedItemId, comments);
            } else if (item.index == ContextMenuTypes.History()) {
                let title: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Geçmişi";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Geçmişi";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Disk Geçmişi";
                }

                let histories: Array<HistoryItemModel> = new Array<HistoryItemModel>();
                let historyItem: HistoryItemModel = new HistoryItemModel();
                historyItem.date = new Date().getDate().toLocaleString();
                historyItem.text = "Sanal HDD/Battlefield 4 [Oyunindir.vip].torrent dosyasi olusturuldu.";
                historyItem.logo = "/assets/images/folder.png";
                histories.push(historyItem);

                this.historiesWindow.show(title, histories);
            } else if (item.index == ContextMenuTypes.Permissions()) {
                let title: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasör Yetkileri";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosya Yetkileri";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Disk Yetkileri";
                }

                let groupPermissions: Array<PermissionModel> = new Array<PermissionModel>();
                let userPermissions: Array<PermissionModel> = new Array<PermissionModel>();
                let solidPermissions: Array<PermissionModel> = new Array<PermissionModel>();

                this.permissionsWindow.show(title, groupPermissions, userPermissions, solidPermissions);
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

                this.propertiesWindow.content = properties.content;
                this.propertiesWindow.createDate = properties.createDate;
                this.propertiesWindow.creatorUser = properties.creatorUser;
                this.propertiesWindow.crypted = properties.crypted;
                this.propertiesWindow.type = properties.type;
                this.propertiesWindow.path = properties.path;
                this.propertiesWindow.modifierUser = properties.modifierUser;
                this.propertiesWindow.modifyDate = properties.modifyDate;
                this.propertiesWindow.access = properties.access;
                this.propertiesWindow.size = properties.size;
                this.propertiesWindow.onClickedOk.subscribe(async event => {
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
                        this.infoDialog.show("Uyarı", errorMessage)
                    }
                });
                this.propertiesWindow.show(title, logo, properties.name);
            } else if (item.index == ContextMenuTypes.Share()) {
                this.yesNoDialog.onYesClicked.subscribe(event => this.onAcceptInternetSharing());
                this.yesNoDialog.show("Uyarı", "Seçtiginiz ögeyi/ögeleri internete açik halde paylasmak istediginize emin misiniz?");
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

                this.inputDialog.onOkClickedEvent.subscribe((event: string) => {
                    if (event.length > 0) {

                    } else {
                        this.infoDialog.show("Uyarı", "Lütfen bir isim belirtiniz!");
                    }
                });
                this.inputDialog.show(title, message, "İsim giriniz..");
            } else if (item.index == ContextMenuTypes.Lock()) {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasörü Kilitle";
                    message = "Klasörü kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Kilitle";
                    message = "Dosyayı kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Diski Kilitle";
                    message = "Diski kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                }
                this.passwordConfirmDialog.onOkClicked.subscribe(event => this.onLockedItem(event));
                this.passwordConfirmDialog.show(title, message, "Bir parola girin..", "Parolayi tekrar girin..");
            } else if (item.index == ContextMenuTypes.NewFolder()) {
                this.inputDialog.onOkClickedEvent.subscribe(async (event: string) => {
                    if (event.length > 0) {
                        await this._folderService.createFolderOnDisk(this.currentDiskId, event);
                        await this.refreshGrid();
                    } else {
                        this.infoDialog.show("Uyarı", "Klasör adı boş geçilemez!");
                    }
                });
                this.inputDialog.show("Yeni Klasör", "Oluşturulacak Klasörün Adını Giriniz:", "İsim giriniz..");
            }
            this.contextMenu.visible = false;
        } catch (ex) {
            if (ex.status == 401) {
                this._router.navigate(["/OturumAc"]);
            }
        }
    }
    private onLockedItem(model: PasswordConfirmModel): void {
        if (model.passwordFirst.length == 0 || model.passwordSecond.length == 0 || model.passwordFirst != model.passwordSecond) {
            this.infoDialog.onClickedOk.subscribe(event => {
                let title: string = "";
                let message: string = "";
                if (this.selectedItemType == ItemTypes.folder()) {
                    title = "Klasörü Kilitle";
                    message = "Klasörü kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                } else if (this.selectedItemType == ItemTypes.file()) {
                    title = "Dosyayı Kilitle";
                    message = "Dosyayı kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                } else if (this.selectedItemType == ItemTypes.disk()) {
                    title = "Diski Kilitle";
                    message = "Diski kilitlerseniz diger kullanicilar bu dosya üzerinde islem yapamayacak!";
                }
                this.passwordConfirmDialog.onOkClicked.subscribe(event => this.onLockedItem(event));
                this.passwordConfirmDialog.show(title, message, "Bir parola girin..", "Parolayi tekrar girin..");
            });
            this.infoDialog.show("Uyarı", "Girilen parolalar birbirleriyle eslesmiyor!");
        }
    }
    public onAcceptInternetSharing(): void {
        this.readonlyDialog.show("Paylaşım Bağlantısı", "Asagidaki baglantiyi kullanarak ögeleri sistem kullanicilari disinda internete açik halde paylasabilirsiniz.", "http://www...")
    }
    public onRenamed(value: string) {
        if (value.length == 0) {
            this.infoDialog.onClickedOk.subscribe(event => {
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

                this.inputDialog.onOkClickedEvent.subscribe(event => this.onRenamed(event));
                this.inputDialog.show(title, message, "İsim giriniz..");

            });
            this.infoDialog.show("Uyarı!", "Bir isim belirtiniz.");
        }
    }
}