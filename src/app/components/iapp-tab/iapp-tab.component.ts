import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {IApp} from "../../models/iapp.model";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {ChangeIappCardComponent} from "../pop-card/change-iapp-card/change-iapp-card";
import {ConfigmapInfoCardComponent} from "../pop-card/configmap-info-card/configmap-info-card";

@Component({
  selector: 'app-iapp-tab',
  templateUrl: './iapp-tab.component.html',
  styleUrls: ['./iapp-tab.component.css']
})
export class IappTabComponent implements OnInit {
  dataSource: any;
  iApps = <IApp[]>[];
  displayedColumns = ['CMName', 'Partition', 'IApp', 'ServiceName', 'ServicePort', 'Action'];
  inputData = '';
  searchResult = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject('dataService') private dataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllIapps();
  }

  getAllIapps() {
    this.dataService.getAllConfigMaps().subscribe((Iapps:any[]) => {
        this.iApps = [];

        for(let i of Iapps){
          if(i.metadata.labels.f5type != 'iapp'){
            continue;
          }
          let iApp = <IApp>{};
          let clearData = JSON.parse(i.data.data);
          iApp['cmName'] = i.metadata.name;
          iApp['partition'] = clearData.virtualServer.frontend.partition;
          iApp['iapp'] = clearData.virtualServer.frontend.iapp;
          iApp['serviceName'] = clearData.virtualServer.backend.serviceName;
          iApp['servicePort'] = clearData.virtualServer.backend.servicePort.toString();
          this.iApps.push(iApp);
        }
        this.dataSource = new MatTableDataSource<IApp>(this.iApps);
        this.dataSource.paginator = this.paginator;
      },
      error => console.error('get config map failed', error));
  }

  getOneIapp(cmName) {
    this.dialog.open(ConfigmapInfoCardComponent, {
      width: '650px',
      height: '700px',
      data: { cmName }
    });
  }

  changeIapp(cmName) {
    let dialogRef = this.dialog.open(ChangeIappCardComponent, {
      width: '650px',
      height: '650px',
      data: { cmName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      if(result.data.data.virtualServer.frontend.iapp  &&
        result.data.data.virtualServer.frontend.partition &&
        result.data.data.virtualServer.frontend.iappPoolMemberTable &&
        result.data.data.virtualServer.frontend.iappOptions &&
        result.data.data.virtualServer.frontend.iappVariables &&
        result.data.data.virtualServer.backend.serviceName &&
        result.data.data.virtualServer.backend.servicePort) {
        result.data.data = JSON.stringify(result.data.data);
        this.dataService.changeConfigMap(result, cmName)
          .then(() => {
            this._openSuccessBar();
            this.getAllIapps();
          })
          .catch(error => {
            console.error('Change iApp failed', error);
            this._openFailedBar();
          });
      } else {
        this._openFailedBar();
        console.error('Please fill out the form');
      }
    });
  }

  deleteIapp(cmName) {
    this.dataService.deleteConfigMap(cmName)
      .then(() => {
        this.getAllIapps();
      })
      .catch(error => {
        console.log('delete iApp failed', error);
      })
  }

  search(event) {
    if(event.keyCode == '13'){
      this.inputData = this.inputData.replace(/\s+/g,"");
      if(this.inputData.length == 0){
        this.dataSource = new MatTableDataSource<IApp>(this.iApps);
        this.dataSource.paginator = this.paginator;
        return;
      }
      for(let i = 0; i < this.iApps.length; i++){
        if(this._matchDevices(this.iApps[i])){
          this.searchResult.push(this.iApps[i]);
        }
      }
      this.dataSource = new MatTableDataSource<IApp>(this.searchResult);
      this.dataSource.paginator = this.paginator;
      this.searchResult = [];
    }
  }

  refresh() {
    this.inputData = '';
    this.getAllIapps();
  }

  private _matchDevices(iApp): boolean {
    return iApp.cmName.indexOf(this.inputData) > -1 ||
      iApp.partition.indexOf(this.inputData) > -1 ||
      iApp.iapp.indexOf(this.inputData) > -1 ||
      iApp.serviceName.indexOf(this.inputData) > -1 ||
      iApp.servicePort.indexOf(this.inputData) > -1
  }

  private _openSuccessBar() {
    this.snackBar.openFromComponent(SuccessComponent, {
      duration: 1000,
      verticalPosition: "top"
    });
  }

  private _openFailedBar() {
    this.snackBar.openFromComponent(FailedComponent, {
      duration: 1000,
      verticalPosition: "top"
    });
  }

}
