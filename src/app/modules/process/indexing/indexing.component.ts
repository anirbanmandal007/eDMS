import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProcessService } from '../process.service';

@Component({
  selector: 'app-indexing',
  templateUrl: './indexing.component.html',
  styleUrls: ['./indexing.component.scss']
})
export class IndexingComponent implements OnInit {

  displayTable: boolean = false;
  dtOptions: DataTables.Settings = {};
  indexData: any;

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
      this.indexData = res.splice(0, 240);
      this.displayTable = true;
    })
  }

  viewIndexing(data) {
    console.log(data);
  }

}
