import {Component, Inject, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";


@Component({
  selector: 'app-expert-config-tab',
  templateUrl: './expert-config-tab.component.html',
  styleUrls: ['./expert-config-tab.component.css']
})

export class ExpertConfigTabComponent implements OnInit {
  url = '';
  editedYaml = '#请在此输入yaml\n';
  config = {mode: 'yaml', theme: 'eclipse', lineNumbers: true};

  constructor(@Inject('dataService') private dataService,
              private snackBar: MatSnackBar) {  }

  ngOnInit() {
    if (document.getElementById('code')) {
      document.getElementById('code').click();
    }
  }

  submit() {
    this.dataService.addConfigMap(this.editedYaml)
      .then(() => {
        this.clear();
        this._openSuccessBar()
      })
      .catch((error) => {
        console.error('Submit yaml failed', error);
        this._openFailedBar();
      })
  }

  clear() {
    this.editedYaml = '#请在此输入yaml\n';
    this.url = '';
  }

  selectFile(files: FileList) {
    let file = files.item(0);
    if(file) {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        this.editedYaml = '#' + file.name +'\n' + fileReader.result;
      };
      fileReader.readAsText(file);
    }
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

