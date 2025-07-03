import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletService } from '../../../services/wallet-service';
import { UserDTO } from '../../../interfaces/User';
import { TransferCurrencyDTO, WalletDTO } from '../../../interfaces/Wallet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user-service';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-send-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './send-dialog.html',
  styleUrl: './send-dialog.scss'
})
export class SendDialog implements OnInit {

  @Input() currewallet!: WalletDTO;
  @Output() sendConfirmed = new EventEmitter<TransferCurrencyDTO>();

  form!: FormGroup;
  filteredUsers$: Observable<UserDTO[]> = of([]);
  selectedUser: UserDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private _walletService: WalletService,
    private _userService: UserService, // Assuming you have a UserService to fetch users
    @Inject(MAT_DIALOG_DATA) public data: { wallet: WalletDTO },
    private dialogRef: MatDialogRef<SendDialog>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      Username: ['', Validators.required],
      Amount: [0, [Validators.required, Validators.min(0), this.maxAmountValidator.bind(this)]],
    });

    this.filteredUsers$ = this.form.controls['Username'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((username: string) => {
        if (username.length < 4) {
          return of([]); // Return empty array if input is too short
        }
        return this._userService.searchUser(username).pipe(
          catchError(() => of([])) // Handle errors and return empty array
        );
      })
    );
  }

  onOptionSelected(user: UserDTO) {
    this.form.patchValue({ Username: user.Username });
    this.selectedUser = user; // Store the selected user
  }

  maxAmountValidator(control: any) {
    const maxAmount = this.data.wallet.AvailableBalance;
    if (control.value > maxAmount) {
      return { exceededBalance: true };
    }
    return null;
  }

  confirmSend() {
    if (this.form.invalid || !this.selectedUser) {
      return;
    }

    const transfer: TransferCurrencyDTO = {
      CurrencyId: this.data.wallet.CurrencyId,
      WalletId: this.data.wallet.WalletId,
      Amount: this.form.value.Amount,
      OwnerId: this.selectedUser.Id // Assuming Username is the user ID
    }

    this._walletService.transferCurrency(transfer).subscribe({
      next: () => {
        console.log('Transfer successful');
        this.sendConfirmed.emit(transfer); // Emit the transfer data
        this.dialogRef.close(transfer); // Close the dialog and pass the transfer data
      },
      error: (err) => {
        console.error('Transfer failed', err);
        this.dialogRef.close(); // Close the dialog on error
      }
    });
  }
}
