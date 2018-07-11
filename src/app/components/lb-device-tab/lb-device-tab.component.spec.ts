import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbDeviceTabComponent } from './lb-device-tab.component';

describe('LbDeviceTabComponent', () => {
  let component: LbDeviceTabComponent;
  let fixture: ComponentFixture<LbDeviceTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbDeviceTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbDeviceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
