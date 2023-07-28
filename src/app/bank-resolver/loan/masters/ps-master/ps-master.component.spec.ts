import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsMasterComponent } from './ps-master.component';

describe('PsMasterComponent', () => {
  let component: PsMasterComponent;
  let fixture: ComponentFixture<PsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
