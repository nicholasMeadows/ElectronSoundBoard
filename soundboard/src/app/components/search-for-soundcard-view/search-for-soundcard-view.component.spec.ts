import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForSoundcardViewComponent } from './search-for-soundcard-view.component';

describe('SearchForSoundcardViewComponent', () => {
  let component: SearchForSoundcardViewComponent;
  let fixture: ComponentFixture<SearchForSoundcardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForSoundcardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForSoundcardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
