import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {IApp} from "../../models/iapp.model";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {ChangeIappCardComponent} from "../pop-card/change-iapp-card/change-iapp-card";
import {ConfigmapInfoCardComponent} from "../pop-card/configmap-info-card/configmap-info-card";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-iapp-tab',
  templateUrl: './iapp-tab.component.html',
  styleUrls: ['./iapp-tab.component.css']
})
export class IappTabComponent implements OnInit {
  dataSource: any;
  surveyForm: any;
  iApps = <IApp[]>[];
  displayedColumns = ['CMName', 'Partition', 'IApp', 'ServiceName', 'ServicePort', 'Action'];
  inputData = '';
  searchResult = [];
  selectedIapps = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject('dataService') private dataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.getAllIapps();
  }

  getAllIapps() {
    this.dataService.getAllConfigMaps().subscribe((Iapps:any[]) => {
        this.iApps = [];
        this.surveyForm = new FormGroup({
          'title': new FormControl(false)
        });
        let index = 0;
        for(let i of Iapps){
          if(i.metadata.labels.f5type != 'iapp'){
            continue;
          }
          let iApp = <IApp>{};
          iApp['id'] = 'check' + index;
          let clearData = JSON.parse(i.data.data);
          iApp['cmName'] = i.metadata.name;
          iApp['partition'] = clearData.virtualServer.frontend.partition;
          iApp['iapp'] = clearData.virtualServer.frontend.iapp;
          iApp['serviceName'] = clearData.virtualServer.backend.serviceName;
          iApp['servicePort'] = clearData.virtualServer.backend.servicePort.toString();
          this.iApps.push(iApp);
          this.surveyForm.addControl(iApp['id'], new FormControl(false));
          index++;
        }
        this.dataSource = new MatTableDataSource<IApp>(this.iApps);
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

  deleteIapp() {
    for( let iapp of this.selectedIapps){
      this.dataService.deleteConfigMap(iapp)
        .then()
        .catch(error => {
          console.log('delete iApp failed', error);
        })
    }
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

  selectedSome(event: MatCheckboxChange, element) {
    this._setTitleState();
    let checked = event.checked;
    if(checked) {
      this.selectedIapps.push(element.cmName);
    } else {
      this.selectedIapps.splice(this.selectedIapps.indexOf(element.cmName), 1);
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
          let value = this.iApps[i].cmName;
          if(!this.selectedIapps.includes(value)){
            this.selectedIapps.push(value);
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
      this.selectedIapps.splice(start, count);
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

  private _changePage() {
    this.surveyForm.get('title').setValue(false);
  }

}
