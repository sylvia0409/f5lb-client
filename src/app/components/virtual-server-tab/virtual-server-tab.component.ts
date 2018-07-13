import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {VirtualServer} from "../../models/virtual-server.model";
import {ConfigmapInfoCardComponent} from "../pop-card/configmap-info-card/configmap-info-card";
import {ChangeVSCardComponent} from "../pop-card/change-vs-card/change-vs-card";

@Component({
  selector: 'app-virtual-server-tab',
  templateUrl: './virtual-server-tab.component.html',
  styleUrls: ['./virtual-server-tab.component.css']
})

export class VirtualServerTabComponent implements OnInit {
  dataSource: any;
  virtualServers = <VirtualServer[]>[];
  displayedColumns = ['CMName', 'VSAddress', 'Partition', 'Balance', 'ServiceName', 'ServicePort', 'Action'];
  inputData = '';
  searchResult = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject('dataService') private dataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllVirtualServers();
  }

  getAllVirtualServers() {
    this.dataService.getAllConfigMaps().subscribe((virtualServers:any[]) => {
      this.virtualServers = [];
      for(let i of virtualServers){
        if(i.metadata.labels.f5type != 'virtual-server'){
          continue;
        }
        let virtualServer = <VirtualServer>{};
        let clearData = JSON.parse(i.data.data);
        virtualServer['cmName'] = i.metadata.name;
        virtualServer['vsAddress'] = clearData.virtualServer.frontend.virtualAddress.bindAddr + ':' +
          clearData.virtualServer.frontend.virtualAddress.port;
        virtualServer['partition'] = clearData.virtualServer.frontend.partition;
        virtualServer['balance'] = clearData.virtualServer.frontend.balance;
        virtualServer['serviceName'] = clearData.virtualServer.backend.serviceName;
        virtualServer['servicePort'] = clearData.virtualServer.backend.servicePort.toString();
        this.virtualServers.push(virtualServer);
      }
        this.dataSource = new MatTableDataSource<VirtualServer>(this.virtualServers);
        this.dataSource.paginator = this.paginator;
      },
      error => console.error('get config map failed', error));
  }

  getOneVirtualServer(cmName) {
    this.dialog.open(ConfigmapInfoCardComponent, {
      width: '650px',
      height: '700px',
      data: { cmName }
    });
  }

  changeVirtualServer(cmName) {
    let dialogRef = this.dialog.open(ChangeVSCardComponent, {
      width: '650px',
      height: '750px',
      data: { cmName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      if(result.data.data.virtualServer.frontend.virtualAddress.bindAddr  &&
        result.data.data.virtualServer.frontend.virtualAddress.port &&
        result.data.data.virtualServer.frontend.partition &&
        result.data.data.virtualServer.backend.serviceName &&
        result.data.data.virtualServer.backend.servicePort) {
        result.data.data = JSON.stringify(result.data.data);
        this.dataService.changeConfigMap(result, cmName)
          .then(() => {
            this._openSuccessBar();
            this.getAllVirtualServers();
          })
          .catch(error => {
            console.error('Change device failed', error);
            this._openFailedBar();
          });
      } else {
        this._openFailedBar();
        console.error('Please fill out the form');
      }
    });
  }

  deleteVirtualServer(cmName) {
    this.dataService.deleteConfigMap(cmName)
      .then(() => {
        this.getAllVirtualServers();
      })
      .catch(error => {
        console.log('delete virtual server failed', error);
      })
  }

  search(event) {
    if(event.keyCode == '13'){
      this.inputData = this.inputData.replace(/\s+/g,"");
      if(this.inputData.length == 0){
        this.dataSource = new MatTableDataSource<VirtualServer>(this.virtualServers);
        this.dataSource.paginator = this.paginator;
        return;
      }
      for(let i = 0; i < this.virtualServers.length; i++){
        if(this._matchDevices(this.virtualServers[i])){
          this.searchResult.push(this.virtualServers[i]);
        }
      }
      this.dataSource = new MatTableDataSource<VirtualServer>(this.searchResult);
      this.dataSource.paginator = this.paginator;
      this.searchResult = [];
    }
  }

  refresh() {
    this.inputData = '';
    this.getAllVirtualServers();
  }

  private _matchDevices(virtualServer): boolean {
      return virtualServer.cmName.indexOf(this.inputData) > -1 ||
        virtualServer.vsAddress.indexOf(this.inputData) > -1 ||
        virtualServer.partition.indexOf(this.inputData) > -1 ||
        virtualServer.balance.indexOf(this.inputData) > -1 ||
        virtualServer.serviceName.indexOf(this.inputData) > -1 ||
        virtualServer.servicePort.indexOf(this.inputData) > -1
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
