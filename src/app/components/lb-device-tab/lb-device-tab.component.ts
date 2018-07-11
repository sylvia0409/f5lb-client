import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {Device} from "../../models/device.model";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {DeviceInfoCardComponent} from "../pop-card/device-info-card/device-info-card";
import {ChangeDeviceCardComponent} from "../pop-card/change-device-card/change-device-card";

// const DEFAULT_DEVICE  = Object.freeze({
//   cmName: '',
//   vsAddress: '',
//   partition: '',
//   username: '',
//   password: ''
// });

@Component({
  selector: 'app-lb-device-tab-device',
  templateUrl: './lb-device-tab.component.html',
  styleUrls: ['./lb-device-tab.component.css']
})

export class LbDeviceTabComponent implements OnInit {
  dataSource: any;
  devices = <Device[]>[];
  displayedColumns = ['CMName', 'VSAddress', 'Partition', 'Balance', 'ServiceName', 'ServicePort', 'Action'];
  inputData = '';
  searchResult = [];
  // newDevice = Object.assign({}, DEFAULT_DEVICE);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject('dataService') private dataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllDevices();
  }

  getAllDevices() {
    this.dataService.getAllConfigMaps('default').subscribe((devices:any[]) => {
      this.devices = [];
      for(let i of devices){
        let device = <Device>{};
        let clearData = JSON.parse(i.data.data.replace("\\", "").replace(/\s/g, ""));
        device['cmName'] = i.metadata.name;
        device['vsAddress'] = clearData.virtualServer.frontend.virtualAddress.bindAddr + ':' +
          clearData.virtualServer.frontend.virtualAddress.port;
        device['partition'] = clearData.virtualServer.frontend.partition;
        device['balance'] = clearData.virtualServer.frontend.balance;
        device['serviceName'] = clearData.virtualServer.backend.serviceName;
        device['servicePort'] = clearData.virtualServer.backend.servicePort.toString();
        this.devices.push(device);
      }
        this.dataSource = new MatTableDataSource<Device>(this.devices);
        this.dataSource.paginator = this.paginator;
      },
      error => console.error('get devices failed', error));
  }

  getOneDevice(deviceName) {
    this.dialog.open(DeviceInfoCardComponent, {
      width: '710px',
      height: '660px',
      data: { deviceName }
    });
  }

  // addDevice() {
  //   let dialogRef = this.dialog.open(AddDeviceCardComponent, {
  //     width: '630px',
  //     height: '660px',
  //     data: { device: this.newDevice }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(this.newDevice['deviceName'] && this.newDevice['address'] &&
  //        this.newDevice['partition'] && this.newDevice['username'] &&
  //        this.newDevice['password']) {
  //       console.log('result ', result);
  //       this.dataService.addConfigMap('default', result)
  //         .then(() => {
  //           this._openSuccessBar();
  //           this.getAllDevices();
  //         })
  //         .catch(error => {
  //           console.error('Add device failed', error);
  //           this._openFailedBar();
  //         });
  //     } else {
  //       this._openFailedBar();
  //       console.error('Please fill out the form');
  //     }
  //     this.newDevice = Object.assign({}, DEFAULT_DEVICE);
  //   });
  // }

  changeDevice(deviceName) {
    let dialogRef = this.dialog.open(ChangeDeviceCardComponent, {
      width: '650px',
      height: '750px',
      data: { deviceName }
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
        let formatData = JSON.stringify(result.data.data).replace('"', '\"');
        result.data.data = formatData;
        console.log('result ', result);
        this.dataService.changeConfigMap('default', result, deviceName)
          .then(() => {
            this._openSuccessBar();
            this.getAllDevices();
          })
          .catch(error => {
            console.error('Add device failed', error);
            this._openFailedBar();
          });
      } else {
        this._openFailedBar();
        console.error('Please fill out the form');
      }
    });
  }

  deleteDevice(deviceName) {
    this.dataService.deleteConfigMap('default', deviceName)
      .then(() => {
        this.getAllDevices();
      })
      .catch(error => {
        console.log('delete device failed', error);
      })
  }

  search(event) {
    if(event.keyCode == '13'){
      this.inputData = this.inputData.replace(/\s+/g,"");
      if(this.inputData.length == 0){
        this.dataSource = new MatTableDataSource<Device>(this.devices);
        this.dataSource.paginator = this.paginator;
        return;
      }
      for(let i = 0; i < this.devices.length; i++){
        if(this._matchDevices(this.devices[i])){
          this.searchResult.push(this.devices[i]);
        }
      }
      this.dataSource = new MatTableDataSource<Device>(this.searchResult);
      this.dataSource.paginator = this.paginator;
      this.searchResult = [];
    }
  }

  refresh() {
    this.inputData = '';
    this.getAllDevices();
  }

  private _matchDevices(device): boolean {
      return device.cmName.indexOf(this.inputData) > -1 ||
        device.vsAddress.indexOf(this.inputData) > -1 ||
        device.partition.indexOf(this.inputData) > -1 ||
        device.balance.indexOf(this.inputData) > -1 ||
        device.serviceName.indexOf(this.inputData) > -1 ||
        device.servicePort.indexOf(this.inputData) > -1
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
