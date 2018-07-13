import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'change-vs-card',
  templateUrl: 'change-vs-card.html',
  styleUrls: ['change-vs-card.css']
})

export class ChangeVSCardComponent implements OnInit{
  originData: any;
  clearData: any;
  virtualServer = {};
  login = {};
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
    public dialogRef: MatDialogRef<ChangeVSCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject('dataService') private dataService) { }


  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.dataService.getOneConfigMap(this.data.cmName)
      .then((res) => {
        this.clearData = JSON.parse(res.data.data);
        this.originData = res;
        this.virtualServer['cmName'] = res.metadata.name;
        this.virtualServer['vsAddress'] = this.clearData.virtualServer.frontend.virtualAddress.bindAddr + ':' +
                                   this.clearData.virtualServer.frontend.virtualAddress.port;
        this.virtualServer['partition'] = this.clearData.virtualServer.frontend.partition;
        this.virtualServer['balance'] = this.clearData.virtualServer.frontend.balance;
        this.virtualServer['serviceName'] = this.clearData.virtualServer.backend.serviceName;
        this.virtualServer['servicePort'] = this.clearData.virtualServer.backend.servicePort;
      })
  }

  updateResult() {
    this.clearData.virtualServer.frontend.partition = this.virtualServer['partition'];
    this.clearData.virtualServer.frontend.virtualAddress.bindAddr = this.virtualServer['vsAddress'].split(':')[0];
    this.clearData.virtualServer.frontend.virtualAddress.port = this.virtualServer['vsAddress'].split(':')[1];
    this.clearData.virtualServer.frontend.balance = this.virtualServer['balance'];
    this.clearData.virtualServer.backend.serviceName = this.virtualServer['serviceName'];
    this.clearData.virtualServer.backend.servicePort = this.virtualServer['servicePort'];
    this.originData.data.data = this.clearData;
  }

  onNoClick(): void {
    this.originData = null;
    this.dialogRef.close();
  }

}
