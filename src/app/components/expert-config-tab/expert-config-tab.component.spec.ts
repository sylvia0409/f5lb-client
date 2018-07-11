import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertConfigTabComponent } from './expert-config-tab.component';

describe('ThirdTabComponent', () => {
  let component: ExpertConfigTabComponent;
  let fixture: ComponentFixture<ExpertConfigTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertConfigTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertConfigTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
