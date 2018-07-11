import {AfterViewInit, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {SuccessComponent} from "../snackbar/success-bar";
import {FailedComponent} from "../snackbar/failed-bar";


@Component({
  selector: 'app-expert-config-tab',
  templateUrl: './expert-config-tab.component.html',
  styleUrls: ['./expert-config-tab.component.css']
})

export class ExpertConfigTabComponent implements OnInit, AfterViewInit {

  fileToUpload: File = null;
  fileName = '';
  editedYaml = '#请在此输入yaml#\n';
  config = {mode: 'yaml', theme: 'eclipse', lineNumbers: true};

  constructor(@Inject('dataService') private dataService,
              private snackBar: MatSnackBar,
              private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (document.getElementById('code')) {
      document.getElementById('code').click();
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.getElementsByClassName('CodeMirror-sizer')[0].setAttribute('style','margin-left: 30px; min-width: 3px; padding-right: 0px; padding-bottom: 0px; margin-bottom: 0px; border-right-width: 30px; min-height: 172px;');
    this.elementRef.nativeElement.getElementsByClassName('CodeMirror-gutter')[0].setAttribute('style','width: 29px;');
    this.elementRef.nativeElement.getElementsByClassName('CodeMirror-gutters')[0].setAttribute('style', 'left: 0px; height: 202px;');
  }

  onFocus() {
    if(document.getElementsByClassName('CodeMirror-cursor')[0]){
      document.getElementsByClassName('CodeMirror-cursor')[0]
              .setAttribute('style','left: 4px; top: 20px; height: 16px;');
    }
  }

  submit() {
    let data: any;
    let type = '';
    if(this.fileToUpload) {
      data = this.fileToUpload;
      type = 'file';
    } else {
      data = this.editedYaml.split('#')[2];
      type = 'text';
    }
    this.dataService.addConfigMap('default', data, type)
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
    this.editedYaml = '';
    this.fileToUpload = null;
    this.fileName = '';
  }

  selectFile(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name;
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

