import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'change-iapp-card',
  templateUrl: 'change-iapp-card.html',
  styleUrls: ['change-iapp-card.css']
})

export class ChangeIappCardComponent implements OnInit{
  originData: any;
  clearData: any;
  iApp = {};
  login = {};
  partitionControl = new FormControl('', [Validators.required]);
  iAppControl = new FormControl('', [Validators.required]);
  serviceNameControl = new FormControl('', [Validators.required]);
  servicePortControl = new FormControl('', [Validators.required]);
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  @Output() result = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<ChangeIappCardComponent>,
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
        this.iApp['cmName'] = res.metadata.name;
        this.iApp['partition'] = this.clearData.virtualServer.frontend.partition;
        this.iApp['iapp'] = this.clearData.virtualServer.frontend.iapp;
        this.iApp['serviceName'] = this.clearData.virtualServer.backend.serviceName;
        this.iApp['servicePort'] = this.clearData.virtualServer.backend.servicePort;
      })
  }

  updateResult() {
    this.clearData.virtualServer.frontend.partition = this.iApp['partition'];
    this.clearData.virtualServer.frontend.iapp = this.iApp['iapp'];
    this.clearData.virtualServer.backend.serviceName = this.iApp['serviceName'];
    this.clearData.virtualServer.backend.servicePort = this.iApp['servicePort'];
    this.originData.data.data = this.clearData;
  }

  onNoClick(): void {
    this.originData = null;
    this.dialogRef.close();
  }

}
