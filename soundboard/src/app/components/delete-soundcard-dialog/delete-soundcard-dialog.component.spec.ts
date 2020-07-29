import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSoundcardDialogComponent } from './delete-soundcard-dialog.component';

describe('DeleteSoundcardDialogComponent', () => {
  let component: DeleteSoundcardDialogComponent;
  let fixture: ComponentFixture<DeleteSoundcardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSoundcardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSoundcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
