import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { SearchService } from '../search.service';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-bulk-download',
  templateUrl: './bulk-download.component.html',
  styleUrls: ['./bulk-download.component.scss']
})
export class BulkDownloadComponent implements OnInit {
  _TemplateList: any;
  AdvancedSearchForm: FormGroup;
  _CSVData: any;
  public records: any[] = [];
  _ColNameList: any;

  constructor(
    private _searchService: SearchService,
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.AdvancedSearchForm = this.formBuilder.group({
      FileNo: [""],
      ACC: [""],
      TemplateID: 1,
      _ColNameList: this._ColNameList,
      SerchBy: [""],
      SearchByID: 1,
    });
    this.getTemplate();
  }
  /** This is getting template */
  getTemplate() {
    this._searchService.getTemplateAPI().subscribe((data: {}) => {
      this._TemplateList = data;
      this.AdvancedSearchForm.controls["TemplateID"].setValue(0);
      
    });
  }

  geTemplateNameListByTempID() {
    //this.getSearchParameterList();
  }
  /**Download template file */
  downloadFile() {
    const filename = "BulkdownloadFileFomrat";

    let csvData = "FileNo,";
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp;
    // navigator.userAgent.indexOf('Chrome') == -1;

    //if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }

    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    //}
  }
  /**Upload files */
  uploadListener($event: any): void {
    let files = $event.srcElement.files;
    this._CSVData = "";
    if (1 == 1) {
      let input = $event.target;
      let reader = new FileReader();
      console.log("FileName", input.files[0].name);
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        this._CSVData = "";
        for (let j = 0; j < csvRecordsArray.length; j++) {
          this._CSVData += csvRecordsArray[j] + ",";
        }
      };
      reader.onerror = function () {
        console.log("error is occurred while reading file!");
      };
    } else {
      this.toaster.show('warning', 'Warning!', '"Please Select A Valid CSV File And Template!');
      this.fileReset();
    }
  }
  /**Download Files based on single file upload */
  downloadBulkFileBYCSV() {
    var splitted = this._CSVData.split(",");
    console.log(this._CSVData)
    if (splitted.length <= 500) {
      let body = {
        ACC: this._CSVData,
        TemplateID: 0,
        SearchByID: 1,
      }
      this.AdvancedSearchForm.patchValue({
        ACC: this._CSVData,
      });
      this._searchService.bulkDownloadTemplateWiseAPI(this.AdvancedSearchForm.value).subscribe((res) => {
          if (res) {
            saveAs(res, "Bulk Files" + ".zip");
          }
          // console.log("Final FP-- res ", res);
        });
    } else {
      this.toaster.show('warning', 'Warning!','Bulk Download not more than 500 files');
    }
  }
  downloadBulkFile() {
    if (this.AdvancedSearchForm.get("FileNo").value != "") {
      this._searchService.downloadDocAPI(this.AdvancedSearchForm.get("FileNo").value).subscribe((res) => {
        if (res) {
          saveAs(res, "Files" + ".zip");
        }
        console.log("Final FP-- res ", res);
      });
    } else {
      this.toaster.show('warning', 'Warning!','please enter File no in multi search field');
    }
  }
  fileReset() {
    this.records = [];
  }
}
