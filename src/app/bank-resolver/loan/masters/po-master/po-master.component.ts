import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues, mm_dist } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';

@Component({
  selector: 'app-po-master',
  templateUrl: './po-master.component.html',
  styleUrls: ['./po-master.component.css']
})
export class PoMasterComponent implements OnInit {

  brnDtls: m_branch[]=[];
  districts: mm_dist[] = [];
  sys = new SystemValues();
  isLoading=false;
  POMaster: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  block:any=[];
  ps:any=[];
  hideSArea=true;
  allPO:any=[];
  allPO1:any=[];
  allServiceArea:any=[]
  showNoResult:false;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }

  ngOnInit(): void {
    this.getServiceAreaMaster();
    // this.GetServiceAreaMaster();
    this.getBlock();
    this.getPs();
    
    this.allPO=null;
    this.POMaster = this.formBuilder.group({
      service_area: ['', Validators.required],
      sareablock: ['', Validators.required],
      PO_id: ['', Validators.required],
      PO_name: ['', Validators.required],
      pin: ['', Validators.required],
      ps: ['', Validators.required],
      state: [10, Validators.required],
      district: [19, Validators.required]
      
    });
    this.POMaster.controls.PO_id.disable();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.getDistMaster();
  }
  get f() { return this.POMaster.controls; }
  
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  getServiceAreaMaster(){
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
   
    this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
      res => {
        // this.allPO=res;
        this.allServiceArea=res;
        console.log(this.allServiceArea)
      },
      err => { }
    );
  }
  getDistMaster(){
    this.svc.addUpdDel<mm_dist[]>('Mst/GetDistMaster', null).subscribe(
      res => {
        this.districts = res;
      },
      err => { }
    );
  }
   getBlock(){
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        this.block=res;
      },
      err => {"Error from server side"}
    );
  }
  getPs(){
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetPsMaster', dt).subscribe(
      res => {
        this.ps=res;
      },
      err => {"Error from server side"}
    );
  }
  setAreaDtls(s_area:any){
    this.getBlock()
    //  console.log(this.allPO1.filter(e=>e.po_id.includes(this.f.PO_id.value) || e.po_name.toLowerCase().includes(this.f.PO_id.value.toLowerCase()))[0].block_cd)
   console.log(s_area)
    this.POMaster.controls.service_area.setValue(s_area.service_area_cd);
    this.POMaster.controls.sareablock.setValue(s_area.block_cd);
    this.POMaster.controls.PO_id.setValue(s_area.po_id);
    this.POMaster.controls.PO_name.setValue(s_area.po_name)
    this.POMaster.controls.ps.setValue(s_area.ps_id)
    this.POMaster.controls.pin.setValue(s_area.pin)
    this.allPO=null
    this.POMaster.controls.sareablock.disable();
    this.POMaster.controls.PO_id.disable();
  

  }

  suggestArea(){
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
  }
  new()
  { 
    this.initialize();
    this.POMaster.controls.sareablock.reset();
    this.POMaster.controls.PO_id.reset();
    this.POMaster.controls.PO_name.reset();
    this.POMaster.controls.sareablock.enable();
    this.POMaster.controls.ps.enable();
    this.isDel = false;
    this.isRetrieve = false;
    // this.isNew = false;
    // this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.hideSArea=true
    // this.GetServiceAreaMaster();
  }

  GetPoMaster()
  {
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
   
    this.svc.addUpdDel<any>('Mst/GetPoMaster', dt).subscribe(
      res => {
        // this.allPO=res;
        this.allPO1=res;
        console.log(this.allPO)
        
        if (res.length<0)
        {
          this.HandleMessage(true, MessageType.Sucess,'Post Office Not found !!!' );
        }
        else
        {
        // this.POMaster.controls.PO_id.enable();
        this.isLoading=true;
        this.isDel = true;
        this.isRetrieve = false;
        this.isNew = false;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
        debugger
        this.allPO=this.allPO1.filter(e=>e.po_id.toString().includes(this.f.PO_id.value) || e.po_name.toLowerCase().includes(this.f.PO_id.value.toLowerCase()))
        console.log(this.allPO)
        }

        
        this.isLoading=false

      },
      err => { this.isLoading=false;  this.HandleMessage(true, MessageType.Error,'Service Area Not found !!!' );
      
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = false;
      this.isModify = false;
      this.isSave = false;
      this.isClear = true;
    }
    )
  
  }
  
  retrieve ()
    {
      this.hideSArea=false
      this.POMaster.controls.PO_id.enable()
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
    // this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
    //   res => {
    //     this.allPO=res;
    //     if (res.length==0)
    //     {
    //       this.HandleMessage(true, MessageType.Sucess,'Service Area Not found !!!' );
    //     }
    //     else
    //     {
    //     this.POMaster.controls.PO_id.enable();
    //     this.isDel = true;
    //     this.isRetrieve = false;
    //     this.isNew = false;
    //     this.isModify = true;
    //     this.isSave = false;
    //     this.isClear = true;
    //     }

    //   },
    //   err => { ;  this.HandleMessage(true, MessageType.Error,'Service Area Not found !!!' );
    //   this.initialize();
    //   this.isDel = false;
    //   this.isRetrieve = true;
    //   this.isNew = false;
    //   this.isModify = false;
    //   this.isSave = false;
    //   this.isClear = true;
    // }
    // )
  }

  
  saveuser()
  {

    var dt={
      "ardb_cd":this.sys.ardbCD,
      "block_cd":this.POMaster.controls.sareablock.value,
      "state_cd":this.POMaster.controls.state.value,
      "dist_cd":this.POMaster.controls.district.value,
      "ps_id":this.POMaster.controls.ps.value,
      "service_area_cd":this.POMaster.controls.service_area.value,
      "po_name": this.POMaster.controls.PO_name.value,
      "pin": this.POMaster.controls.pin.value,


    }
    
    this.svc.addUpdDel('Mst/InsertPoMaster', dt).subscribe(
      res => {
        ;
       
        this.POMaster.controls.PO_id.setValue(res);
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved Post Office Details, Your Service  Post Office ID is:'+res );
        this.initialize();
    
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Insertion Failed!!' );
              this.isDel = false;
              this.isRetrieve = false;
              this.isNew = false;
              this.isModify = false;
              this.isSave = true;
              this.isClear = true;
    }
    )

  }
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "block_cd":this.POMaster.controls.sareablock.value,
      "state_cd":this.POMaster.controls.state.value,
      "dist_cd":this.POMaster.controls.district.value,
      "service_area_cd":this.POMaster.controls.service_area.value,
      "ps_id":this.POMaster.controls.ps.value,
      "po_name": this.POMaster.controls.PO_name.value,
      "po_id": this.POMaster.controls.PO_id.value,
      "pin": this.POMaster.controls.pin.value,

    }
    //login.login_status='N';
    ;
    this.svc.addUpdDel('Mst/UpdatePo', dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Update Post Office' );
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = true;
      this.isSave = false;
      this.isClear = true;
    }
    )

  }
  deleteuser()
   {
  //   this.isLoading=true;
  //   this.showMsg =null;
  //   var dt={
  //     "ardb_cd":this.sys.ardbCD,
  //     "block_cd":this.POMaster.controls.sareablock.value,
  //     "state_cd":this.POMaster.controls.state.value,
  //     "dist_cd":this.POMaster.controls.district.value,
  //     "po_name": this.POMaster.controls.PO_name.value,

  //   }
  //   this.svc.addUpdDel('Sys/DeleteUserMaster', dt).subscribe(
  //     res => {
  //       ;
  //       this.isLoading=false;
  //       this.HandleMessage(true, MessageType.Sucess,'User Details Deleted' );
  //       this.initialize();
  //       this.isDel = false;
  //       this.isRetrieve = true;
  //       this.isNew = true;
  //       this.isModify = false;
  //       this.isSave = false;
  //       this.isClear = true;
  //     },
  //     err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Deletion Failed!!' );
  //     this.initialize();
  //     this.isDel = false;
  //     this.isRetrieve = true;
  //     this.isNew = true;
  //     this.isModify = false;
  //     this.isSave = false;
  //     this.isClear = true;
  //   }
  //   )

  }
  clearuser()
  {
    
    this.initialize();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    this.hideSArea=true;
    this.POMaster.controls.sareablock.disable();
    this.POMaster.controls.ps.disable();
    
  }
  initialize()
  {
    this.allPO=null;
    this.POMaster.controls.sareablock.reset();
    this.POMaster.controls.PO_id.reset();
    this.POMaster.controls.PO_name.reset();
    this.POMaster.controls.pin.reset();
    this.POMaster.controls.service_area.reset();
    this.POMaster.controls.ps.reset();
    this.POMaster.controls.PO_id.disable()
    this.isNew = false;
   
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
}
