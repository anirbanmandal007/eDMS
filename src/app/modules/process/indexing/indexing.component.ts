import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessService } from '../process.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-indexing',
  templateUrl: './indexing.component.html',
  styleUrls: ['./indexing.component.scss']
})
export class IndexingComponent implements OnInit {

  displayTable: boolean = false;
  dtOptions: DataTables.Settings = {};
  indexData: any;
  temp: any;
  columns = [{prop: 'FileNo'}, {prop: 'BranchName'}, {prop: 'TemplateName'}]
  @ViewChild('search', { static: false }) search: any;
  
  constructor(
    private _processService: ProcessService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dtOptions = {
        processing: true,
        ordering: true,
        info: false,
        searching: true,
        paging: true,
        pageLength:100
      }
    }, 1000)
    
    this.getIndexingData();
  }

  getIndexingData() {
    this._processService.getIndexingData().subscribe(res => {
      this.temp = res;
      this.indexData = res;
      this.displayTable = true;
    })
  }

  viewIndexData(row) {
    console.log(row);
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });
  }

  updateFilter(val: any) {
    const value = val.toString().toLowerCase().trim();
    // get the amount of columns in the table
    const count = this.columns.length;
    // get the key names of each column in the dataset
    const keys = ['FileNo', 'BranchName', 'TemplateName'];
    // assign filtered matches to the active datatable
    this.indexData = this.temp.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < count; i++) {
        // check for a match
        if (
          (item[keys[i]] &&
            item[keys[i]]
              .toString()
              .toLowerCase()
              .indexOf(value) !== -1) ||
          !value
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

}
