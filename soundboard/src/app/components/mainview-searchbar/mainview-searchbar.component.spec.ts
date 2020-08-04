import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainviewSearchbarComponent } from './mainview-searchbar.component';

describe('MainviewSearchbarComponent', () => {
  let component: MainviewSearchbarComponent;
  let fixture: ComponentFixture<MainviewSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainviewSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainviewSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
