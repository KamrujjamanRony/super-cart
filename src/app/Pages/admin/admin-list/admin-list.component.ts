import { Component, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { UserService } from '../../../services/admin/user.service';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserAccessTreeComponent } from '../../../components/admin/user-access-tree/user-access-tree.component';
import { FieldComponent } from '../../../components/admin/field/field.component';
import { CommonModule } from '@angular/common';
import { DataFetchService } from '../../../services/admin/useDataFetch';
import { MenuService } from '../../../services/admin/menu.service';
import { AuthService } from '../../../services/admin/auth.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPencil, faRemove } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-list',
  imports: [ReactiveFormsModule, UserAccessTreeComponent, FieldComponent, CommonModule, FontAwesomeModule],
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

  private searchQuery$ = new BehaviorSubject<string>('');
  userAccessTree = signal<any[]>([]);
  isLoading$: Observable<any> | undefined;
  hasError$: Observable<any> | undefined;
  readonly inputRefs = viewChildren<ElementRef>('inputRef');
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
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

    // Focus on the search input when the component is initialized
    setTimeout(() => {
      const inputs = this.inputRefs();
      inputs[0]?.nativeElement.focus();
    }, 10);
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

  onLoadTreeData(userId: any) {
    this.menuService.generateTreeData(userId).subscribe((data) => {
      this.userAccessTree.set(data);
    });
  }

  onLoadUsers() {
    const { data$, isLoading$, hasError$ } = this.dataFetchService.fetchData(this.userService.getUser(""));     // ToDo: user data request due

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
    ).subscribe(filteredData => {
      filteredData.shift();                   // todo: remove first element of user list
      this.filteredUserList.set(filteredData)
    });
  }

  // Method to filter User list based on search query
  onSearchUser(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery$.next(query);
  }

  // Simplified method to get form controls
  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }


  handleEnterKey(event: Event, currentIndex: number) {
    const keyboardEvent = event as KeyboardEvent;
    event.preventDefault();
    const allInputs = this.inputRefs();
    const inputs = allInputs.filter((i: any) => !i.nativeElement.disabled);

    if (currentIndex + 1 < inputs.length) {
      inputs[currentIndex + 1].nativeElement.focus();
    } else {
      this.onSubmit(keyboardEvent);
    }
  }

  handleSearchKeyDown(event: KeyboardEvent) {
    if (this.filteredUserList().length === 0) {
      return; // Exit if there are no items to navigate
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const inputs = this.inputRefs();
      inputs[0].nativeElement.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevent default scrolling behavior
      this.highlightedTr = (this.highlightedTr + 1) % this.filteredUserList().length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // Prevent default scrolling behavior
      this.highlightedTr =
        (this.highlightedTr - 1 + this.filteredUserList().length) % this.filteredUserList().length;
    } else if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission

      // Call onUpdate for the currently highlighted item
      if (this.highlightedTr !== -1) {
        const selectedItem = this.filteredUserList()[this.highlightedTr];
        this.onUpdate(selectedItem);
        this.highlightedTr = -1;
      }
    }
  }

  onSubmit(e: Event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.savePermissions();
      if (this.selectedUser) {
        this.userService.updateUser(this.selectedUser.id, this.form.value)
          .subscribe({
            next: (response) => {
              if (response !== null && response !== undefined) {
                this.toastService.showMessage('success', 'Successful', 'User successfully updated!');
                this.onLoadUsers();
                this.isSubmitted = false;
                this.selectedUser = null;
                this.formReset(e);
              }

            },
            error: (error) => {
              console.error('Error register:', error);
              if (error.error.message || error.error.title) {
                this.toastService.showMessage('error', 'Error', `${error.error.status} : ${error.error.message || error.error.title}`);
              }
            }
          });
      } else {
        this.userService.addUser(this.form.value)
          .subscribe({
            next: (response) => {
              if (response !== null && response !== undefined) {
                this.toastService.showMessage('success', 'Successful', 'User successfully added!');
                this.onLoadUsers();
                this.isSubmitted = false;
                this.formReset(e);
              }

            },
            error: (error) => {
              console.error('Error add user:', error);
              if (error.error.message || error.error.title) {
                this.toastService.showMessage('error', 'Error', `${error.error.status} : ${error.error.message || error.error.title}`);
              }
            }
          });
      }
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Recommended Field!');
    }
  }

  onUpdate(data: any) {
    this.onLoadTreeData(data.id);
    this.selectedUser = data;
    this.form.patchValue({
      userName: data?.userName,
      password: data?.password,
      eId: data?.eId,
      isActive: data?.isActive,
      menuPermissions: data?.menuPermissions,
    });

    // Focus the 'userName' input field after patching the value
    setTimeout(() => {
      const inputs = this.inputRefs();
      inputs[0].nativeElement.focus();
    }, 0); // Delay to ensure the DOM is updated
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

  formReset(e: Event): void {
    e.preventDefault();
    this.form.reset({
      userName: '',
      password: '',
      eId: null,
      isActive: true,
      menuPermissions: [''],
    });
    this.onLoadTreeData("");
    this.isSubmitted = false;
    this.selectedUser = null;
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
