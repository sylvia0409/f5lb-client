import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {VirtualServer} from "../../models/virtual-server.model";
import {ConfigmapInfoCardComponent} from "../pop-card/configmap-info-card/configmap-info-card";
import {ChangeVSCardComponent} from "../pop-card/change-vs-card/change-vs-card";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-virtual-server-tab',
  templateUrl: './virtual-server-tab.component.html',
  styleUrls: ['./virtual-server-tab.component.css']
})

export class VirtualServerTabComponent implements OnInit {
  dataSource: any;
  surveyForm: any;
  virtualServers = <VirtualServer[]>[];
  displayedColumns = ['CMName', 'VSAddress', 'Partition', 'Balance', 'ServiceName', 'ServicePort', 'Action'];
  inputData = '';
  searchResult = [];
  selectedVirtualServers = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject('dataService') private dataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.getAllVirtualServers();
  }

  getAllVirtualServers() {
    this.dataService.getAllConfigMaps().subscribe((virtualServers:any[]) => {
      this.virtualServers = [];
      this.surveyForm = new FormGroup({
        'title': new FormControl(false)
      });
      let index = 0;
      for(let i of virtualServers){
        if(i.metadata.labels.f5type != 'virtual-server'){
          continue;
        }
        let virtualServer = <VirtualServer>{};
        virtualServer['id'] = 'check' + index;
        let clearData = JSON.parse(i.data.data);
        virtualServer['cmName'] = i.metadata.name;
        virtualServer['vsAddress'] = clearData.virtualServer.frontend.virtualAddress.bindAddr + ':' +
                                     clearData.virtualServer.frontend.virtualAddress.port;
        virtualServer['partition'] = clearData.virtualServer.frontend.partition;
        virtualServer['balance'] = clearData.virtualServer.frontend.balance;
        virtualServer['serviceName'] = clearData.virtualServer.backend.serviceName;
        virtualServer['servicePort'] = clearData.virtualServer.backend.servicePort.toString();
        this.virtualServers.push(virtualServer);
        this.surveyForm.addControl(virtualServer['id'], new FormControl(false));
        index++;
      }
        this.dataSource = new MatTableDataSource<VirtualServer>(this.virtualServers);
        this.dataSource.paginator = this.paginator;
        let nextButton = this.elementRef.nativeElement.getElementsByClassName('mat-paginator-icon')[1];
        let preButton = this.elementRef.nativeElement.getElementsByClassName('mat-paginator-icon')[0];
        if(nextButton){
          nextButton.addEventListener('click', this._changePage.bind(this));
        }
        if(preButton){
          preButton.addEventListener('click', this._changePage.bind(this));
        }
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

  deleteVirtualServer() {
    for(let vs of this.selectedVirtualServers){
      this.dataService.deleteConfigMap(vs)
        .then()
        .catch(error => {
          console.log('delete virtual server failed', error);
        })
    }
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

  selectedSome(event: MatCheckboxChange, element) {
    this._setTitleState();
    let checked = event.checked;
    if(checked) {
      this.selectedVirtualServers.push(element.cmName);
    } else {
      this.selectedVirtualServers.splice(this.selectedVirtualServers.indexOf(element.cmName), 1);
    }
  }

  selectedAll(event: MatCheckboxChange) {
    let start = this.paginator.pageIndex*this.paginator.pageSize;
    let end = (this.paginator.pageIndex + 1)*this.paginator.pageSize;
    for(let i = start; i < end; i++){
      let id = 'check' + i;
      if(document.getElementById(id)){
        this.surveyForm.get(id).setValue(event.checked);
      }
    }
    if(event.checked){
      for(let i = start; i < end; i++){
        let id = 'check' + i;
        if(document.getElementById(id)) {
          let value = this.virtualServers[i].cmName;
          if(!this.selectedVirtualServers.includes(value)){
            this.selectedVirtualServers.push(value);
          }
        }
      }
    } else {
      let count = 0;
      for(let i = start; i < end; i++){
        let id = 'check' + i;
        if(document.getElementById(id)) {
          count++;
        }
      }
      this.selectedVirtualServers.splice(start, count);
    }
  }

  private _setTitleState() {
    let start = this.paginator.pageIndex*this.paginator.pageSize;
    let end = (this.paginator.pageIndex+1)*this.paginator.pageSize;
    let validItems = 0;
    let count = 0;
    for(let i = start; i < end; i++){
      let id = 'check' + i;
      if(document.getElementById(id)){
        validItems++;
        if(this.surveyForm.get(id).value){
          count++;
        }
      }
    }
    this.surveyForm.get('title').setValue(count === validItems)
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

  private _changePage() {
    this.surveyForm.get('title').setValue(false);
  }
}
