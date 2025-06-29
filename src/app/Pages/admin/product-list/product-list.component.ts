import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPencil, faRemove, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../../../services/product.service';
import { DataFetchService } from '../../../services/admin/useDataFetch';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { AuthService } from '../../../services/admin/auth.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FontAwesomeModule, ProductFormComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  faSearch = faSearch;
  faPencil = faPencil;
  faRemove = faRemove;
  private productService = inject(ProductService);
  private dataFetchService = inject(DataFetchService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  isView = signal<boolean>(false);
  isInsert = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isDelete = signal<boolean>(false);
  filteredProductList = signal<any[]>([]);
  highlightedTr: number = -1;
  selectedProduct: any = null;
  showModal = false;
  modalTitle = 'Add New Product';
  categories = signal<string[]>([]);
  brands = signal<string[]>([]);

  private searchQuery$ = new BehaviorSubject<string>('');
  isLoading$: Observable<any> | undefined;
  hasError$: Observable<any> | undefined;

  ngOnInit(): void {
    this.onLoadProducts();
    this.loadCategoriesAndBrands();

    this.isView.set(this.checkPermission("Product List", "View"));
    this.isInsert.set(this.checkPermission("Product List", "Insert"));
    this.isEdit.set(this.checkPermission("Product List", "Edit"));
    this.isDelete.set(this.checkPermission("Product List", "Delete"));
  }

  openAddModal() {
    this.modalTitle = 'Add New Product';
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEditModal(product: any) {
    this.modalTitle = 'Edit Product';
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  loadCategoriesAndBrands() {
    this.categories.set([
      'Electronics',
      'Clothing',
      'Home Appliances',
      'Books',
      'Sports',
      'Beauty & Health',
      'Toys & Games',
      'Automotive',
      'Grocery'
    ]);
    this.brands.set([
      'Samsung',
      'Apple',
      'Sony',
      'Nike',
      'Adidas',
      'LG',
      'Dell',
      'HP',
      'Canon',
      'Philips'
    ]);
    // this.productService.getCategories().subscribe(categories => {
    //   this.categories.set(categories);
    // });
    // this.productService.getBrands().subscribe(brands => {
    //   this.brands.set(brands);
    // });
  }

  onLoadProducts() {
    const { data$, isLoading$, hasError$ } = this.dataFetchService.fetchData(this.productService.getProducts());

    this.isLoading$ = isLoading$;
    this.hasError$ = hasError$;

    combineLatest([
      data$,
      this.searchQuery$
    ]).pipe(
      map(([data, query]) =>
        data.filter((product: any) =>
          product.name?.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
        )
      )
    ).subscribe(filteredData => {
      this.filteredProductList.set(filteredData);
    });
  }

  onSearchProduct(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery$.next(query);
  }

  handleFormSubmit(formData: any) {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, formData)
        .subscribe({
          next: (response) => {
            if (response) {
              this.toastService.showMessage('success', 'Success', 'Product successfully updated!');
              this.onLoadProducts();
              this.closeModal();
            }
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.toastService.showMessage('error', 'Error', `Error updating product: ${error.error.message || error.error.title}`);
          }
        });
    } else {
      this.productService.addProduct(formData)
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.toastService.showMessage('success', 'Success', 'Product successfully added!');
              this.onLoadProducts();
              this.closeModal();
            }
          },
          error: (error) => {
            console.error('Error adding product:', error);
            this.toastService.showMessage('error', 'Error', `Error adding product: ${error.error.message || error.error.title}`);
          }
        });
    }
  }

  onDelete(id: any) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          this.toastService.showMessage('success', 'Success', 'Product deleted successfully!');
          this.onLoadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.toastService.showMessage('error', 'Error', `Error deleting product: ${error.error.message || error.error.title}`);
        }
      });
    }
  }

  checkPermission(moduleName: string, permission: string) {
    const modulePermission = this.authService.getUser()?.userMenu?.find((module: any) => module?.menuName?.toLowerCase() === moduleName.toLowerCase());
    if (modulePermission) {
      const permissionValue = modulePermission.permissions.find((perm: any) => perm.toLowerCase() === permission.toLowerCase());
      if (permissionValue) {
        return true;
      }
    }
    return false;
  }

}
