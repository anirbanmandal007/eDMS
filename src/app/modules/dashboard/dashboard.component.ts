import { Component, OnInit, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DashboardService } from "./dashboard.service";


@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"]
})



export class DashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;

  public clicked: boolean = true;
  public clicked1: boolean = false;
  public chartFirst: any;
  public chartFirstFU: any;
  public chartActivity: any;
  public updateActivityChartInterval;


  activeRow: any;
  DashboardForm: FormGroup;   
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _StatusList :any; 
  _LogList :any; 
  DatauploadCount:0;
  TaggingCount:0;
  FileUploadCount:0;
  UserCount:0;
  _ActivityList :any;
  activityChartData:any;
  firstChartData:any;
  firstChartDataFU:any;
  
  _UploadList:any;
  _ActivityLog:any;
  activitylogChartData:any;
  chartActivityLog:any;
  _RootList:any;
  BranchList:any;
  _DepartmentList:any;
  EntityList:any;

  view: any[] = [700, 350];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Upload Count';
  timeline: boolean = true;
  dataUploadChartData: any = [{
    "name": "Data Upload Count",
    "series": []
  }];
  fileUploadChartData: any = [{
    "name": "File Upload Count",
    "series": []
  }];
  showDataUploadChart = false;
  showFileUploadChart = false;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(
     private formBuilder: FormBuilder,
     private dashboardService: DashboardService,
    private zone: NgZone
  ) { }

  ngOnInit() {

     this.DashboardForm = this.formBuilder.group({
       BranchName: ['', Validators.required],
      User_Token:localStorage.getItem('User_Token'),
      BranchID:['0'],
      DeptID:['0'],
      SubfolderID:[0], 
      RootID:[0],
      id:[0]
     });
   //  this.geBranchList();

  //  this.BindLineChart();
  //  this.BindUserLog();
   this.StatusList();
   this.getRootList();
   this.GetUploadList();
   this.GetFileUploadList();
  // this.BindFileUpload();



  //   //amChart Code Start
  //   // Create chart instance
  //   //amChart Code Start
  //   // Create chart instance
  //   var chart = am4core.create("chart-sales-dark", am4charts.XYChart);
    
  //   this.chartFirst = chart;
  //   this.chartFirst.logo.disabled = true;
  //   //chart.dateFormatter.dateFormat = "MM/dd/yyyy hh:mm:ss a";

  //   // Increase contrast by taking evey second color
  //   chart.colors.step = 2;

  //   // Add data

  
  // //  this.chartFirst.data=this.GetUploadList();
  // this.GetUploadList(); 
  //  // Uncomment below line
  // // this.chartFirst.data=this.generateChartData(30); 

  //  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //   dateAxis.renderer.minGridDistance = 50;

  //   // Create series
  //   function createAxisAndSeries(field, name, opposite, bullet) {
  //     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //     valueAxis.maxPrecision = 0;
  //     if(chart.yAxes.indexOf(valueAxis) != 0){
  //     //  valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
  //     }
     
      
  //     let series = chart.series.push(new am4charts.LineSeries());
  //     series.dataFields.valueY = field;
  //     series.dataFields.dateX = "date";
  //     series.strokeWidth = 2;
  //     series.yAxis = valueAxis;
  //     series.name = name;
  //     series.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
  //     series.showTooltipOn = "always";
  //     series.tensionX = 15;
  //     series.showOnInit = true;
 

  //     let interfaceColors = new am4core.InterfaceColorSet();

  //     switch (bullet) {
  //       case "triangle":
  //         let bullet1 = series.bullets.push(new am4charts.Bullet());
  //         bullet1.width = 12;
  //         bullet1.height = 12;
  //         bullet1.horizontalCenter = "middle";
  //         bullet1.verticalCenter = "middle";

  //         let triangle = bullet1.createChild(am4core.Triangle);
  //         triangle.stroke = interfaceColors.getFor("background");
  //         triangle.strokeWidth = 2;
  //         triangle.direction = "top";
  //         triangle.width = 12;
  //         triangle.height = 12;
  //         break;
  //       default:
  //         let bullet = series.bullets.push(new am4charts.CircleBullet());
  //         bullet.circle.stroke = interfaceColors.getFor("background");
  //         bullet.circle.strokeWidth = 2;
  //         break;
  //     }

  //     valueAxis.renderer.line.strokeOpacity = 1;
  //     valueAxis.renderer.line.strokeWidth = 2;
  //     valueAxis.renderer.line.stroke = series.stroke;
  //     valueAxis.renderer.labels.template.fill = series.stroke;
  //     valueAxis.renderer.opposite = opposite;
  //   }

  //  // createAxisAndSeries("fileupload", "File Uploads", false, "circle");
  //  createAxisAndSeries("dataupload", "Data Uploads", false, "triangle");


  //   // Add legend
  //   chart.legend = new am4charts.Legend();

  //   // Add cursor
  //   chart.cursor = new am4charts.XYCursor();
  //   //amChartCode End


  //   // amChart Code For Activity

  //   // Create chart instance
  //   this.chartActivity = am4core.create("chart-bars", am4charts.XYChart);
  //   this.chartActivity.logo.disabled = true;

  //   // Add data
   
  //   // this.chartActivity.data=this.GetActivityList();
  //  // this.GetActivityList();
  //   // Create axes
  //   var categoryAxis = this.chartActivity.xAxes.push(new am4charts.CategoryAxis());
  //   categoryAxis.dataFields.category = "activityname";
  //   categoryAxis.renderer.grid.template.location = 0;
  //   categoryAxis.renderer.minGridDistance = 10;
  //   categoryAxis.renderer.labels.template.horizontalCenter = "right";
  //   categoryAxis.renderer.labels.template.verticalCenter = "middle";
  //   categoryAxis.renderer.labels.template.rotation = 270;
  //   categoryAxis.tooltip.disabled = true;
  //   categoryAxis.renderer.minHeight = 120;

  //   var valueAxis = this.chartActivity.yAxes.push(new am4charts.ValueAxis());
  //   valueAxis.renderer.minWidth = 50;

  //   // Create series
  //   var series = this.chartActivity.series.push(new am4charts.ColumnSeries());
  //   series.sequencedInterpolation = true;
  //   series.dataFields.valueY = "count";
  //   series.dataFields.categoryX = "activityname";
  //   series.columns.template.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
  //   series.columns.template.showTooltipOn = "always";
  //   series.columns.template.tooltipY = 0;
  //   series.columns.template.strokeWidth = 0;

  //   series.tooltip.pointerOrientation = "vertical";

  //   series.columns.template.column.cornerRadiusTopLeft = 10;
  //   series.columns.template.column.cornerRadiusTopRight = 10;
  //   series.columns.template.column.fillOpacity = 0.8;

  //   // on hover, make corner radiuses bigger
  //   var hoverState = series.columns.template.column.states.create("hover");
  //   hoverState.properties.cornerRadiusTopLeft = 0;
  //   hoverState.properties.cornerRadiusTopRight = 0;
  //   hoverState.properties.fillOpacity = 1;

  //   series.columns.template.adapter.add("fill", function (fill, target) {
  //     return chart.colors.getIndex(target.dataItem.index );
  //   });

  //   // Cursor
  //   this.chartActivity.cursor = new am4charts.XYCursor();
  // //  this.upDateActivityGraph();

  }

  public updateOptions(monthOrweek) {
   // console.log(monthOrweek);
    if(monthOrweek=='M'){
      
      //this.chartFirst.data = this.generateChartData(30);
      this.GetUploadList();
      this.chartFirst.validateData();
    }else{
     // this.chartFirst.data = this.generateChartData(7);
     this.GetUploadList();
     this.chartFirst.validateData();
    }

    
  }


// BindLineChart()
// {

//   am4core.useTheme(am4themes_animated);
//   // Themes end
  
//   // Create chart instance
//   let chart = am4core.create("chartdivline", am4charts.XYChart);
  
//   // Add data
//   chart.data = [{
//     "date": new Date(2018, 3, 20),
//     "value": 90
//   }, {
//     "date": new Date(2018, 3, 21),
//     "value": 102
//   }, {
//     "date": new Date(2018, 3, 22),
//     "value": 65
//   }, {
//     "date": new Date(2018, 3, 23),
//     "value": 62
//   }, {
//     "date": new Date(2018, 3, 24),
//     "value": 55
//   }, {
//     "date": new Date(2018, 3, 25),
//     "value": 81
//   }];
  
//   // Create axes
//   let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  
//   // Create value axis
//   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  
//   // Create series
//   let lineSeries = chart.series.push(new am4charts.LineSeries());
//   lineSeries.dataFields.valueY = "value";
//   lineSeries.dataFields.dateX = "date";
//   lineSeries.name = "Sales";
//   lineSeries.strokeWidth = 3;
  
//   // Add simple bullet
//   let bullet = lineSeries.bullets.push(new am4charts.Bullet());
//   let image = bullet.createChild(am4core.Image);
//   image.href = "https://www.amcharts.com/lib/images/star.svg";
//   image.width = 30;
//   image.height = 30;
//   image.horizontalCenter = "middle";
//   image.verticalCenter = "middle";
  

// }


  getRootList() {
    
    this.dashboardService.GetRootByUserID().subscribe((data: {}) => {     
      this._RootList = data;
   //  this._FilteredList = data
   this.DashboardForm.controls['DeptID'].setValue(0);
   this.DashboardForm.controls['BranchID'].setValue(0);
   this.DashboardForm.controls['SubfolderID'].setValue(0);  
     //console.log(this._FilteredList );
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geBranchListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geBranchList(userid);
  }

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this.dashboardService.GetBranchByDeptIDANDUserwise().subscribe((data: any) => {
      this.BranchList = data;
    //  this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  getDepartmnet(RootID: any) {


 //   const apiUrl=this._global.baseAPIUrl+'Department/GetDepartmentByUserID?user_Token='+ localStorage.getItem('User_Token');
    this.dashboardService.GetDepartmentByUserID(RootID).subscribe((data: {}) => {
    this._DepartmentList = data;
   // this._DepartmentLists=data;
//    console.log("data : -", data);
    this.DashboardForm.controls['DeptID'].setValue(0);
    this.DashboardForm.controls['BranchID'].setValue(0);
   // this.RegionMappingForm.controls['DeptIDS'].setValue(0);
    

    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    }

    getEntityForUser(BranchID: number) {
      this.getEntity(BranchID);
    }


    getEntity(BranchID: number) {

      alert(BranchID);  
   //   const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetDetails?ID="+userid+"&user_Token="+this.EntityMappingForm.get("User_Token").value;;
      //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      this.dashboardService.GetSubFolderByBranch(BranchID).subscribe((res) => {
        this.EntityList = res;
        this.DashboardForm.controls['SubfolderID'].setValue(0);
        //  this.checkbox_list = [];
        //this.checkbox_list = res;
        //this.checklistArray.clear()
        // this.checkbox_list.forEach(item => {
        //   let fg = this.formBuilder.group({
        //     id: [item.id],
        //     SubfolderName: [item.SubfolderName],
        //     ischecked: [item.ischecked]
        //     })
        //     this.checklistArray.push(fg)
        // });
      //  console.log('Branch Mapping -> ',res);
        
        // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())
  
        //this.productsArray = res;
        //  this.checkbox_list= res;
        //this.checklist =res;
      });
    }

    OnSearch()
    {

      
    }


    // generate some random data, quite different range
    public generateChartData(noofDays) {
      let chartData = [];
      let firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 100);
      firstDate.setHours(0, 0, 0, 0);
  
      let fileupload = 1600;
      let dataupload = 2900;
  
  
      for (var i = 0; i < noofDays; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        let newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);
  
        fileupload += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        dataupload += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  
  
        chartData.push({
          date: newDate,
          fileupload: fileupload,
          dataupload: dataupload
        });
      }
   
      return chartData;
    }

    

  // public upDateActivityGraph() {
  
  //   this.updateActivityChartInterval = setInterval(() => {
  //    // console.log("updating");
  //     this.GetActivityList(); 
  //     //this.chartActivity.validateData();
  //     this.GetUploadList();
  //     //Uncomment below line if you want to see good data
  //     //this.generateChartData(30);
  //     //this.chartFirst.validateData();
  //     this.GetFileUploadList();
  //   //  this.chartFirstFU.validateData();
  //     this.GetActivityLog();
  //     //this.chartActivityLog.validateData();
  //   }, 600000)
  // }


  // ngOnDestroy() {
  //   clearInterval(this.updateActivityChartInterval);
  //   this.zone.runOutsideAngular(() => {
  //     if (this.chartFirst) {
  //       this.chartFirst.dispose();
  //       this.chartFirstFU.dispose();
  //       this.chartActivityLog.dispose();
  //       this.chartActivity.dispose();
  //     }
  //   });

  // }

  StatusList() {

    this.dashboardService.GetStatusCount().subscribe((data: {}) => {     

 
      if(data !="")         
      {
      this.DatauploadCount = data[0].DataUpload;
      this.FileUploadCount = data[0].FileUpload;
      this.TaggingCount = data[0].Tagging;
      this.UserCount = data[0].Users;
      }
    });
  }

  public GetActivityList() {
    this.activityChartData=[];
      this.dashboardService.GetActivityCount().subscribe((data: {}) => {     
      this._ActivityList =data;
        this._ActivityList.forEach( (activity) => {
          this.activityChartData.push({activityname: activity.ActivityName,count:activity.Cnt});
        }, this);
        this.chartActivity.data = this.activityChartData;
    });
   return  this.activityChartData;
  }
    

  public GetUploadList() {
    this.firstChartData=[];
   // const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardData?user_Token='+this.DashboardForm.get('User_Token').value
   this.dashboardService.GetDashboardData().subscribe((data: any) => {     
    //console.log("data",data);
    this._UploadList =data;
     this._UploadList.forEach( (upload) => {
      this.firstChartData.push({date:new Date(Date.parse(upload.UplaodDate)),dataupload:upload.DataUplaodCount});
    }, 
    this);
    // this.chartFirst.data=this.firstChartData;
    data.forEach(element => {
      this.dataUploadChartData[0].series.push({
        "name": new Date(element.UplaodDate),
        "value": element.DataUplaodCount
      })
    });
    this.showDataUploadChart = true;
    
  });
  // console.log("firstChart",this.firstChartData);
   return this.firstChartData;
}

public GetFileUploadList() {
  this.firstChartDataFU=[];
 // const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardData?user_Token='+this.DashboardForm.get('User_Token').value
 this.dashboardService.GetDashboardFileData().subscribe((data: any) => {     
  //console.log("data",data);
  this._UploadList =data;
   this._UploadList.forEach( (upload) => {
      this.firstChartDataFU.push({date:new Date(Date.parse(upload.UplaodDate)),fileupload:upload.FileUplaodCount});
  }, 
  this);
  data.forEach(element => {
    this.fileUploadChartData[0].series.push({
      "name": new Date(element.UplaodDate),
      "value": element.FileUplaodCount
    })
  });
  this.showFileUploadChart = true;
});
// console.log("firstChart",this.firstChartData);
 return this.firstChartDataFU;
}


// BindUserLog()
// {

//   /// Create chart instance

//   var chart= am4core.create("chart-bars_UserLog", am4charts.XYChart);  
//     // Add data   
//     this.chartActivityLog = chart;
//     this.chartActivityLog.logo.disabled = true;

//     // this.chartActivityLog.data=this.GetActivityLog();
//     this.GetActivityLog();
//    // console.log("ChartLog", this.chartActivityLog.data);

//     // Create axes
//     var categoryAxis = this.chartActivityLog.xAxes.push(new am4charts.CategoryAxis());
//     categoryAxis.dataFields.category = "activityname";
//     categoryAxis.renderer.grid.template.location = 0;
//     categoryAxis.renderer.minGridDistance = 10;
//     categoryAxis.renderer.labels.template.horizontalCenter = "right";
//     categoryAxis.renderer.labels.template.verticalCenter = "middle";

//     //categoryAxis.renderer.labels.template.location=0;
//     categoryAxis.renderer.labels.template.rotation = 0;
//     categoryAxis.tooltip.disabled = true;
//     categoryAxis.renderer.minHeight = 120;

//     var valueAxis = this.chartActivityLog.yAxes.push(new am4charts.ValueAxis());
//     valueAxis.renderer.minWidth = 50;

//     // Create series
//     var series = this.chartActivityLog.series.push(new am4charts.ColumnSeries());
//     series.sequencedInterpolation = true;
//     series.dataFields.valueY = "count";
//     series.dataFields.categoryX = "activityname";
//     series.columns.template.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
//     series.columns.template.showTooltipOn = "always";
//     series.columns.template.tooltipY = 0;
//     series.columns.template.strokeWidth = 0;

//     series.tooltip.pointerOrientation = "vertical";

//     series.columns.template.column.cornerRadiusTopLeft = 10;
//     series.columns.template.column.cornerRadiusTopRight = 10;
//     series.columns.template.column.fillOpacity = 0.8;
//    // series.colors.step = 11;
//     // on hover, make corner radiuses bigger
//     var hoverState = series.columns.template.column.states.create("hover");
//     hoverState.properties.cornerRadiusTopLeft = 0;
//     hoverState.properties.cornerRadiusTopRight = 0;
//     hoverState.properties.fillOpacity = 1;

//     series.columns.template.adapter.add("fill", function (fill, target) {
//      return chart.colors.getIndex(target.dataItem.index);
//     });

//     // Cursor
//     this.chartActivityLog.cursor = new am4charts.XYCursor();
// }

public GetActivityLog() {
  this.activitylogChartData=[];
    this.dashboardService.GetActivityUserLog().subscribe((data: {}) => {     
    this._ActivityLog =data;
   // console.log("AL" , data);
      this._ActivityLog.forEach( (activity) => {
        this.activitylogChartData.push({activityname: activity.ActivityName,count:activity.Cnt});
      }, this);
      this.chartActivityLog.data=this.activitylogChartData;
  });
 return  this.activitylogChartData;
}

// BindFileUpload()
// {


//   var chart = am4core.create("chart-fileupload", am4charts.XYChart);
//   this.chartFirstFU = chart;
//   this.chartFirstFU.logo.disabled = true;
//   //chart.dateFormatter.dateFormat = "MM/dd/yyyy hh:mm:ss a";

//   // Increase contrast by taking evey second color
//   chart.colors.step = 2;

//   // Add data


// //  this.chartFirstFU.data=this.GetFileUploadList();
// this.GetFileUploadList();
//  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
//   dateAxis.renderer.minGridDistance = 50;

//   // Create series
//   function createAxisAndSeries(field, name, opposite, bullet) {
//     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis<AxisRenderer>());
//     valueAxis.maxPrecision = 0;
//     if (chart.yAxes.indexOf(valueAxis) != 0) {
//       //	valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
//     }
   
    
//     let series = chart.series.push(new am4charts.LineSeries());
//     series.dataFields.valueY = field;
//     series.dataFields.dateX = "date";
//     series.strokeWidth = 2;
//     series.yAxis = valueAxis;
//     series.name = name;
//     series.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
//     series.showTooltipOn = "always";
//     series.tensionX = 7;
//     series.showOnInit = true;

//     let interfaceColors = new am4core.InterfaceColorSet();

//     switch (bullet) {
//       case "triangle":
//         let bullet1 = series.bullets.push(new am4charts.Bullet());
//         bullet1.width = 12;
//         bullet1.height = 12;
//         bullet1.horizontalCenter = "middle";
//         bullet1.verticalCenter = "middle";

//         let triangle = bullet1.createChild(am4core.Triangle);
//         triangle.stroke = interfaceColors.getFor("background");
//         triangle.strokeWidth = 2;
//         triangle.direction = "top";
//         triangle.width = 12;
//         triangle.height = 12;
//         break;
//       default:
//         let bullet = series.bullets.push(new am4charts.CircleBullet());
//         bullet.circle.stroke = interfaceColors.getFor("background");
//         bullet.circle.strokeWidth = 2;
//         break;
//     }

//     valueAxis.renderer.line.strokeOpacity = 1;
//     valueAxis.renderer.line.strokeWidth = 2;
//     valueAxis.renderer.line.stroke = series.stroke;
//     valueAxis.renderer.labels.template.fill = series.stroke;
//     valueAxis.renderer.opposite = opposite;
//   }

//   createAxisAndSeries("fileupload", "File Uploads", false, "triangle");
//   //createAxisAndSeries("dataupload", "Data Uploads", true, "triangle");

//   // Add legend
//   chart.legend = new am4charts.Legend();

//   // Add cursor
//   chart.cursor = new am4charts.XYCursor();


// }

 
// CheckAccessRight() {

//   var RoleID =1;
//   var PageName ='Dashboard';

//     const apiUrl = this._global.baseAPIUrl + 'Status/CheckAccessRight?RoleID=' + RoleID +'&PageName='+ PageName +' &user_Token='+ this.DashboardForm.get('User_Token').value       
//     //const apiUrl=this._global.baseAPIUrl+'Status/CheckAccessRight?user_Token='+this.DashboardForm.get('User_Token').value
//     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {    
 
//       if(data !="")         
//       {
      
//       }
//     });
//   }



}
