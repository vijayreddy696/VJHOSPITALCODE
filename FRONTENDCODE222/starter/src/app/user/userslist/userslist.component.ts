import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rowsAnimation, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/module.d-CnjH8Dlt';
import { UserService } from '../user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CommondeleteComponent } from '@shared/components/commondelete/commondelete.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { User } from '@core/models/user';


@Component({
  selector: 'app-userslist',
  imports: [
    BreadcrumbComponent,
    FeatherIconsComponent,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './userslist.component.html',
  styleUrl: './userslist.component.scss',
  animations: [rowsAnimation],

})


export class UserslistComponent implements OnInit ,OnDestroy{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;


  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'fullName', label: 'Full Name', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'phoneNumber', label: 'Phone Number', type: 'phone', visible: true },
    { def: 'role', label: 'Role', type: 'text', visible: true },
    { def: 'hospitalId', label: 'Hospital ID', type: 'number', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();
  constructor(private userservice:UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ){
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    const paginationRequest = {
      pageNumber: 1,
      pageSize: 10,
      searchValue: null,
      firstModifiedDate: null,
      lastModifiedDate: null,
      fullTextSearch: false,
      hospitalId: 6
    };
    debugger;
    this.userservice.getusers(paginationRequest).subscribe({
      next: (data:any) => {
        const updatedData = data.items.map((user:any) => ({
          ...user,
          img: "assets/images/user/doctor.jpg"
        }));
        this.dataSource.data = updatedData;
        this.paginator.length = data.totalCount;
        this.paginator.pageSize = data.pageSize;
        this.isLoading = false;
        // this.refreshTable();
        
      },
      error: (err) => console.error(err),
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew() {
    // this.openDialog('add');
  }

  editCall(row: User) {
    // this.openDialog('edit', row);
  }

  // openDialog(action: 'add' | 'edit', data?: User) {
  //   let varDirection: Direction;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     varDirection = 'rtl';
  //   } else {
  //     varDirection = 'ltr';
  //   }
  //   const dialogRef = this.dialog.open(AllDoctorsFormComponent, {
  //     width: '60vw',
  //     maxWidth: '100vw',
  //     data: { doctors: data, action },
  //     direction: varDirection,
  //     autoFocus: false,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       if (action === 'add') {
  //         this.dataSource.data = [result, ...this.dataSource.data];
  //       } else {
  //         this.updateRecord(result);
  //       }
  //       this.refreshTable();
  //       this.showNotification(
  //         action === 'add' ? 'snackbar-success' : 'black',
  //         `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
  //         'bottom',
  //         'center'
  //       );
  //     }
  //   });
  // }

  private updateRecord(updatedRecord: User) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: User) {
    const dialogRef = this.dialog.open(CommondeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      Name: x.fullName,
      Email: x.email,
      Date: formatDate(new Date(x.lastModifiedDate), 'yyyy-MM-dd', 'en') || '',
      phoneNumber: x.phoneNumber,
      Role:x.role
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  onContextMenu(event: MouseEvent, item: User) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

}
