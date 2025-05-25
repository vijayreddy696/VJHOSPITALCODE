import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommondeleteComponent } from '../commondelete/commondelete.component';
import { MatDialog } from '@angular/material/dialog';
import { PagedRequest } from '@core/models/pagedrequest';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { PagedResult } from '@core/models/pagedresult';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { TableExportUtil } from '@shared/tableExportUtil';
import { DialogComponent } from 'app/user/dialog/dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { rowsAnimation } from '@shared';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReloadService } from '@shared/services/reload.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-common-table',
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
    MatProgressBarModule
  ],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss',
  animations: [rowsAnimation],
})
export class CommonTableComponent implements OnInit,AfterViewInit,OnDestroy  {
  private destroy$ = new Subject<void>();
  selection = new SelectionModel<any>(true, []);



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;


  
  @Input() title:any;
  @Input() formFields:any;
  @Input() columnDefinitions: { def: string, label: string, type: string ,visible:boolean}[] = [];
  @Input() loadDataFn!: (request: PagedRequest) => Observable<PagedResult<any>>;
  @Input() addDataFn!: (formData: any) => Observable<any>;

  contextMenuPosition = { x: '0px', y: '0px' };
  filterValue: string | undefined;
  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  lastItem?: Date;
  firstItem?: Date;

  @Output() removeSelectedRowsClicked = new EventEmitter<void>();
  @Output() deleteCalled = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
    private reloadService:ReloadService
 ){}
  ngOnDestroy(): void {
    this.destroy$.next();
  this.destroy$.complete();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.loadData();
  }

  
  getColumnTypeTemplate(column:any): string {
    return column.type; // You can adjust for fullName, gender, etc.
  }
  

  loadData(paginationRequest: PagedRequest = {} as PagedRequest): void {
    this.isLoading = true;

    this.loadDataFn(paginationRequest).pipe(takeUntil(this.destroy$))
  .subscribe({
      next: (data) => {
        const items = data.items || [];
        this.dataSource.data = items;
        this.totalCount = data.totalCount;
        this.pageSize = data.pageSize;
        this.firstItem = items[0]?.modifiedDate;
        this.lastItem = items[items.length - 1]?.modifiedDate;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
      }
    });
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

  editCall(row: any) {
    this.openDialog('edit', row);
  }



  openDialog(action: 'add' | 'edit', data?: any): void {
    const direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
  
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: {
        data,
        action,
        title: this.title,
        formFields: this.formFields
      },
      direction,
      autoFocus: false
    });
  
    const component = dialogRef.componentInstance;
  
    component.formemitter
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe((formData) => {
        this.submitFormData(formData, component, dialogRef, action);
      });
  }
  
  private submitFormData(
    formData: any,
    component: DialogComponent,
    dialogRef: any,
    action: 'add' | 'edit'
  ): void {
    component.loading = true;
  
    this.addDataFn(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.onSuccess(dialogRef, action),
        error: (err:HttpErrorResponse) => this.onError(err, component, action,dialogRef)
      });
  }
  
  private onSuccess(dialogRef: any, action: 'add' | 'edit'): void {
    this.paginator.pageIndex = 0;
    this.loadData();
    dialogRef.close();
  
    this.reloadService.showNotification(
      'snackbar-success',
      this.getNotificationMessage(action));
  }
  
  private onError(err: any, component: DialogComponent, action: 'add' | 'edit',dialogRef: any): void {
    component.loading = false;
  
    if (err.status === 409 && err.error?.email) {
      dialogRef.close();
      this.sweetPopup(err.error?.email,err.error?.fullName)
      return;
    }
  
    this.reloadService.showNotification(
      'snackbar-danger',
      this.getErrorMessage(action));
  }
  
  private getNotificationMessage(action: 'add' | 'edit'): string {
    return `${this.title} ${action === 'add' ? 'Added' : 'Updated'} Successfully...!!!`;
  }
  
  private getErrorMessage(action: 'add' | 'edit'): string {
    return `Error In ${action === 'add' ? 'Adding' : 'Updating'} ${this.title}...!!!`;
  }

  sweetPopup(name:string,email:string) {
    Swal.fire({
      title: 'User already exists. Do you want to activate this user?',
      text: name +"-"+email,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#005cbb',
      cancelButtonColor: '#005cbb',
      confirmButtonText: 'Active',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Activated!', 'User has been activated.', 'success');
      }
    });
  }
  
  

 

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }


  removeSelectedRows() {
    this.removeSelectedRowsClicked.emit();
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



  deleteItem(row: any) {
     const dialogRef = this.dialog.open(CommondeleteComponent, {
       data: row,
     });
     dialogRef.afterClosed().pipe(take(1))
  .subscribe((result) => {
       if (result) 
        this.deleteCalled.emit(row)
     });
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

  onContextMenu(event: MouseEvent, item: any) {
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
