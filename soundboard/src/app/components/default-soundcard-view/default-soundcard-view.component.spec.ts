import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSoundcardViewComponent } from './default-soundcard-view.component';

describe('DefaultSoundcardViewComponent', () => {
  let component: DefaultSoundcardViewComponent;
  let fixture: ComponentFixture<DefaultSoundcardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultSoundcardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultSoundcardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
