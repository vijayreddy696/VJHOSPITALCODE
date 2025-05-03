import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LeaveBalanceService } from '../leave-balance.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  prev: string;
  current: string;
  name: string;
}

@Component({
  selector: 'app-leave-balance-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
})
export class LeaveBalanceDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<LeaveBalanceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public leaveBalanceService: LeaveBalanceService
  ) {}
  confirmDelete(): void {
    this.leaveBalanceService.deleteLeaveBalance(this.data.id).subscribe({
      next: (response) => {
        // console.log('Delete Response:', response);
        this.dialogRef.close(response); // Close with the response data
        // Handle successful deletion, e.g., refresh the table or show a notification
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle the error appropriately
      },
    });
  }
}
