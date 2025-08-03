import { Component, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { UserService } from '../../../services/admin/user.service';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { UserAccessTreeComponent } from '../../../components/admin/user-access-tree/user-access-tree.component';
import { CommonModule } from '@angular/common';
import { DataFetchService } from '../../../services/admin/useDataFetch';
import { MenuService } from '../../../services/admin/menu.service';
import { AuthService } from '../../../services/admin/auth.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPencil, faRemove } from '@fortawesome/free-solid-svg-icons';
import { AdminFormComponent } from '../admin-form/admin-form.component';

@Component({
  selector: 'app-admin-list',
  imports: [UserAccessTreeComponent, CommonModule, FontAwesomeModule, AdminFormComponent],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {
  faSearch = faSearch;
  faPencil = faPencil;
  faRemove = faRemove;
  fb = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private dataFetchService = inject(DataFetchService);
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  isView = signal<boolean>(false);
  isInsert = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isDelete = signal<boolean>(false);
  filteredUserList = signal<any[]>([]);
  highlightedTr: number = -1;
  selectedUser: any;
  showModal = false;
  modalTitle = 'Add New Admin';

  private searchQuery$ = new BehaviorSubject<string>('');
  userAccessTree = signal<any[]>([]);
  showAccessTree = signal<boolean>(false);
  isLoading$: Observable<any> | undefined;
  hasError$: Observable<any> | undefined;
  isSubmitted = false;

  form = this.fb.group({
    userName: ['', [Validators.required]],
    password: [''],
    eId: null,
    isActive: [true],
    menuPermissions: [['']],
  });

  ngOnInit(): void {
    this.onLoadTreeData("");

    this.onLoadUsers();

    this.isView.set(this.checkPermission("Admin List", "View"));
    this.isInsert.set(this.checkPermission("Admin List", "Insert"));
    this.isEdit.set(this.checkPermission("Admin List", "Edit"));
    this.isDelete.set(this.checkPermission("Admin List", "Delete"));
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

  openAddModal() {
    this.modalTitle = 'Add New User';
    this.selectedUser = null;
    this.onLoadTreeData("");
    this.showModal = true;
    this.showAccessTree.set(true);
  }

  openEditModal(user: any) {
    this.modalTitle = 'Edit User';
    this.selectedUser = user;
    this.onLoadTreeData(user.id);
    this.showModal = true;
    this.showAccessTree.set(true);
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.showAccessTree.set(false);
  }

  onLoadTreeData(userId: any) {
    this.menuService.generateTreeData(userId).subscribe((data) => {
      this.userAccessTree.set(data);
      this.showAccessTree.set(data.length > 0);
    });
  }

  handleFormSubmit(formData: any): any {
    // Save permissions before submitting
    this.savePermissions();

    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, {
        ...formData,
        menuPermissions: this.userAccessTree()
      }).subscribe({
        next: (response) => {
          if (response) {
            this.toastService.showMessage('success', 'Successful', 'User successfully updated!');
            this.onLoadUsers();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastService.showMessage('error', 'Error', `${error.error.status} : ${error.error.message || error.error.title}`);
        }
      });
    } else {
      this.userService.addUser({
        ...formData,
        menuPermissions: this.userAccessTree()
      }).subscribe({
        next: (response: any) => {
          if (response) {
            this.toastService.showMessage('success', 'Successful', 'User successfully added!');
            this.onLoadUsers();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.toastService.showMessage('error', 'Error', `${error.error.status} : ${error.error.message || error.error.title}`);
        }
      });
    }
  }

  onLoadUsers() {
    const { data$, isLoading$, hasError$ } = this.dataFetchService.fetchData(this.userService.getUser(""));

    this.isLoading$ = isLoading$;
    this.hasError$ = hasError$;
    // Combine the original data stream with the search query to create a filtered list
    combineLatest([
      data$,
      this.searchQuery$
    ]).pipe(
      map(([data, query]) =>
        data.filter((UserData: any) =>
          UserData.userName?.toLowerCase().includes(query)
        )
      )
    ).subscribe(filteredData => {     // ToDo: user data request due
      if (!this.searchQuery$.getValue() || this.searchQuery$.getValue()?.toLowerCase() === 's' || this.searchQuery$.getValue()?.toLowerCase() === 'su' || this.searchQuery$.getValue()?.toLowerCase() === 'sup' || this.searchQuery$.getValue()?.toLowerCase() === 'supe' || this.searchQuery$.getValue()?.toLowerCase() === 'super' || this.searchQuery$.getValue()?.toLowerCase() === 'supers' || this.searchQuery$.getValue()?.toLowerCase() === 'superso' || this.searchQuery$.getValue()?.toLowerCase() === 'supersof' || this.searchQuery$.getValue()?.toLowerCase() === 'supersoft') {
        filteredData.shift();
      }
      this.filteredUserList.set(filteredData)
    });
  }

  // Method to filter User list based on search query
  onSearchUser(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery$.next(query);
  }

  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.userService.deleteUser(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Successful', 'User deleted successfully!');
          this.filteredUserList.set(this.filteredUserList().filter(d => d.id !== id));
        } else {
          console.error('Error deleting User:', data);
          this.toastService.showMessage('error', 'Error Deleting', data.message);
        }
      });
    }
  }

  // User Accessibility Code Start----------------------------------------------------------------

  savePermissions() {
    // const selectedNodes = this.getSelectedNodes(this.userAccessTree());
    const selectedNodes = this.userAccessTree();
    // console.log('Selected Access:', selectedNodes);
    this.form.patchValue({ menuPermissions: selectedNodes });
  }

  private getSelectedNodes(nodes: any[]): any[] {
    return nodes.reduce((acc: any[], node: any) => {
      // Recursively update the isSelected property of parent nodes
      this.updateParentSelection(node);

      // Include node if it is selected or has selected children
      if (node.isSelected || (node.children && node.children.some((child: any) => child.isSelected))) {
        const selectedPermissions = node.permissionsKey
          ?.filter((p: any) => p.isSelected)
          .map((p: any) => p.permission);

        acc.push({
          menuId: node.id,
          PermissionKey: selectedPermissions || [], // Include empty array if no permissions
        });
      }

      // Flatten selected children into the same array
      if (node.children) {
        acc.push(...this.getSelectedNodes(node.children));
      }

      return acc;
    }, []);
  }

  private updateParentSelection(node: any): boolean {
    // Check if the node has children
    if (node.children && node.children.length > 0) {
      // console.log('Processing node:', node.menuName, 'isSelected:', node.isSelected);

      // Recursively update the isSelected property of children
      const anyChildSelected = node.children.some((child: any) => this.updateParentSelection(child));
      // console.log('Any child selected for node', node.menuName, ':', anyChildSelected);

      // Update the current node's isSelected property based on its children
      node.isSelected = anyChildSelected || node.isSelected;
      // console.log('Updated node', node.menuName, 'isSelected:', node.isSelected);

      return node.isSelected;
    }
    return node.isSelected;
  }

  // User Accessibility Code End----------------------------------------------------------------
}
