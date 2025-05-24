import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommondeleteComponent } from '../commondelete/commondelete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-common-table',
  imports: [],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss'
})
export class CommonTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;


  selection = new SelectionModel<any>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };







  @Input() columnDefinitions: { def: string, label: string, type: string }[] = [];
  @Input() dataSource = new MatTableDataSource<any>();
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;






  @Output() filterChanged = new EventEmitter<string>();
  @Output() addNewClicked = new EventEmitter<void>();
  @Output() refreshClicked = new EventEmitter<void>();
  @Output() removeSelectedRowsClicked = new EventEmitter<void>();
  @Output() exportExcelClicked = new EventEmitter<void>();
  @Output() editCalled = new EventEmitter<any>();
  @Output() deleteCalled = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<any>();



  constructor(
    public dialog: MatDialog,

 ){}



  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterChanged.emit(value);
  }

  addNew() {
    this.addNewClicked.emit();
  }

  refresh() {
    this.refreshClicked.emit();
  }

  removeSelectedRows() {
    this.removeSelectedRowsClicked.emit();
  }

  exportExcel() {
    this.exportExcelClicked.emit();
  }


  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  editCall(row: any) {
    this.editCalled.emit(row);
  }

  deleteItem(row: any) {
     const dialogRef = this.dialog.open(CommondeleteComponent, {
       data: row,
     });
     dialogRef.afterClosed().subscribe((result) => {
       if (result) 
        this.deleteCalled.emit(row)
     });
   }

  onPageChange(event: any) {
    this.pageChanged.emit(event);
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
