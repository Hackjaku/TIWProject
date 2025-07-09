import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { StorageService } from '../../services/storage-service';
import { LoginRequest, LoginResponse, RegisterUserDTO } from '../../interfaces/User';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.registerForm.valueChanges.subscribe(() => {
      if (this.registerForm.valid) {
        this.registerForm.controls['confirm_password'].setErrors(null);
      }
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.passwordMatchValidator();
    });
    this.registerForm.get('confirm_password')?.valueChanges.subscribe(() => {
      this.passwordMatchValidator();
    });
  }

  passwordMatchValidator(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      this.registerForm.controls['confirm_password'].setErrors({ mismatch: true });
    } else {
      this.registerForm.controls['confirm_password'].setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const userData: RegisterUserDTO = {
      Username: this.registerForm.value.username,
      FirstName: this.registerForm.value.first_name,
      LastName: this.registerForm.value.last_name,
      Email: this.registerForm.value.email,
      Password: this.registerForm.value.password
    };

    this._userService.register(userData).subscribe({
      next: (response: LoginResponse) => {
        console.log('Registration successful:', response);
        this._storageService.setLoggedUser(response);
        this._router.navigate(['/private/dashboard']); // Redirect to dashboard after successful registration
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }

}
