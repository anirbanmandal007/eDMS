import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  type: ToastType;
  title: string;
  body: string;
  delay: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  subject: BehaviorSubject<Toast>;
  toast$: Observable<Toast>;

  constructor() {
    this.subject = new BehaviorSubject<Toast>(null);
    this.toast$ = this.subject.asObservable()
      .pipe(filter(toast => toast !== null));
  }

  show(type: ToastType, title?: string, body?: string, delay?: number) {
    this.subject.next({ type, title, body, delay });
  }
}