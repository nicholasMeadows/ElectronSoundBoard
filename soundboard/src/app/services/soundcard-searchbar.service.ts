import { Observable, Subscriber, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundcardSearchService {
  // updateSearchObs: Observable<string>;
  // updateSearchSubscriber: Subscriber<string>;
  updateSearchBS: BehaviorSubject<string>;
  searchCriteria: string = "";
  constructor() { }

  getUpdateSearchBS() {
    if (this.updateSearchBS == undefined) {
      this.updateSearchBS = new BehaviorSubject<string>(this.searchCriteria);
    }
    return this.updateSearchBS;



    // if (this.updateSearchObs == undefined) {
    //   return new Observable<string>(obs => {
    //     this.updateSearchSubscriber = obs;
    //   })
    // }
    // return this.updateSearchObs;
  }

  updateSearchCriteria(currentSearch: string) {
    this.searchCriteria = currentSearch;
    this.updateSearchBS.next(this.searchCriteria);
    // if (undefined != this.updateSearchSubscriber)
    //   this.updateSearchSubscriber.next(currentSearch);
  }
}
