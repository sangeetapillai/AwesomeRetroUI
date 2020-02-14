import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrocardComponent } from './retrocard.component';

describe('RetrocardComponent', () => {
  let component: RetrocardComponent;
  let fixture: ComponentFixture<RetrocardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrocardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
