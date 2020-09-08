import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from "@angular/core";
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
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { DialogPasswordInputComponent } from '../dialog/component.dialogpasswordinput';
import { GridItemModel } from 'src/app/models/model.gridItem';
import { ContentService } from 'src/app/services/services.content';
import { componentFactoryName } from '@angular/compiler';

@Component({
    selector: "grid",
    templateUrl: "./component.grid.html",
    styleUrls: ["./component.grid.css"],
    providers: [ContentService, DiskService, FileService, FolderService]
})
export class GridComponent implements OnInit {
    private selectedItemType: number;
    private selectedItemId: number;

    public currentDiskId: number = 0;
    public currentFolderId: number = 0;
    public content: ContentModel;

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

    public async setChecked(item: GridItemModel) {
        item.checked = !item.checked;
        console.log(item.checked);
    }

    public async showContextMenu(event: any, type: number, id: number, inside: boolean) {
        this.selectedItemType = type;
        this.selectedItemId = id;

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

            if (type == ItemTypes.folder()) {
                contextMenuTitle = "Klasör Seçenekleri";
                contextMenuItems = await this._folderService.getContextMenu(this.selectedItemId, inside);
            } else if (type == ItemTypes.disk()) {
                contextMenuTitle = "Disk Seçenekleri";
                contextMenuItems = await this._diskService.getContextMenu(this.currentDiskId, inside);
            } else if (type == ItemTypes.file()) {
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
        this.contextMenu.destroy();
        this.contextMenu = null;
    }

    public async onContextMenuItemClicked(item: ContextMenuItemModel) {
        try {
            if (item.index == ContextMenuTypes.Cut()) {

            } else if (item.index == ContextMenuTypes.Copy()) {

            } else if (item.index == ContextMenuTypes.Paste()) {

            } else if (item.index == ContextMenuTypes.Delete()) {

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
                this.uploadDialog.instance.uploadToDisk(this.currentDiskId);
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
                        await this._folderService.createFolderOnDisk(this.currentDiskId, event);
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

            } else if (item.index == ContextMenuTypes.Download()) {

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

        this.content.folders.forEach(folder => {
            if (folder.checked) {
                foldersToShare.push(folder);
            }
        });

        this.content.files.forEach(file => {
            if (file.checked) {
                filesToShare.push(file);
            }
        });

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

        this.content.folders.forEach(folder => {
            if (folder.checked) {
                foldersToUnShare.push(folder);
            }
        });

        this.content.files.forEach(file => {
            if (file.checked) {
                filesToUnShare.push(file);
            }
        });

        await this._contentService.unShareItems(foldersToUnShare, filesToUnShare);
        if (this.infoDialog != null) {
            this.infoDialog.destroy();
        }
        this.infoDialog = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(DialogInfoComponent));
        this.infoDialog.instance.show("İşlem Sonucu", "Paylaşım internete kapatıldı");
    }
}