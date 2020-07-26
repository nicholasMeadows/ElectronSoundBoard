import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSoundcardDialogComponent } from './add-new-soundcard-dialog.component';

describe('AddNewSoundcardDialogComponent', () => {
  let component: AddNewSoundcardDialogComponent;
  let fixture: ComponentFixture<AddNewSoundcardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSoundcardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSoundcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
