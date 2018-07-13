import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IappTabComponent } from './iapp-tab.component';

describe('IappTabComponent', () => {
  let component: IappTabComponent;
  let fixture: ComponentFixture<IappTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IappTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IappTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
