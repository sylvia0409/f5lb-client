import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from "@angular/material";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {FormControl, Validators} from "@angular/forms";
import {DEFAULT_IAPP_CONFIG, DEFAULT_VIRTUAL_SERVER_CONFIG} from "../../models/default-config.model";


@Component({
  selector: 'app-easy-config-tab',
  templateUrl: './easy-config-tab.component.html',
  styleUrls: ['./easy-config-tab.component.css']
})

export class EasyConfigTabComponent implements OnInit {
  namespace = localStorage.getItem('DCE_TENANT');
  login = {
    username: '',
    password: ''
  };
  types = ['虚拟服务器', 'iApp'];
  balances = ['round-robin', 'ratio-member', 'ratio-node', 'dynamic-ratio-member', 'dynamic-ratio-node',
    'fastest-node', 'fastest-application', 'least-connections-member', 'least-connections-node',
    'weighted-least-connections-member', 'weighted-least-connections-node', 'observed-member',
    'observed-node', 'predictive-member', 'predictive-node', 'least-sessions', 'ratio-least-connections'];
  modes = ['http', 'tcp', 'udp'];
  currentType = this.types[0];

  //controller config form control
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  //F5 virtual server config form control
  vsPartitionControl = new FormControl('', [Validators.required]);
  addressControl = new FormControl('', [Validators.required]);
  vsServiceNameControl = new FormControl('', [Validators.required]);
  vsServicePortControl = new FormControl('', [Validators.required]);

  //F5 iApp config form control
  iPartitionControl = new FormControl('', [Validators.required]);
  iAppControl = new FormControl('', [Validators.required]);
  iappPoolMemberTableControl = new FormControl('', [Validators.required]);
  iappOptionsControl = new FormControl('', [Validators.required]);
  iappVariablesControl = new FormControl('', [Validators.required]);
  iappServiceNameControl = new FormControl('', [Validators.required]);
  iappServicePortControl = new FormControl('', [Validators.required]);

  //init forms
  newVirtualServerConfig = JSON.parse(JSON.stringify(DEFAULT_VIRTUAL_SERVER_CONFIG));
  newIappConfig = JSON.parse(JSON.stringify(DEFAULT_IAPP_CONFIG));

  constructor(@Inject('dataService') private dataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  submit() {
    if (!this._validForm()) {
      this._openFailedBar();
      return;
    }

    let submitData: any;

    if (this.currentType == '虚拟服务器') {
      submitData = this._vsFormFilter();
    }
    if (this.currentType == 'iApp') {
      submitData = this._iappFormFilter();
    }

    this.dataService.addConfigMap(submitData)
      .then(() => {
        this.clear();
        this._openSuccessBar();
      })
      .catch((error) => {
        console.error('Add config map failed', error);
        this._openFailedBar();
      })
  }

  clear() {
    if(this.currentType == '虚拟服务器') {
      this.newVirtualServerConfig = JSON.parse(JSON.stringify(DEFAULT_VIRTUAL_SERVER_CONFIG));
    }
    if(this.currentType == 'iApp') {
      this.newIappConfig = JSON.parse(JSON.stringify(DEFAULT_IAPP_CONFIG));
    }
  }

  private _validForm(): boolean {
    if(this.currentType == '虚拟服务器') {
      if( this.newVirtualServerConfig['data']['data']['virtualServer']['frontend']['partition'] &&
          this.newVirtualServerConfig['data']['data']['virtualServer']['frontend']['virtualAddress']['bindAddr'] &&
          this.newVirtualServerConfig['data']['data']['virtualServer']['frontend']['virtualAddress']['port'] &&
          this.newVirtualServerConfig['data']['data']['virtualServer']['backend']['serviceName'] &&
          this.newVirtualServerConfig['data']['data']['virtualServer']['backend']['servicePort']){
            return true;
      }
    }
    if(this.currentType == 'iApp') {
      if( this.newIappConfig['data']['data']['virtualServer']['frontend']['iapp'] &&
          this.newIappConfig['data']['data']['virtualServer']['frontend']['iappPoolMemberTable'] &&
          this.newIappConfig['data']['data']['virtualServer']['frontend']['iappOptions'] &&
          this.newIappConfig['data']['data']['virtualServer']['frontend']['iappVariables'] &&
          this.newIappConfig['data']['data']['virtualServer']['backend']['serviceName'] &&
          this.newIappConfig['data']['data']['virtualServer']['backend']['servicePort']){
            return true;
      }
    }
    return false;
  }

  private _vsFormFilter(): {} {
    let copy = JSON.parse(JSON.stringify(this.newVirtualServerConfig));
    var timestamp = (new Date()).valueOf().toString(32);
    copy.metadata.name = timestamp + '-vs';
    copy.metadata.namespace = this.namespace;
    if(!copy['data']['data']['virtualServer']['backend']['healthMonitors']['protocol']) {
        delete copy['data']['data']['virtualServer']['backend']['healthMonitors'];
    }
    copy['data']['data'] = JSON.stringify(copy['data']['data']);
    return copy;
  }

  private _iappFormFilter(): {} {
    let copy = JSON.parse(JSON.stringify(this.newIappConfig));
    let timestamp = (new Date()).valueOf().toString(32);
    copy.metadata.name = timestamp + '-iapp';
    copy.metadata.namespace = this.namespace;
    if(!copy['data']['data']['virtualServer']['frontend']['iappTables']) {
      delete copy['data']['data']['virtualServer']['frontend']['iappTables'];
    }
    if(!copy['data']['data']['virtualServer']['backend']['healthMonitors']['protocol']) {
      delete copy['data']['data']['virtualServer']['backend']['healthMonitors'];
    }
    copy['data']['data'] = JSON.stringify(copy['data']['data']);
    return copy;
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
