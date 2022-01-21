import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DataTableModule } from "angular2-datatable";
import { Ng2TableModule } from "ng2-table/ng2-table";
import { ToasterModule } from "angular2-toaster";
import { SelectModule } from "ng-select";

import { SharedModule } from "../../shared/shared.module";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { FullCalendarModule } from "@fullcalendar/angular";
import { UserService } from "../../shared/users/user.service";
import { StorageService } from "../../shared/storage/storage.service";

import { CKEditorModule } from "ng2-ckeditor";
import { AgmCoreModule } from "@agm/core";
import { OwlDateTimeModule } from "ng-pick-datetime";

import { RolemanagerlistComponent } from "../rolemanagerlist/rolemanagerlist.component";
import { MatIconModule, MatRippleModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { SharedCpnModule } from "../../components/shared-cpn.module";
import { RoleManagerListRoutingModule } from "./rolemanagerlist-routing.module";

@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    DataTableModule,
    CKEditorModule,
    Ng2TableModule,
    ToasterModule,
    Ng2Bs3ModalModule,
    FullCalendarModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDVpFdNVfFFFLgzn_V7Zch_ZzkUiyxdxuw",
    }),
    OwlDateTimeModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    SharedCpnModule,
    RoleManagerListRoutingModule,
  ],
  declarations: [RolemanagerlistComponent],
  providers: [UserService, StorageService],
  exports: [RouterModule],
})
export class RolemanagerlistModule {}
