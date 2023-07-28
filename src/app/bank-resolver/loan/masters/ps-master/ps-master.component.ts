import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues, mm_dist } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';

@Component({
  selector: 'app-ps-master',
  templateUrl: './ps-master.component.html',
  styleUrls: ['./ps-master.component.css']
})
export class PsMasterComponent implements OnInit {
  brnDtls: m_branch[]=[];
  districts: mm_dist[] = [];
  sys = new SystemValues();
  isLoading=false;
  policeStation: FormGroup;
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
  allPoliceStation:any=[];
 allPoliceStation1:any=[];
  showNoResult:false;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }

  ngOnInit(): void {
    // this.GetServiceAreaMaster();
    this.getBlock();
    this.getPs();
    
    this.allPoliceStation=null;
    this.policeStation = this.formBuilder.group({
      psBlock: ['', Validators.required],
      psId: ['', Validators.required],
      PsName: ['', Validators.required],
      state: [10, Validators.required],
      district: [19, Validators.required]
      
    });
    this.policeStation.controls.psId.disable();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.getDistMaster();
  }
  get f() { return this.policeStation.controls; }
  
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
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
    //  console.log(this.allPoliceStation1.filter(e=>e.service_area_cd.includes(this.f.psId.value) || e.service_area_name.toLowerCase().includes(this.f.psId.value.toLowerCase()))[0].block_cd)
   console.log(s_area)
    this.policeStation.controls.psBlock.setValue(s_area.block_cd);
    this.policeStation.controls.psId.setValue(s_area.ps_id);
    this.policeStation.controls.PsName.setValue(s_area.ps_name)
    // this.policeStation.controls.ps.setValue(s_area.ps_id)
    this.allPoliceStation=null
    this.policeStation.controls.psBlock.disable();
    // this.policeStation.controls.ps.disable();
  

  }

  suggestArea(){
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
  }
  new()
  { 
    this.initialize();
    this.policeStation.controls.psBlock.reset();
    this.policeStation.controls.psId.reset();
    this.policeStation.controls.PsName.reset();
    this.policeStation.controls.PsName.enable();
    this.policeStation.controls.psBlock.enable();
    // this.policeStation.controls.ps.enable();
    this.isDel = false;
    this.isRetrieve = false;
    // this.isNew = false;
    // this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.hideSArea=true
    // this.GetServiceAreaMaster();
  }

  GetServiceAreaMaster()
  {
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
   
    this.svc.addUpdDel<any>('Mst/GetPsMaster', dt).subscribe(
      res => {
        // this.allPoliceStation=res;
        this.allPoliceStation1=res;
        console.log(this.allPoliceStation)
        
        if (res.length<0)
        {
          this.HandleMessage(true, MessageType.Sucess,'Service Area Not found !!!' );
        }
        else
        {
        // this.policeStation.controls.psId.enable();
        this.isLoading=true;
        this.isDel = true;
        this.isRetrieve = false;
        this.isNew = false;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
        debugger
        this.allPoliceStation=this.allPoliceStation1.filter(e=>e.ps_id.toString().includes(this.f.psId.value) || e.ps_name.toLowerCase().includes(this.f.psId.value.toLowerCase()))
        console.log(this.allPoliceStation)
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
      this.policeStation.controls.psId.enable()
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
    // this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
    //   res => {
    //     this.allPoliceStation=res;
    //     if (res.length==0)
    //     {
    //       this.HandleMessage(true, MessageType.Sucess,'Service Area Not found !!!' );
    //     }
    //     else
    //     {
    //     this.policeStation.controls.psId.enable();
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
      "block_cd":this.policeStation.controls.psBlock.value,
      "state_cd":this.policeStation.controls.state.value,
      "dist_cd":this.policeStation.controls.district.value,
      "ps_name": this.policeStation.controls.PsName.value,

    }
    
    this.svc.addUpdDel('Mst/InsertPsMaster', dt).subscribe(
      res => {
        ;
       
        this.policeStation.controls.psId.setValue(res);
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved Police Station, Police Station ID is:'+res );
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
      "block_cd":this.policeStation.controls.psBlock.value,
      "state_cd":this.policeStation.controls.state.value,
      "dist_cd":this.policeStation.controls.district.value,
      "ps_id":this.policeStation.controls.psId.value,
      "ps_name": this.policeStation.controls.PsName.value,

    }
    //login.login_status='N';
    ;
    this.svc.addUpdDel('Mst/UpdatePs', dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated Police Station Details' );
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
  //     "block_cd":this.policeStation.controls.psBlock.value,
  //     "state_cd":this.policeStation.controls.state.value,
  //     "dist_cd":this.policeStation.controls.district.value,
  //     "service_area_name": this.policeStation.controls.PsName.value,

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
    this.policeStation.controls.psBlock.disable();
    
  }
  initialize()
  {
    this.allPoliceStation=null;
    this.policeStation.controls.psBlock.reset();
    this.policeStation.controls.psId.reset();
    this.policeStation.controls.PsName.reset();
    this.policeStation.controls.psId.disable()
    this.isNew = false;
   
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
}
