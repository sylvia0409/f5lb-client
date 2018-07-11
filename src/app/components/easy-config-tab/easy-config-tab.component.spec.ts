import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyConfigTabComponent } from './easy-config-tab.component';

describe('SecondTabComponent', () => {
  let component: EasyConfigTabComponent;
  let fixture: ComponentFixture<EasyConfigTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasyConfigTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyConfigTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
