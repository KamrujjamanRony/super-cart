import { Component, inject, signal } from '@angular/core';
import { SiteSettingService } from '../../../services/admin/site-settings.service';
import { DataFetchService } from '../../../services/admin/useDataFetch';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { AuthService } from '../../../services/admin/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SettingsFormComponent } from '../settings-form/settings-form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, SettingsFormComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private siteSettingService = inject(SiteSettingService);
  private dataFetchService = inject(DataFetchService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  isView = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  settings = signal<any>(null);
  siteId = environment.siteId;
  showModal = false;

  isLoading$: Observable<boolean> | undefined;
  hasError$: Observable<boolean> | undefined;

  ngOnInit() {
    this.loadSettings();
    this.isView.set(this.checkPermission("SiteSettings", "View"));
    this.isEdit.set(this.checkPermission("SiteSettings", "Edit"));
  }

  loadSettings() {
    const { data$, isLoading$, hasError$ } = this.dataFetchService.fetchData(
      this.siteSettingService.getSettingsById(this.siteId)
    );

    this.isLoading$ = isLoading$;
    this.hasError$ = hasError$;

    data$.subscribe(settings => {
      this.settings.set(settings);
    });
  }

  openEditModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  updateSettings(formData: any) {
    this.siteSettingService.updateSiteSettings(this.siteId, formData).subscribe({
      next: (response) => {
        this.toastService.showMessage('success', 'Success', 'Settings updated successfully!');
        this.settings.set(response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating settings:', error);
        this.toastService.showMessage('error', 'Error', `Error updating settings: ${error.error.message || error.error.title}`);
      }
    });
  }

  checkPermission(moduleName: string, permission: string) {
    const modulePermission = this.authService.getUser()?.userMenu?.find(
      (module: any) => module?.menuName?.toLowerCase() === moduleName.toLowerCase()
    );
    return !!modulePermission?.permissions?.find(
      (perm: any) => perm.toLowerCase() === permission.toLowerCase()
    );
  }

}
