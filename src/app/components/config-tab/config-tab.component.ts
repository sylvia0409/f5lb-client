import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-tab',
  templateUrl: './config-tab.component.html',
  styleUrls: ['./config-tab.component.css']
})
export class ConfigTabComponent implements OnInit {
  modes = ['简易模式', '专家模式'];
  currentMode = this.modes[0];

  constructor() { }

  ngOnInit() {
  }

}
