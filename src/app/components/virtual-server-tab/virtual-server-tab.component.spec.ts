import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {VirtualServerTabComponent} from './virtual-server-tab.component';

describe('VirtualServerTabComponent', () => {
  let component: VirtualServerTabComponent;
  let fixture: ComponentFixture<VirtualServerTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualServerTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualServerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
