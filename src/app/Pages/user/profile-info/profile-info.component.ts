import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../components/primeng/toast/toast.service';

@Component({
    selector: 'app-profile-info',
    imports: [FormsModule],
    templateUrl: './profile-info.component.html',
    styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
    private usersService = inject(UsersService);
    private toastService = inject(ToastService);
    private auth = inject(Auth);
    userId: any;
    id: any;
    loading = signal<boolean>(false);
    model: any = {
        userId: "",
        email: "",
        username: "",
        role: "user",
        fullname: "",
        photoURL: "",
        address: [],
        gender: "",
        dob: "",
        phoneNumber: ""
    };

    ngOnInit() {
        this.auth.onAuthStateChanged((user) => {
            this.userId = user?.uid;
            console.log(this.userId)
            this.fetchUser();
        });
    }

    fetchUser() {
        this.usersService.getUser(this.userId).subscribe(data => {
            this.model = data[0];
            this.id = data[0]?.id;
            console.log(this.model)
        });
    }

    onFormSubmit() {
        const { fullname, gender, dob, phoneNumber } = this.model;
        this.loading.set(true);
        if (fullname && gender && dob && phoneNumber) {
            this.usersService.updateUser(this.id, this.model).subscribe({
                next: (response) => {
                    console.log(response);
                    this.toastService.showMessage('success', 'Success', 'Profile Update successfully');
                    this.id = null;
                    setTimeout(() => {
                        this.loading.set(false);
                    }, 1500);
                },
                error: (error) => {
                    this.toastService.showMessage('error', 'Error', error.error.message);
                    console.error('Error Update Profile:', error.error);
                    setTimeout(() => {
                        this.loading.set(false);
                    }, 1500);
                }
            });
        } else {
            this.toastService.showMessage('warn', 'Warning', 'All Fields are required!');
            setTimeout(() => {
                this.loading.set(false);
            }, 1500);
        }

    }

}
