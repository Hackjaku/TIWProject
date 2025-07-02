import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Route, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _storageService: StorageService,
    private _router: Router
  ) {
    console.log('Login component initialized');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }



  onSubmit(): void {
    this._userService.login(
      this.loginForm.value.username,
      this.loginForm.value.password
    ).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this._storageService.setLoggedUser(response);
        this._router.navigate(['/private/dashboard']); // Redirect to dashboard after successful login
      },
      error: (error) => {
        console.error('Login failed:', error);
        // Handle login failure, e.g., show an error message
      }
    })
  }

}
