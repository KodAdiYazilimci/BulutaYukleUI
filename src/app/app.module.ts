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

import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent, FolderSideComponent, ContentSideComponent, FolderPathComponent,
    GridComponent, HistoryComponent, PermissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
