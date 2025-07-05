import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { DataFetchService } from '../../../services/admin/useDataFetch';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { AuthService } from '../../../services/admin/auth.service';
import { CategoryService } from '../../../services/admin/category.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPencil, faRemove } from '@fortawesome/free-solid-svg-icons';
import { CategoryFormComponent } from "../category-form/category-form.component";

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, FontAwesomeModule, CategoryFormComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  faSearch = faSearch;
  faPencil = faPencil;
  faRemove = faRemove;
  fb = inject(NonNullableFormBuilder);
  private CategoryService = inject(CategoryService);
  private dataFetchService = inject(DataFetchService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  isView = signal<boolean>(false);
  isInsert = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isDelete = signal<boolean>(false);
  filteredCategoryList = signal<any[]>([]);
  CategoryOptions = signal<any[]>([]);
  highlightedTr: number = -1;
  selectedCategory: any;
  showModal = false;
  modalTitle = 'Add New Category';

  private searchQuery$ = new BehaviorSubject<string>('');
  isLoading$: Observable<any> | undefined;
  hasError$: Observable<any> | undefined;
  isSubmitted = signal<boolean>(false);
  options: any[] = ['View', 'Insert', 'Edit', 'Delete'];

  form = this.fb.group({
    name: ['', [Validators.required]],
    image: ['']
  });

  ngOnInit() {
    this.onLoadCategory();
    this.isView.set(this.checkPermission("Categories", "View"));
    this.isInsert.set(this.checkPermission("Categories", "Insert"));
    this.isEdit.set(this.checkPermission("Categories", "Edit"));
    this.isDelete.set(this.checkPermission("Categories", "Delete"));
  }

  openAddModal() {
    this.modalTitle = 'Add New Category';
    this.selectedCategory = null;
    this.showModal = true;
  }

  openEditModal(Category: any) {
    this.modalTitle = 'Edit Category';
    this.selectedCategory = Category;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCategory = null;
    this.isSubmitted.set(false);
  }

  handleFormSubmit(formData: any) {
    if (!this.isSubmitted()) {
      this.isSubmitted.set(true);
      if (this.selectedCategory) {
        this.CategoryService.updateCategory(this.selectedCategory.id, {
          ...formData,
          parentCategoryId: formData.parentCategoryId || null,
          permissionsKey: formData.permissionsKey || []
        }).subscribe({
          next: (response) => {
            if (response) {
              this.toastService.showMessage('success', 'Success', 'Category successfully updated!');
              const rest = this.filteredCategoryList().filter(d => d.id !== response.id);
              this.filteredCategoryList.set([response, ...rest]);
              this.closeModal();
              this.onLoadCategory();
            }
          },
          error: (error) => {
            console.error('Error updating Category:', error);
            this.toastService.showMessage('error', 'Error', `Error updating Category: ${error.error.message || error.error.title}`);
          }
        });
      } else {
        this.CategoryService.addCategory({
          ...formData,
          parentCategoryId: formData.parentCategoryId || null,
          permissionsKey: formData.permissionsKey || []
        }).subscribe({
          next: (response) => {
            if (response) {
              this.toastService.showMessage('success', 'Success', 'Category successfully added!');
              this.filteredCategoryList.set([response, ...this.filteredCategoryList()]);
              this.closeModal();
              this.onLoadCategory();
            }
          },
          error: (error) => {
            console.error('Error adding Category:', error);
            this.toastService.showMessage('error', 'Error', `Error adding Category: ${error.error.message || error.error.title}`);
          }
        });
      }
    }
  }


  checkPermission(moduleName: string, permission: string) {
    const modulePermission = this.authService.getUser()?.userMenu?.find((module: any) => module?.menuName?.toLowerCase() === moduleName.toLowerCase());
    if (modulePermission) {
      const permissionValue = modulePermission.permissions.find((perm: any) => perm.toLowerCase() === permission.toLowerCase());
      if (permissionValue) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onLoadCategory() {
    const { data$, isLoading$, hasError$ } = this.dataFetchService.fetchData(this.CategoryService.getCategory());

    this.isLoading$ = isLoading$;
    this.hasError$ = hasError$;
    // Combine the original data stream with the search query to create a filtered list
    combineLatest([
      data$,
      this.searchQuery$
    ]).pipe(
      map(([data, query]) =>
        data.filter((CategoryData: any) =>
          CategoryData.name?.toLowerCase().includes(query)
        )
      )
    ).subscribe(filteredData => {
      this.filteredCategoryList.set(filteredData.reverse());
      this.CategoryOptions.set(filteredData.map((CategoryData: any) => ({ key: CategoryData.id, value: name })));
    });
  }

  // Method to filter Category list based on search query
  onSearchCategory(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery$.next(query);
  }

  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.CategoryService.deleteCategory(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Success', 'Category successfully deleted!');
          this.filteredCategoryList.set(this.filteredCategoryList().filter(d => d.id !== id));
        } else {
          console.error('Error deleting Category:', data);
          this.toastService.showMessage('error', 'Error', `Error deleting Category: ${data.message}`);
        }
      });
    }
  }

}
