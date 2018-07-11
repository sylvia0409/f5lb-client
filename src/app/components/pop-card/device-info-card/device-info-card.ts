import {MAT_DIALOG_DATA} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";

@Component({
  selector: 'device-info-card',
  templateUrl: 'device-info-card.html',
  styleUrls: ['device-info-card.css']
})

export class DeviceInfoCardComponent implements OnInit{

  info = '';
  msg = '';
  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              @Inject('dataService') private dataService) { }

  ngOnInit() {
    this.dataService.getOneConfigMap('default', this.data.deviceName)
      .then((res) => {
        res.data.data = JSON.parse(res.data.data.replace("\\", "").replace(/\s/g, ""));
        this.info = JSON.stringify(res, null, 3);
      })
      .catch((error) => {
        this.msg = '获取信息失败';
        this.info = error;
      })
  }

}
