import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer, tm_deposit } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import { AccOpenDM } from 'src/app/bank-resolver/Models/deposit/AccOpenDM';
import { mm_oprational_intr } from 'src/app/bank-resolver/Models/deposit/mm_oprational_intr';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-print-certificate',
  templateUrl: './print-certificate.component.html',
  styleUrls: ['./print-certificate.component.css'],
  providers:[ExportAsService]
})
export class PrintCertificateComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('UpdateSuccess', { static: true }) UpdateSuccess: TemplateRef<any>;
  @ViewChild('alreadyUpdate', { static: true }) alreadyUpdate: TemplateRef<any>;
  accNum: string;
  accType: string;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  operationalInstrList: mm_oprational_intr[] = [];
  trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  counter=0;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[];
  passBookData:any=[];
  printData:any=[];
  afterPrint:any=[];
  systemParam: sm_parameter[] = [];
  lastRowNo:any;
  ardbName=localStorage.getItem('ardb_name');
  branchName=this.sys.BranchName;
  shoFastPage:boolean=false;
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  showWait=false
  restItem:any
  tm_deposit = new tm_deposit();
  masterModel = new AccOpenDM();
  showTable:boolean=false;
  oprn_instr_desc:any;
  gName:any;
  joinHold:any;
  ShowMIS:boolean=false;
  Header:any;
  ShowCC:boolean=false;
  printFlag:any;
  disablePrint:boolean=false;
  renew_id:any;
  Deposit_Period:any;
  year:number;
  month:number;
  day:number;
  sbAcc:any;
  constructor(private svc: RestService, private formBuilder: FormBuilder,private http: HttpClient,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    this.getSMParameter();
    this.getOperationalInstr()
    // this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      // fromDate: [null, Validators.required],
      // toDate: [null, Validators.required],
      acct_num: [{ value: '', disabled: true }, Validators.required],
      acc_type_cd: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= this.sys.CurrentDate
      //  this.today= n + " "+ time
    console.log(this.today);
    
  }
  getOperationalInstr() {

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {

        this.operationalInstrList = res;
        this.operationalInstrList = this.operationalInstrList.sort((a, b) => (a.oprn_cd > b.oprn_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }
  onLoadScreen(content) {
    this.joinHold=[];
    this.passBookData=[];
    this.printData=[];
    this.afterPrint=[];
    this.modalRef = this.modalService.show(content, this.config);
  }
  FastpageScreen() {
    this.shoFastPage=true;
  }
  
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public onAccountTypeChange(): void {
    this.reportcriteria.controls.acct_num.setValue('');
    this.suggestedCustomer = null;
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.reportcriteria.controls.acct_num.enable();
    }
  }
  onChangeNull(){
    this.suggestedCustomer = null

    if (this.reportcriteria.controls.acct_num.value.length > 0) 
      this.disabledOnNull=false
    else 
      this.disabledOnNull=true
  }
  public suggestCustomer(): void {
    this.showWait=true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = (+this.reportcriteria.controls.acc_type_cd.value);
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 10);
          } else {
            this.suggestedCustomer = [];
          }
          this.showWait=false
        },
        

        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }

  public SelectCustomer(cust: any): void {
    this.tm_deposit.acc_num = cust.acc_num;
    this.cName=cust.cust_name
    this.cAddress=cust.present_address
    this.cAcc=cust.acc_num
    this.gName=cust.guardian_name
    this.reportcriteria.controls.acct_num.setValue(cust.acc_num);
    // this.fromdate = Utils.convertStringToDt(cust.opening_dt);
    // this.toDate = this.sys.CurrentDate;
    this.suggestedCustomer = null;
    
  }

  public SubmitReport() {
   if(this.reportcriteria.controls.acc_type_cd.value=='5'){
      this.ShowMIS=true;
      this.ShowCC=false;
      this.Header="MIS CERTIFICATE";
    }
    else{
      this.ShowMIS=false;
      this.ShowCC=true;
      this.Header="TIME DEPOSIT CERTIFICATE";
    }
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.modalRef.hide();
      
      this.svc.addUpdDel<any>('Deposit/GetAccountOpeningData', this.tm_deposit).subscribe(
        res => {
          this.showTable=true;
          //debugger;
          this.isLoading = false;
          this.masterModel = res;
          let y=this.masterModel.tmdeposit.dep_period.split(";")[0]
          let m=this.masterModel.tmdeposit.dep_period.split(";")[1]
          let d=this.masterModel.tmdeposit.dep_period.split(";")[2]
          d=d.substr(4-d.length)
          console.log(d);
          m=m.substr(6-m.length)
          console.log(m);
          y=y.substr(5-y.length)
          console.log(y);
          if(+y>0){ this.Deposit_Period =y+' -Year'}
          else if(+m>0){this.Deposit_Period = m+' -Months'}
          else if(+d>0){ this.Deposit_Period = d+' -Days'}
        if(this.masterModel.tmdeposit.cheque_facility_flag=='Y'){
          this.sbAcc='Flexi A/C -'+this.masterModel.tmdeposit.user_acc_num
        }
        else{this.sbAcc=''}
        debugger

          this.renew_id=this.masterModel.tmdeposit.renew_id
          this.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === this.masterModel.tmdeposit.oprn_instr_cd.toString())[0].oprn_desc;
          for (let i = 0; i <=  this.masterModel.tdaccholder.length; i++) {
            console.log( this.masterModel);
            
          this.joinHold+=( this.masterModel.tdaccholder.length==0?'': this.masterModel.tdaccholder[i].acc_holder+',')
          console.log(this.joinHold);
          }
        })
      this.showAlert = false;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.toDate = this.reportcriteria.controls.toDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/passbookprint?'
      //   + 'ardb_cd='+this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&acc_type_cd=' + (+this.reportcriteria.controls.acc_type_cd.value)
      //   + '&acc_num=' + this.reportcriteria.controls.acct_num.value
      //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
      //   + '&to_dt=' + Utils.convertDtToString(this.toDate);
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
    this.getPrintFlag();
    // if(this.printFlag=='Y'){
    //   debugger
    //   this.modalRef = this.modalService.show(this.alreadyUpdate, this.config);
    //   this.disablePrint=true;
    // }
    // debugger
}
  getSMParameter(){
    this.svc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {console.log(sysRes);
        this.systemParam = sysRes;})
  }
  updateStatus(){
        var dt={
          "ardb_cd":this.sys.ardbCD,
          "acc_num":this.reportcriteria.controls.acct_num.value,
          "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
          "print_status":"Y",
          "renew_id":this.renew_id
         }
        this.svc.addUpdDel('Deposit/UpdateCertificateStatus',dt).subscribe(res=>{
          console.log(res);
          this.disablePrint=true;
          setTimeout(() => {
            this.modalRef = this.modalService.show(this.UpdateSuccess, this.config);
          }, 5000);
        })

  }
  getPrintFlag(){
    debugger
    var dc={
      "ardb_cd":this.sys.ardbCD,
      "renew_id":this.renew_id,
      "acc_num":this.reportcriteria.controls.acct_num.value,
      "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value
     }
     debugger
     this.svc.addUpdDel<any>('Deposit/GetCertificateStatus',dc).subscribe(
        res=>{
        console.log(res);
        debugger
        this.printFlag=res;
        if(this.printFlag=='Y'){
          debugger
          this.modalRef = this.modalService.show(this.alreadyUpdate, this.config);
          this.disablePrint=true;
        }
        else{this.disablePrint=false;}
      },
      err=>{
        this.printFlag=err.error.text
        debugger
        console.log(err.error.text);
        if(this.printFlag=='Y'){
          debugger
          this.modalRef = this.modalService.show(this.alreadyUpdate, this.config);
          this.disablePrint=true;
        }
        else{this.disablePrint=false;}
        
      })
     
    

}
  printCall(){
    debugger
    if(this.printFlag=='Y'){
      debugger
      this.disablePrint=true;
    }
    else{
      this.updateStatus();
    }
    
     
  }
 
  
  
  
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    else{
      this.isLoading=true;
    }
    // this.isLoading = false;
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    console.log(this.pagedItems)
  
    this.cd.detectChanges();
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'csv',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'cashcumtrial').subscribe(() => {
      // save started
      console.log("hello")
    });
  }


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

}
