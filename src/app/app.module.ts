import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BackgroundCardComponent } from './components/background-card/background-card.component';
import { CardContentComponent } from './components/card-content/card-content.component';
import { VirtualServerTabComponent } from "./components/virtual-server-tab/virtual-server-tab.component";
import { IappTabComponent } from './components/iapp-tab/iapp-tab.component';
import { EasyConfigTabComponent } from './components/easy-config-tab/easy-config-tab.component';
import { ExpertConfigTabComponent } from './components/expert-config-tab/expert-config-tab.component';
import { ConfigmapInfoCardComponent } from "./components/pop-card/configmap-info-card/configmap-info-card";
import { ChangeVSCardComponent } from "./components/pop-card/change-vs-card/change-vs-card";
import { ChangeIappCardComponent } from "./components/pop-card/change-iapp-card/change-iapp-card";
import { SuccessComponent } from "./components/snackbar/success-bar";
import { FailedComponent } from "./components/snackbar/failed-bar";

import { DataService } from "./services/data.service";

import {CodemirrorModule} from "ng2-codemirror";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';
import {
  MatGridListModule,
  MatCardModule,
  MatToolbarModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatInputModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBottomSheetModule
} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    BackgroundCardComponent,
    VirtualServerTabComponent,
    EasyConfigTabComponent,
    ExpertConfigTabComponent,
    ConfigmapInfoCardComponent,
    CardContentComponent,
    ChangeVSCardComponent,
    ChangeIappCardComponent,
    SuccessComponent,
    FailedComponent,
    IappTabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    CdkTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    CodemirrorModule
  ],
  providers: [{
    provide: 'dataService',
    useClass: DataService
  },
    VirtualServerTabComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ConfigmapInfoCardComponent,
    ChangeVSCardComponent,
    ChangeIappCardComponent,
    SuccessComponent,
    FailedComponent
  ]
})
export class AppModule { }
