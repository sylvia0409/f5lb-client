import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BackgroundCardComponent } from './components/background-card/background-card.component';
import { CardContentComponent } from './components/card-content/card-content.component';
import { LbDeviceTabComponent } from './components/lb-device-tab/lb-device-tab.component';
import { EasyConfigTabComponent } from './components/easy-config-tab/easy-config-tab.component';
import { ExpertConfigTabComponent } from './components/expert-config-tab/expert-config-tab.component';
import { AddDeviceCardComponent } from "./components/pop-card/add-device-card/add-device-card";
import { DeviceInfoCardComponent } from "./components/pop-card/device-info-card/device-info-card";
import { ChangeDeviceCardComponent } from "./components/pop-card/change-device-card/change-device-card";
import { SuccessComponent } from "./components/snackbar/success-bar";
import { FailedComponent } from "./components/snackbar/failed-bar";

import { DataService } from "./services/data.service";

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
import {CodemirrorModule} from "ng2-codemirror";

@NgModule({
  declarations: [
    AppComponent,
    BackgroundCardComponent,
    LbDeviceTabComponent,
    EasyConfigTabComponent,
    ExpertConfigTabComponent,
    AddDeviceCardComponent,
    DeviceInfoCardComponent,
    CardContentComponent,
    ChangeDeviceCardComponent,
    SuccessComponent,
    FailedComponent
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
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    AddDeviceCardComponent,
    DeviceInfoCardComponent,
    ChangeDeviceCardComponent,
    SuccessComponent,
    FailedComponent
  ]
})
export class AppModule { }
