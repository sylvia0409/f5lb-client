import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'add-device-card',
  templateUrl: 'add-device-card.html',
  styleUrls: ['add-device-card.css']
})

export class AddDeviceCardComponent {
  deviceNameControl = new FormControl('', [Validators.required]);
  addressControl = new FormControl('', [Validators.required]);
  partitionControl = new FormControl('', [Validators.required]);
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  @Output() result = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<AddDeviceCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

