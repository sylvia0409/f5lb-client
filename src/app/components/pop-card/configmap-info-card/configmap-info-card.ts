import {MAT_DIALOG_DATA} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {tryCatch} from "rxjs/internal/util/tryCatch";

@Component({
  selector: 'device-info-card',
  templateUrl: 'configmap-info-card.html',
  styleUrls: ['configmap-info-card.css']
})

export class ConfigmapInfoCardComponent implements OnInit{

  info = '';
  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              @Inject('dataService') private dataService) { }

  ngOnInit() {
    this.dataService.getOneConfigMap(this.data.cmName)
      .then((res) => {
        res.data.data = JSON.parse(res.data.data);
        if(res.metadata.labels.f5type == 'iapp'){
          try{
            res.data.data.virtualServer.frontend.iappPoolMemberTable = JSON.parse(res.data.data.virtualServer.frontend.iappPoolMemberTable.replace('\\', '').replace(/{n/g, '{'));
            res.data.data.virtualServer.frontend.iappOptions = JSON.parse(res.data.data.virtualServer.frontend.iappOptions.replace('\\', '').replace(/{n/g, '{'));
            res.data.data.virtualServer.frontend.iappVariables = JSON.parse(res.data.data.virtualServer.frontend.iappVariables.replace('\\', '').replace(/{n/g, '{'));
            if(res.data.data.virtualServer.frontend.iappTables){
              res.data.data.virtualServer.frontend.iappTables = JSON.parse(res.data.data.virtualServer.frontend.iappTables.replace('\\', '').replace(/{n/g, '{'));
            }
          }
          catch(err) {
            console.error('Json parse error', err);
          }
        }
        this.info = JSON.stringify(res, null, 4);
      })
      .catch((error) => {
        this.info = '获取ConfigMap失败, 错误如下：\n\n' + JSON.stringify(error, null, 4);
      })
  }

}
