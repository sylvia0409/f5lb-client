import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'change-device-card',
  templateUrl: 'change-device-card.html',
  styleUrls: ['change-device-card.css']
})

export class ChangeDeviceCardComponent implements OnInit{
  originData: any;
  clearData: any;
  device = {};
  balances = ['round-robin', 'ratio-member', 'ratio-node', 'dynamic-ratio-member', 'dynamic-ratio-node',
    'fastest-node', 'fastest-application', 'least-connections-member', 'least-connections-node',
    'weighted-least-connections-member', 'weighted-least-connections-node', 'observed-member',
    'observed-node', 'predictive-member', 'predictive-node', 'least-sessions', 'ratio-least-connections'];
  addressControl = new FormControl('', [Validators.required]);
  partitionControl = new FormControl('', [Validators.required]);
  serviceNameControl = new FormControl('', [Validators.required]);
  servicePortControl = new FormControl('', [Validators.required]);
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  @Output() result = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<ChangeDeviceCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject('dataService') private dataService) { }


  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.dataService.getOneConfigMap('default', this.data.deviceName)
      .then((res) => {
        this.clearData = JSON.parse(res.data.data.replace("\\", "").replace(/\s/g, ""));
        this.originData = res;
        this.device['cmName'] = res.metadata.name;
        this.device['namespace'] = res.metadata.namespace;
        this.device['vsAddress'] = this.clearData.virtualServer.frontend.virtualAddress.bindAddr + ':' +
                                   this.clearData.virtualServer.frontend.virtualAddress.port;
        this.device['partition'] = this.clearData.virtualServer.frontend.partition;
        this.device['balance'] = this.clearData.virtualServer.frontend.balance;
        this.device['serviceName'] = this.clearData.virtualServer.backend.serviceName;
        this.device['servicePort'] = this.clearData.virtualServer.backend.servicePort;
      })
  }

  updateResult() {
    // this.clearData.virtualServer.frontend.username = this.device['username'];
    // this.clearData.virtualServer.frontend.password = this.device['password'];
    this.clearData.virtualServer.frontend.partition = this.device['partition'];
    this.clearData.virtualServer.frontend.virtualAddress.bindAddr = this.device['vsAddress'].split(':')[0];
    this.clearData.virtualServer.frontend.virtualAddress.port = this.device['vsAddress'].split(':')[1];
    this.clearData.virtualServer.frontend.balance = this.device['balance'];
    this.clearData.virtualServer.backend.serviceName = this.device['serviceName'];
    this.clearData.virtualServer.backend.servicePort = this.device['servicePort'];
    this.originData.data.data = this.clearData;
  }

  onNoClick(): void {
    this.originData = null;
    this.dialogRef.close();
  }

}
