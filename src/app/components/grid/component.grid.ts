import { Component, ViewChild, OnInit } from "@angular/core";
import { ContextMenuComponent } from '../contextmenu/component.contextmenu';

import { GridItemModel } from "../../models/model.gridItem";
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

@Component({
    selector: "grid",
    templateUrl: "./component.grid.html",
    styleUrls: ["./component.grid.css"]
})
export class GridComponent implements OnInit {
    private selectedItemType: number;
    private selectedItemId: number;

    public diskId = 99;
    public gridItems: Array<GridItemModel>;

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

    constructor() { }

    ngOnInit(): void {
        this.gridItems = new Array<GridItemModel>();

        let item: GridItemModel = new GridItemModel();
        item.checked = false;
        item.itemType = ItemTypes.folder();
        item.itemId = 393;
        item.size = "393,5 KB";
        item.name = "test";
        item.createDate = "18.08.2020 18:56:14";
        item.updateDate = "19.08.2020 18:50:00";
        item.logo = "/assets/images/folder.png";

        item.permissions = new Array<PermissionModel>();

        let permission1 = new PermissionModel();
        permission1.logo = "/assets/images/person.png";
        permission1.title = "Full";
        item.permissions.push(permission1);

        let permission2 = new PermissionModel();
        permission2.logo = "/assets/images/search.png";
        permission2.title = "Read";
        item.permissions.push(permission2);

        let permission3 = new PermissionModel();
        permission3.logo = "/assets/images/upload.png";
        permission3.title = "Create";
        item.permissions.push(permission3);

        let permission4 = new PermissionModel();
        permission4.logo = "/assets/images/delete.png";
        permission4.title = "Delete";
        item.permissions.push(permission4);

        this.gridItems.push(item);
    }

    public showContextMenu(event: any, itemType: number, itemId: number): void {

        console.log(itemType);
        this.selectedItemType = itemType;
        this.selectedItemId = itemId;

        this.contextMenu.visible = true;
        this.contextMenu.marginLeft = event.x + "px";
        this.contextMenu.marginTop = event.y + "px";

        let contextMenuItems: Array<ContextMenuItemModel> = new Array<ContextMenuItemModel>();
        let commentsItem: ContextMenuItemModel = new ContextMenuItemModel();
        commentsItem.index = ContextMenuTypes.Comments();
        commentsItem.splitted = true;
        commentsItem.text = "Yorumlar";
        commentsItem.logo = "/assets/images/comment.png";
        contextMenuItems.push(commentsItem);

        let historyItem: ContextMenuItemModel = new ContextMenuItemModel();
        historyItem.index = ContextMenuTypes.Histories();
        historyItem.splitted = true;
        historyItem.text = "İşlem Geçmişi";
        historyItem.logo = "/assets/images/date.png";
        contextMenuItems.push(historyItem);

        let permissionItem: ContextMenuItemModel = new ContextMenuItemModel();
        permissionItem.index = ContextMenuTypes.Permissions();
        permissionItem.splitted = true;
        permissionItem.text = "Yetkiler";
        permissionItem.logo = "/assets/images/group.png";
        contextMenuItems.push(permissionItem);

        let propertiesItem: ContextMenuItemModel = new ContextMenuItemModel();
        propertiesItem.index = ContextMenuTypes.Properties();
        propertiesItem.splitted = true;
        propertiesItem.text = "Özellikler";
        propertiesItem.logo = "/assets/images/info.png";
        contextMenuItems.push(propertiesItem);

        let shareItem: ContextMenuItemModel = new ContextMenuItemModel();
        shareItem.index = ContextMenuTypes.Share();
        shareItem.splitted = true;
        shareItem.text = "Paylaş";
        shareItem.logo = "/assets/images/share.png";
        contextMenuItems.push(shareItem);

        let renameItem: ContextMenuItemModel = new ContextMenuItemModel();
        renameItem.index = ContextMenuTypes.Rename();
        renameItem.splitted = true;
        renameItem.text = "Yeniden Adlandır";
        renameItem.logo = "/assets/images/share.png";
        contextMenuItems.push(renameItem);

        let lockItem: ContextMenuItemModel = new ContextMenuItemModel();
        lockItem.index = ContextMenuTypes.Lock();
        lockItem.splitted = true;
        lockItem.text = "Kilitle";
        lockItem.logo = "/assets/images/lockfile.png";
        contextMenuItems.push(lockItem);

        let contextMenuTitle: string = ""
        if (itemType == ItemTypes.folder()) {
            contextMenuTitle = "Klasör Seçenekleri";
        } else if (itemType == ItemTypes.disk()) {
            contextMenuTitle = "Disk Seçenekleri";
        } else if (itemType == ItemTypes.file()) {
            contextMenuTitle = "Dosya Seçenekleri";
        }

        this.contextMenu.fillContextMenu(contextMenuTitle, contextMenuItems);

        this.contextMenu.onItemClickedEvent.subscribe(e => this.onContextMenuItemClicked(e));

        event.preventDefault();
    }

    public hideContextMenu(): void {
        this.contextMenu.visible = false;
    }

    public onContextMenuItemClicked(item: ContextMenuItemModel): void {
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
        } else if (item.index == ContextMenuTypes.Histories()) {
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
            let title: string = "";
            let logo: string = "";
            if (this.selectedItemType == ItemTypes.folder()) {
                title = "Klasör Özellikleri";
                logo = "/assets/images/folder.png";
            } else if (this.selectedItemType == ItemTypes.file()) {
                title = "Dosya Özellikleri";
                logo = "/assets/images/file.png";
            } else if (this.selectedItemType == ItemTypes.disk()) {
                title = "Disk Özellikleri";
                logo = "/assets/images/disk.png";
            }
            this.propertiesWindow.content = "3 Klasör 2 Dosya";
            this.propertiesWindow.createDate = new Date().toDateString();
            this.propertiesWindow.creatorUser = "serkancamur@gmail.com";
            this.propertiesWindow.crypted = "Hayır";
            this.propertiesWindow.itemType = "Klasör";
            this.propertiesWindow.location = "Sanal Disk HDD/Klasör";
            this.propertiesWindow.modifierUser = "serkancamur@gmail.com";
            this.propertiesWindow.modifyDate = new Date().toDateString();
            this.propertiesWindow.permissions = "Full";
            this.propertiesWindow.size = "347.54 KB";
            this.propertiesWindow.show(title, logo, "Test");
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

            this.inputDialog.onOkClickedEvent.subscribe(event => this.onRenamed(event));
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
        }
        this.contextMenu.visible = false;
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