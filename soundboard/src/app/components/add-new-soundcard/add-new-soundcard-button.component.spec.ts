import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSoundcardButtonComponent } from './add-new-soundcard-button.component';

describe('AddNewSoundcardComponent', () => {
  let component: AddNewSoundcardButtonComponent;
  let fixture: ComponentFixture<AddNewSoundcardButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSoundcardButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSoundcardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
