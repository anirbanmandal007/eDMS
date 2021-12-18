import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Toast } from './toast.interface';

@Component({
  selector: 'app-toaster',
  template: `
    <div class="toast toast-{{toast.type}}" 
      [style.bottom.px]="i*100">
      <h4 class="toast-heading my-3">{{toast.title}}</h4>
      <p>{{toast.body}}</p>
      <a class="close" (click)="remove.emit(i)">&times;</a>
    </div>
  `,
  styles: [`
    
  `]
})
export class ToasterComponent {
  @Input() toast: Toast;
  @Input() i: number;

  @Output() remove = new EventEmitter<number>();
}