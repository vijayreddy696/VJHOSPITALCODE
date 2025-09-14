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
import { ReloadService } from '@shared/shared-services/reload.service';
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
  @Input() formFieldsFn!: (params: any) => any[];
  @Input() columnDefinitions: { def: string, label: string, type: string ,visible:boolean}[] = [];
  @Input() loadDataFn!: (request: PagedRequest) => Observable<PagedResult<any>>;
  @Input() addDataFn!: (formData: any) => Observable<any>;
  @Input() activateUserFn!: (id: number) => Observable<any>;
  @Input() deleteDataFn!: (id: number) => Observable<any>;
  @Input() deleteManyDataFn!: (ids: number[]) => Observable<any>;
  @Input() getDataByIdFn!: (id: number) => Observable<any>;


  allCreatedDateStack: Date[]=[]; // Stack to hold last createdDate values
  // formFields!:genericFormField[] 
  contextMenuPosition = { x: '0px', y: '0px' };
  filterValue: string | undefined;
  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;
  isLoading: boolean = false;
  firstItem!:Date;
  individualFullData:any;

  commonPageRequest:PagedRequest={
    pageSize:10
  }

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
    // this.formFields = this.formFieldsFn(true);
    this.loadData();
  }

  
  getColumnTypeTemplate(column:any): string {
    return column.type; // You can adjust for fullName, gender, etc.
  }
  

  loadData(): void {
    this.isLoading = true;

    let paginationRequest:PagedRequest={
      pageSize:this.commonPageRequest.pageSize,
      lastCreatedDate:this.commonPageRequest.lastCreatedDate,
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
        this.commonPageRequest.lastCreatedDate = items[items.length - 1]?.createdDate;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
        this.reloadService.showNotification(
          'snackbar-danger',
          'Error loading data. Please refresh or contact support if the issue persists.');
      }
    });
  }

  valuesAreEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
  
    if (obj1 == null || obj2 == null) return obj1 === obj2;
  
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) return false;
  
    for (const key of keys1) {
      if (!(key in obj2)) return false;
  
      const val1 = obj1[key];
      const val2 = obj2[key];
  
      if (val1 === val2) continue;
  
      const isObj = (v: any) => v && typeof v === 'object';
  
      if (isObj(val1) && isObj(val2)) {
        if (!this.valuesAreEqual(val1, val2)) return false;
      } else {
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
    this.getDataByIdFn(row.id).subscribe((res)=>{
      if(res)
    this.openDialog('edit', res);
    })
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
    if(action == 'add'){
    this.goToFirstPage();
    this.commonPageRequest.searchValue = undefined;
    }
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
      this.activeSweetPopup(err.error?.id,err.error?.email,err.error?.fullName)
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

  activeSweetPopup(id: number, name: string, email: string) {
    Swal.fire({
      title: `${this.title} already exists. Do you want to activate this ${this.title}?`,
      text: `${name} - ${email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#005cbb',
      cancelButtonColor: '#005cbb',
      confirmButtonText: 'Activate',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await firstValueFrom(this.activateUserFn(id));  // Convert Observable to Promise
          Swal.fire('Activated!', `${this.title} has been activated.`, 'success');
          this.goToFirstPage();
          this.commonPageRequest.searchValue = undefined;
          // Optionally add any refresh or UI update logic here
        } catch (error) {
          Swal.showValidationMessage(`Failed to activate ${this.title} "${name}".`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }
  
 

  refresh() {
    this.refreshCurrentPage()
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }


  removeSelectedRows() {
    const selectedRows = this.selection.selected;
    if (selectedRows.length === 0) return;
  
    const ids = selectedRows.map(row => row.id);
    const names = selectedRows.map(row => row.fullName).join(', ');
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete selected items: "${names}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#005cbb',
      cancelButtonColor: '#005cbb',
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await firstValueFrom(this.deleteManyDataFn(ids)); // Calls the @Input() deleteManyDataFn
          Swal.fire('Deleted!', 'Selected items have been deleted.', 'success');
          this.refreshCurrentPage();
          this.selection.clear(); // Clear selection after successful deletion
        } catch (error) {
          Swal.showValidationMessage('Failed to delete selected items.');
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
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
        const rowToDelete = this.dataSource.data.find(item => item.id === id);
        if(rowToDelete)this.selection.deselect(rowToDelete);
       this.refreshCurrentPage();
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
    this.commonPageRequest.lastCreatedDate = undefined;
    this.loadData()
    }

    refreshCurrentPage(){
    this.commonPageRequest.lastCreatedDate = this.allCreatedDateStack[this.allCreatedDateStack.length - 1];
     this.loadData();
    }
    gotoNextPage(){
    if (this.commonPageRequest.lastCreatedDate) 
      this.allCreatedDateStack.push(this.commonPageRequest.lastCreatedDate);
    this.loadData()
    }

    goToPreviousPage(){
      this.allCreatedDateStack.pop();
    this.commonPageRequest.lastCreatedDate = this.allCreatedDateStack[this.allCreatedDateStack.length - 1];
      this.loadData()
    }

    getNestedValue(obj: any, path: string): any {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
    
}
