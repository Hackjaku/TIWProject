import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletService } from '../../../services/wallet-service';
import { UserDTO } from '../../../interfaces/User';
import { WalletDTO } from '../../../interfaces/Wallet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user-service';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-send-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './send-dialog.html',
  styleUrl: './send-dialog.scss'
})
export class SendDialog implements OnInit {

  @Input() currewallet!: WalletDTO;
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  filteredUsers$: Observable<UserDTO[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private _walletService: WalletService,
    private _userService: UserService, // Assuming you have a UserService to fetch users
    @Inject(MAT_DIALOG_DATA) public data: { wallet: WalletDTO }
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      Username: ['', Validators.required],
      Amount: [0, [Validators.required, Validators.min(0), this.maxAmountValidator.bind(this)]],
    });

    this.filteredUsers$ = this.form.controls['Username'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => this._userService.searchUser(value).pipe(
        catchError(() => of([])) // Handle errors gracefully
      ))
    );
  }

  onOptionSelected(user: UserDTO) {
    this.form.controls['Username'].setValue(user.Username, { emitEvent: false });
  }

  maxAmountValidator(control: any) {
    const maxAmount = this.data.wallet.AvailableBalance;
    if (control.value > maxAmount) {
      return { exceededBalance: true };
    }
    return null;
  }

  confirmSend() {
    if (this.form.invalid) {
      return;
    }

    console.log('Form submitted:', this.form.value);
  }
}
