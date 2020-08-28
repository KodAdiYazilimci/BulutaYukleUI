import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DiskRepository } from "../app/repositories/repositories.disk";
import { ContextMenuRepository } from "../app/repositories/repositories.contextmenu";
import { FileRepository } from "../app/repositories/repositories.file";

import { DiskService } from "../app/services/services.disk";
import { FileService } from "../app/services/services.file";

import { IndexComponent } from "../app/components/index/component.index";
import { FolderSideComponent } from "../app/components/folderside/component.folderside";
import { ContentSideComponent } from "../app/components/contentside/component.contentside";
import { FolderPathComponent } from "../app/components/folderpath/component.folderpath";
import { GridComponent } from "../app/components/grid/component.grid";
import { HistoryComponent } from "../app/components/history/component.history";
import { PermissionComponent } from "../app/components/permission/component.permission";
import { ContextMenuComponent } from "../app/components/contextmenu/component.contextmenu";
import { FormComponent } from "../app/components/form/component.form";
import { DialogYesNoComponent } from "../app/components/dialog/component.dialogyesno";
import { DialogReadOnlyInputComponent } from "../app/components/dialog/component.dialogreadonlyinput";
import { CommentComponent } from "../app/components/comment/component.comment";
import { PropertyComponent } from "../app/components/properties/component.property";
import { PermissionGroupComponent } from "../app/components/permission/component.permissiongroup";
import { PermissionUserComponent } from "../app/components/permission/component.permissionuser";
import { DialogInputComponent } from "../app/components/dialog/component.dialoginput";
import { DialogInfoComponent } from "../app/components/dialog/component.dialoginfo";
import { DialogPasswordConfirmComponent } from "../app/components/dialog/component.dialogpasswordconfirm";
import { DialogUploadComponent } from "../app/components/dialog/component.dialogupload";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    DialogYesNoComponent, DialogReadOnlyInputComponent, DialogInputComponent, DialogInfoComponent, DialogPasswordConfirmComponent, DialogUploadComponent,
    FormComponent,
    AppComponent,
    IndexComponent,
    FolderSideComponent, ContentSideComponent, FolderPathComponent,
    GridComponent, HistoryComponent, PermissionComponent, ContextMenuComponent,
    CommentComponent, PropertyComponent,
    PermissionGroupComponent, PermissionUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DiskRepository, ContextMenuRepository, FileRepository,
    { provide: HTTP_INTERCEPTORS, useClass: DiskService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FileService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
