import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timeout: number;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  createToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', timeout: number = 2000) {
    const newToast: Toast = {
      id: this.counter++,
      message,
      type,
      timeout,
      visible: true,
    };

    console.log(newToast)

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    setTimeout(() => this.destroyToast(newToast.id), timeout);
  }

  destroyToast(id: number) {
    const updatedToasts = this.toastsSubject.value.map((toast) =>
      toast.id === id ? { ...toast, visible: false } : toast
    );
    this.toastsSubject.next(updatedToasts);
  }
}
