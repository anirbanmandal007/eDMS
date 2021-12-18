import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ToasterService } from './toaster.service';
import { Toast } from './toast.interface';

@Component({
  selector: 'app-toaster-container',
  template: `
    <app-toaster *ngFor="let toast of toasts; let i=index" 
      [toast]="toast" [i]="i"
      (remove)="remove($event)"></app-toaster>
  `,
  styleUrls: ['./toaster.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToasterContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toaster: ToasterService) {}

  ngOnInit() {
    this.toaster.toast$.subscribe((toast) => {
      this.toasts = [toast, ...this.toasts];
      setTimeout(() => this.toasts.pop(), toast.delay || 6000);
    });
  }

  remove(index: number) {
    this.toasts = this.toasts.filter((v, i) => i !== index);
    //this.toasts.splice(index, 1);
  }
}
