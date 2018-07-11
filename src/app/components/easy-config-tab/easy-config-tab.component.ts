import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from "@angular/material";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";
import {FormControl, Validators} from "@angular/forms";

const DEFAULT_CONTROLLER_CONFIG = {
  http_listen_address: '0.0.0.0:8080',
  log_level: 'INFO',
  node_poll_interval: '30',
  python_basedir: '/app/python',
  schema_db_base_dir: 'file:///app/vendor/src/f5/schemas',
  verify_interval: '30',
  vs_snat_pool_name: '',
  bigip_partition: '',
  bigip_url: '',
  bigip_username: '',
  bigip_password: ''
};

const DEFAULT_VIRTUAL_SERVER_CONFIG = {
  f5type: 'virtual-server',
  schema: "f5schemadb://bigip-virtual-server_v0.1.7.json",
  frontend: {
    partition: '',
    virtualAddress: {
      bindAddr: '',
      port: ''
    },
    balance: 'round-robin',
    mode: 'tcp',
    sslProfile: {
      f5ProfileName: '',
      f5ProfileNames: ''
    }
  },
  backend: {
    serviceName: '',
    servicePort: '',
    healthMonitors: {
      protocol: '',
      interval: 5,
      timeout: 16,
      send: "GET /rn",
      recv: ''
    }
  },
};

const DEFAULT_IAPP_CONFIG = {
  f5type: 'iapp',
  schema: "f5schemadb://bigip-virtual-server_v0.1.7.json",
  frontend: {
    partition: '',
    iapp: '',
    iappPoolMemberTable: '',
    iappTables: '',
    iappOptions: '',
    iappVariables: ''
  },
  backend: {
    serviceName: '',
    servicePort: '',
    healthMonitors: {
      protocol: '',
      interval: 5,
      timeout: 16,
      send: "GET /rn",
      recv: ''
    }
  },
};

@Component({
  selector: 'app-easy-config-tab',
  templateUrl: './easy-config-tab.component.html',
  styleUrls: ['./easy-config-tab.component.css']
})

export class EasyConfigTabComponent implements OnInit {
  menu = ['控制器设置', 'F5 资源设置'];
  types = ['虚拟服务器', 'iApp'];
  balances = ['round-robin', 'ratio-member', 'ratio-node', 'dynamic-ratio-member', 'dynamic-ratio-node',
    'fastest-node', 'fastest-application', 'least-connections-member', 'least-connections-node',
    'weighted-least-connections-member', 'weighted-least-connections-node', 'observed-member',
    'observed-node', 'predictive-member', 'predictive-node', 'least-sessions', 'ratio-least-connections'];
  modes = ['http', 'tcp', 'udp'];
  currentMenu = this.menu[0];
  currentType = this.types[0];

  //controller config form control
  usernameControl = new FormControl('', [Validators.required]);
  ctrPartitionControl = new FormControl('', [Validators.required]);
  urlControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  //F5 virtual server config form control
  vsPartitionControl = new FormControl('', [Validators.required]);
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
  newControllerConfig = Object.assign({}, DEFAULT_CONTROLLER_CONFIG);
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

    let data: any;
    let type = '';
    if (this.currentMenu == '控制器设置') {
      data = this._controllerFormFilter();
      type = 'controller';
    }
    if (this.currentMenu == 'F5 资源设置' && this.currentType == '虚拟服务器') {
      data = this._vsFormFilter();
      type = data.f5type;
    }
    if (this.currentMenu == 'F5 资源设置' && this.currentType == 'iapp') {
      data = this._iappFormFilter();
      type = data.f5type;
    }

    this.dataService.addConfigMap(data, type)
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
    if(this.currentMenu == '控制器设置') {
      this.newControllerConfig = Object.assign({}, DEFAULT_CONTROLLER_CONFIG);
    }
    if(this.currentMenu == 'F5 资源设置' && this.currentType == '虚拟服务器') {
      this.newVirtualServerConfig = JSON.parse(JSON.stringify(DEFAULT_VIRTUAL_SERVER_CONFIG));
    }
    if(this.currentMenu == 'F5 资源设置' && this.currentType == 'iApp') {
      this.newIappConfig = JSON.parse(JSON.stringify(DEFAULT_IAPP_CONFIG));
    }
  }

  private _validForm(): boolean {
    if(this.currentMenu == '控制器设置') {
      if( this.newControllerConfig['bigip_partition'] && this.newControllerConfig['bigip_url'] &&
          this.newControllerConfig['bigip_username'] && this.newControllerConfig['bigip_password']){
            return true;
      }
    }
    if(this.currentMenu == 'F5 资源设置' && this.currentType == '虚拟服务器') {
      if( this.newVirtualServerConfig['frontend']['partition'] &&
          this.newVirtualServerConfig['backend']['serviceName'] &&
          this.newVirtualServerConfig['backend']['servicePort']){
            return true;
      }
    }
    if(this.currentMenu == 'F5 资源设置' && this.currentType == 'iApp') {
      if( this.newIappConfig['frontend']['iapp'] &&
          this.newIappConfig['frontend']['iappPoolMemberTable'] &&
          this.newIappConfig['frontend']['iappOptions'] &&
          this.newIappConfig['frontend']['iappVariables'] &&
          this.newIappConfig['backend']['serviceName'] &&
          this.newIappConfig['backend']['servicePort']){
            return true;
      }
    }
    return false;
  }

  private _controllerFormFilter(): {} {
    let copy = Object.assign({}, this.newControllerConfig);
    for(let i in copy){
      if(!copy[i]) {
        delete copy[i];
      }
    }
    return copy;
  }

  private _vsFormFilter(): {} {
    let copy = JSON.parse(JSON.stringify(this.newVirtualServerConfig));
    if(!copy['frontend']['virtualAddress']['bindAddr'] &&
       !copy['frontend']['virtualAddress']['port']){
          delete copy['frontend']['virtualAddress'];
    }
    if(!copy['backend']['healthMonitors']['protocol']) {
        delete copy['backend']['healthMonitors'];
    }
    return copy;
  }

  private _iappFormFilter(): {} {
    let copy = JSON.parse(JSON.stringify(this.newVirtualServerConfig));
    if(!copy['frontend']['iappTables']) {
      delete copy['frontend']['iappTables'];
    }
    if(!copy['backend']['healthMonitors']['protocol']) {
      delete copy['backend']['healthMonitors'];
    }
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
