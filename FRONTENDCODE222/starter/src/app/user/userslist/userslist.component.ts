import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CommondeleteComponent } from '@shared/components/commondelete/commondelete.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { User } from '@core/models/user';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { DialogComponent } from '../dialog/dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { ReloadService } from '@shared/services/reload.service';
import { getUserFormFields } from '@shared/form-fields/user-form-fields.config';


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
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  totalCount:any;
  pageSize:any;


  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'fullName', label: 'Full Name', type: 'fullName', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'phoneNumber', label: 'Phone Number', type: 'phone', visible: true },
    { def: 'role', label: 'Role', type: 'text', visible: true },
    { def: 'gender', label: 'Gender', type: 'gender', visible: true },
    { def: 'modifiedDate', label: 'Last Modified ON', type: 'date', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  formFields = getUserFormFields(this.reloadService);


  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = false;
  private destroy$ = new Subject<void>();
  filterValue: string | undefined;
  lastItem: Date|undefined;
  firstItem:Date|undefined;
  constructor(private userservice:UserService,private reloadservice:ReloadService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private reloadService:ReloadService
  ){
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
   
  
  }
  ngOnInit(): void {
    this.loadData();
    // this.reloadService.reloadUsersList$
    // .pipe(takeUntil(this.destroy$))  // <-- listens to destroy$
    // .subscribe(() => {
    //   this.loadData();
    // }); 
  }


  getColumnTypeTemplate(column:any): string {
    return column.type; // You can adjust for fullName, gender, etc.
  }
  
 


  loadData(paginationRequest: PagedRequest = {} as PagedRequest): void {
    this.isLoading = true;

  
    this.userservice.getusers(paginationRequest).subscribe({
      next: (data: PagedResult<User>) => {
        const items = data.items || [];
  
        this.dataSource.data = items.map((user: User) => ({
          ...user,
          img: 'assets/images/user/doctor.jpg'
        }));
  
        this.firstItem = items[0]?.modifiedDate;
        this.lastItem = items[items.length - 1]?.modifiedDate;
  
        this.totalCount = data.totalCount;
        this.pageSize = data.pageSize;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
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
    const input = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
      if (this.filterValue === input) return;
      this.filterValue = input;
    const pagedrequest:PagedRequest={
      searchValue:this.filterValue
    }
    this.paginator.pageIndex = 0; // Reset to first page on filter
    this.loadData(pagedrequest)
  }

  addNew() {
    this.openDialog('add');
  }

  editCall(row: User) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: User) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { data, action ,title:"Doctor",formFields:this.formFields},
      direction: varDirection,
      autoFocus: false,
    });
    const dialogComponent = dialogRef.componentInstance;

    dialogComponent.formemitter.subscribe((formData: any) => {
      dialogComponent.loading = true;
      this.userservice.adduser(formData).subscribe({
        next: () => {
          this.paginator.pageIndex = 0; // Reset to first page on filter
          this.loadData(); // Refresh user list
          dialogRef.close(); // Close dialog after successful addition
          this.showNotification(
            'snackbar-success',
            'Add Record Successfully...!!!',
            'top',
            'center'
          );
        },
        error: (err) => {
          dialogComponent.loading = false;
          console.error('Error adding user:', err);
          this.showNotification(
            'snackbar-danger',
            'Error IN upadiitng...!!!',
            'top',
            'center'
          );
        },
      });
    });
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
      Date: formatDate(new Date(x.modifiedDate), 'yyyy-MM-dd', 'en') || '',
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

  onPageChange(event: PageEvent) {
    if(event.pageSize !== this.pageSize){
      this.paginator.pageIndex=0;
      var pagedrequest:PagedRequest={
      pageSize:event.pageSize,
      searchValue:this.filterValue,
      fullTextSearch:!!this.filterValue,
    }
  }
  else{
    const isNextPage = event.previousPageIndex !== undefined && event.pageIndex > event.previousPageIndex;
    const isPreviousPage = event.previousPageIndex !== undefined && event.pageIndex < event.previousPageIndex;
    var pagedrequest:PagedRequest={
      pageNumber:event.pageIndex,
      pageSize:event.pageSize,
      searchValue:this.filterValue,
      fullTextSearch:!!this.filterValue,
      lastModifiedDate:isNextPage?this.lastItem:undefined,
      firstModifiedDate:isPreviousPage?this.firstItem:undefined
    }
  }
    this.loadData(pagedrequest)
    // Fetch data for the new page
  }

}
