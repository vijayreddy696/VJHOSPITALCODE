import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

export interface DialogData {
  id: number;
  name: string;
  department: string;
  mobile: string;
}

@Component({
  selector: 'app-commondelete',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './commondelete.component.html',
  styleUrl: './commondelete.component.scss'
})
export class CommondeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<CommondeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ){
    
  }

  confirmDelete(){
    
  }

}
