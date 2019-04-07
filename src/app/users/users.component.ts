import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { CommonService } from '../shared/common.service';
import { ViewComponent } from './view/view.component';

export interface User {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'userId', 'id', 'title', 'body'];
  dataSource: MatTableDataSource<User>;
  selection: SelectionModel<User>;
  users = [];
  selectedUsers: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.commonService.getposts().subscribe(
      (res: User[]) =>{
        this.users = res;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.selection = new SelectionModel<User>(true, []);

      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
     this.selectedUsers = this.selection.selected;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.userId + 1}`;
  }

  // open selected checkbox dialog
  openDialog() {
    if(this.selectedUsers.length> 0){
      const dialogRef = this.dialog.open(ViewComponent, {
        data: this.selectedUsers
      });
      this.commonService.submitPost(this.selectedUsers);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
}