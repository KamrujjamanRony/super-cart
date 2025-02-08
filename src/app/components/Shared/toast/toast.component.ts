import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="fixed z-50 top-0 right-0 p-4 max-w-xs">
      @for (toast of toastService.toasts$ | async; track $index) {
        @if (toast.visible) {
        <div @toastAnimation class="mb-4 rounded-lg shadow-lg p-3 text-white flex items-center"
          [ngClass]="getToastClass(toast.type)">
          <span>{{ toast.message }}</span>
          <button class="ml-auto" (click)="toastService.destroyToast(toast.id)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        }
      }
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }

  getToastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }
  
}
