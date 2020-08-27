import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { ProgressComponent } from "../app/components/progress/component.progress";
import { PermissionGroupComponent } from "../app/components/permission/component.permissiongroup";
import { PermissionUserComponent } from "../app/components/permission/component.permissionuser";
import { DialogInputComponent } from "../app/components/dialog/component.dialoginput";
import { DialogInfoComponent } from "../app/components/dialog/component.dialoginfo";
import { DialogPasswordConfirmComponent } from "../app/components/dialog/component.dialogpasswordconfirm";

import { from } from 'rxjs';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent, FolderSideComponent, ContentSideComponent, FolderPathComponent,
    GridComponent, HistoryComponent, PermissionComponent, ContextMenuComponent,
    FormComponent,
    DialogYesNoComponent, DialogReadOnlyInputComponent, DialogInputComponent, DialogInfoComponent, DialogPasswordConfirmComponent,
    CommentComponent, PropertyComponent, ProgressComponent,
    PermissionGroupComponent, PermissionUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
