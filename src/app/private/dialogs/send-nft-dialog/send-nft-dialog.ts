import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NftDTO, TransferNftDTO } from '../../../interfaces/Nft';
import { UserDTO } from '../../../interfaces/User';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { NftService } from '../../../services/nft-service';
import { UserService } from '../../../services/user-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-nft-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './send-nft-dialog.html',
  styleUrl: './send-nft-dialog.scss'
})
export class SendNftDialog implements OnInit {

  @Input() selectedNft!: NftDTO;
  @Output() sendConfirmed = new EventEmitter<NftDTO>();

  form!: FormGroup;
  filteredUsers$: Observable<UserDTO[]> = of([]);
  selectedUser: UserDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private _nftService: NftService,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { nft: NftDTO },
    private dialogRef: MatDialogRef<SendNftDialog>
  ) { }

  ngOnInit(): void {

    console.log('SendNftDialog initialized with NFT:', this.data.nft);

    this.form = this.fb.group({
      Username: [''],
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
        )
      })
    );
  }

  onOptionSelected(user: UserDTO): void {
    this.form.patchValue({ Username: user.Username });
    this.selectedUser = user;
  }

  confirmSend(): void {
    if (!this.selectedUser) {
      console.error('No user selected');
      return;
    }

    console.log('Sending to selected user:', this.selectedUser);
    const transferNft: TransferNftDTO = {
      NftId: this.data.nft.Id,
      NewOwnerId: this.selectedUser.Id
    }

    this._nftService.transferNft(transferNft).subscribe({
      next: () => {
        console.log('NFT sent successfully');
        this.sendConfirmed.emit(this.data.nft);
        this.dialogRef.close(true); // Close the dialog and return true
      },
      error: (err) => {
        console.error('Error sending NFT:', err);
        this.dialogRef.close(false); // Close the dialog and return false
      }
    });

  }

}
