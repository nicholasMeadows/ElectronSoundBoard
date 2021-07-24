import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopallsoundsComponent } from './stop-all-sounds.component';

describe('StopallsoundsComponent', () => {
  let component: StopallsoundsComponent;
  let fixture: ComponentFixture<StopallsoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopallsoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopallsoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
