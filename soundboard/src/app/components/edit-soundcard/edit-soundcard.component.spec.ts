import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoundcardComponent } from './edit-soundcard.component';

describe('EditSoundcardComponent', () => {
  let component: EditSoundcardComponent;
  let fixture: ComponentFixture<EditSoundcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoundcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoundcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
