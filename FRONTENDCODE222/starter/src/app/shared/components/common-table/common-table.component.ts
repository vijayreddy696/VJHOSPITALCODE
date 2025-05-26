import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommondeleteComponent } from '../commondelete/commondelete.component';
import { MatDialog } from '@angular/material/dialog';
import { PagedRequest } from '@core/models/pagedrequest';
import { firstValueFrom, Observable, Subject, take, takeUntil } from 'rxjs';
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
import { genericFormField } from '@core/models/genericformfields.interface';


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
  @Input() formFieldsFn!: (params: any) => any[];
  @Input() columnDefinitions: { def: string, label: string, type: string ,visible:boolean}[] = [];
  @Input() loadDataFn!: (request: PagedRequest) => Observable<PagedResult<any>>;
  @Input() addDataFn!: (formData: any) => Observable<any>;
  @Input() deleteDataFn!: (id: number) => Observable<any>;


  formFields!:genericFormField[] 
  contextMenuPosition = { x: '0px', y: '0px' };
  filterValue: string | undefined;
  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;
  isLoading: boolean = false;
  firstItem!:Date;
  lastItem!:Date;
  private currentCursor: { firstCreatedDate?: Date, lastCreatedDate?: Date } = {};

  commonPageRequest:PagedRequest={
    pageSize:10
  }

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
    this.formFields = this.formFieldsFn(true);
    this.loadData();
  }

  
  getColumnTypeTemplate(column:any): string {
    return column.type; // You can adjust for fullName, gender, etc.
  }
  

  loadData(): void {
    this.isLoading = true;
   // Save current cursor (for refetching same page after delete)
  this.currentCursor = {
    firstCreatedDate: this.commonPageRequest.firstCreatedDate,
    lastCreatedDate: this.commonPageRequest.lastCreatedDate,
  };

    let paginationRequest:PagedRequest={
      pageSize:this.commonPageRequest.pageSize,
      lastCreatedDate:this.commonPageRequest.lastCreatedDate,
      firstCreatedDate:this.commonPageRequest.firstCreatedDate,
      searchValue:this.commonPageRequest.searchValue,
      fullTextSearch:!!this.commonPageRequest.searchValue,
    }

    this.loadDataFn(paginationRequest).pipe(takeUntil(this.destroy$))
  .subscribe({
      next: (data) => {
        const items = data.items || [];

        const oldItemsMap = new Map(this.dataSource.data.map(item => [item.id, item]));
        const updatedItems = items.map(newItem => {
        const oldItem = oldItemsMap.get(newItem.id);
        
        // If ID matches and all values are same, reuse the old object
        if (oldItem && this.valuesAreEqual(oldItem, newItem)) {
          return oldItem;
        }
      
        // Else use the new object
        return newItem;
        });
        
        this.dataSource.data = updatedItems;
        // this.dataSource.data = items;
        this.totalCount = data.totalCount;
        this.commonPageRequest.pageSize = data.pageSize;
        this.commonPageRequest.firstCreatedDate = items[0]?.createdDate;
        this.commonPageRequest.lastCreatedDate = items[items.length - 1]?.createdDate;
        this.lastItem = items[items.length - 1]?.createdDate;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
      }
    });
  }

   valuesAreEqual(obj1: any, obj2: any): boolean {
    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
  





  applyFilter(event: Event) {
    const input = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
      if (this.filterValue === input) return;
      this.filterValue = input;
    this.commonPageRequest.searchValue = this.filterValue
    this.goToFirstPage();
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
        data:data,
        action:action,
        title: this.title,
        formFieldsFn: this.formFieldsFn
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
    if(action == 'add')
    this.goToFirstPage();
    else
   this.refreshCurrentPage();
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
    this.refreshCurrentPage()
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
      Date: formatDate(new Date(x.createdDate), 'yyyy-MM-dd', 'en') || '',
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
    this.deleteSweetPopup(row.id,row.fullName)
   }


  
deleteSweetPopup(id: number, name: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: `Delete "${name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#005cbb',
    cancelButtonColor: '#005cbb',
    confirmButtonText: 'Delete',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        await firstValueFrom(this.deleteDataFn(id));  // Convert Observable to Promise
        Swal.fire('Deleted!', `"${name}" has been deleted.`, 'success');
       this.goToFirstPage();
      } catch (error) {
        Swal.showValidationMessage(`Failed to delete "${name}".`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  });
}
  
  

 onPageChange(event: PageEvent) {
    if(event.pageSize !== this.commonPageRequest.pageSize){
      this.commonPageRequest.pageSize = event.pageSize;
      this.goToFirstPage();
  }
  else{
    const isNextPage = event.previousPageIndex !== undefined && event.pageIndex > event.previousPageIndex;
    if(isNextPage)
      this.gotoNextPage();
    else
    this.goToPreviousPage();
  }
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


  
    

    goToFirstPage(){
    this.paginator.pageIndex = 0;
    this.commonPageRequest.firstCreatedDate = undefined;
    this.commonPageRequest.lastCreatedDate = undefined;
    this.loadData()
    }

    refreshCurrentPage(){
     this.commonPageRequest.firstCreatedDate = this.currentCursor.firstCreatedDate;
     this.commonPageRequest.lastCreatedDate = this.currentCursor.lastCreatedDate;
     this.loadData();
    }
    gotoNextPage(){
    this.commonPageRequest.firstCreatedDate = undefined;
    this.loadData()
    }

    goToPreviousPage(){
      this.commonPageRequest.lastCreatedDate =  undefined;
      this.loadData()
    }
}
