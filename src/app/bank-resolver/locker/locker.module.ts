import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockerRoutingModule } from './locker-routing.module';
import { LoakerDetailMasterComponent } from './loaker-detail-master/loaker-detail-master.component';
import { LoakerRentMasterComponent } from './loaker-rent-master/loaker-rent-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankResolverModule } from '../bank-resolver.module';
import { LockerOpeningComponent } from './locker-opening/locker-opening.component';
import { LockerTransactionComponent } from './locker-transaction/locker-transaction.component';
import { LockerApproveComponent } from './locker-approve/locker-approve.component';
import { LockerViewComponent } from './locker-view/locker-view.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [LoakerDetailMasterComponent,LoakerRentMasterComponent, LockerOpeningComponent, 
    LockerTransactionComponent, LockerApproveComponent, LockerViewComponent],
  imports: [
    CommonModule,
    LockerRoutingModule,
     ReactiveFormsModule,
     FormsModule ,
     BankResolverModule,
     MatTooltipModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LockerModule { }
