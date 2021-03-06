import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { DataTableModule } from "angular2-datatable";
import { ToasterModule } from "angular2-toaster";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { RolesComponent } from "./roles.component";
import { RolesRoutingModule } from "./roles-routing.module";
import { SharedModule } from "../../shared/shared.module";
import {
  MatIconModule,
  MatRippleModule,
  MatButtonModule,
} from "@angular/material";
import { SharedCpnModule } from "../../components/shared-cpn.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RolesRoutingModule,
    ChartsModule,
    DataTableModule,
    ToasterModule,
    Ng2Bs3ModalModule,
    SharedModule,
    BsDropdownModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    SharedCpnModule,
    ButtonsModule.forRoot(),
  ],
  declarations: [RolesComponent],
})
export class RolesModule {}
