import { Component, inject } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile-info',
    imports: [FormsModule],
    templateUrl: './profile-info.component.html',
    styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
    onFormSubmit() {
        throw new Error('Method not implemented.');
    }
    private usersService = inject(UsersService);
    private auth = inject(Auth);
    userId: any;
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
            console.log(this.model)
        });
    }

}
