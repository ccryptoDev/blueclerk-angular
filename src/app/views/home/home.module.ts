import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { DataTableModule } from "angular2-datatable";
import { Ng2TableModule } from "ng2-table/ng2-table";
// import { AgGridModule } from 'ag-grid-angular/main';
import { ToasterModule } from "angular2-toaster";
import { SelectModule } from "ng-select";

import { SharedModule } from "../../shared/shared.module";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { FullCalendarModule } from "@fullcalendar/angular";
import { UserService } from "../../shared/users/user.service";
import { StorageService } from "../../shared/storage/storage.service";

import { CKEditorModule } from "ng2-ckeditor";
import { GymComponent } from "../gym/gym.component";
//import { GroupComponent } from "../group/group.component";
//import { UserComponent } from "../user/user.component";
// import { EquipmentComponent } from "../equipment/equipment.component";
//import { BrandComponent } from "../brand/brand.component";
//import { TypeComponent } from "../type/type.component";

import { GroupEquipmentComponent } from "../group-equipment/group-equipment.component";
import { ReportComponent } from "../report/report.component";
import { AgmCoreModule } from "@agm/core";
//import { ManagerComponent } from "../manager/manager.component";
import { EquipmentExerciseComponent } from "../equipment-exercise/equipment-exercise.component";
//import { TechComponent } from "../tech/tech.component";
//import { TechManagerComponent } from "../tech-manager/tech-manager.component";
import { TechstuffComponent } from "../techstuff/techstuff.component";
import { ActionStuffComponent } from "../action-stuff/action-stuff.component";
import { DataEntryComponent } from "../data-entry/data-entry.component";
//import { EmailScheduleComponent } from "../email-schedule/email-schedule.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

import { GroupManagerComponent } from "../group-manager/group-manager.component";
// import { RoleTechinicianListComponent } from "../role-techinician-list/role-techinician-list.component";
import { InvoiceComponent } from "../invoice/invoice.component";
import { BillingComponent } from "../billing/billing.component";
import { TaginvoiceComponent } from "../taginvoice/taginvoice.component";
import { BillingHistoryComponent } from "../billing-history/billing-history.component";
import { BillingInvoiceComponent } from "../billing-invoice/billing-invoice.component";
import { GroupTechnicianListComponent } from "../group-technician-list/group-technician-list.component";
// import { RolemanagerlistComponent } from '../rolemanagerlist/rolemanagerlist.component';
import { GroupInventoryListComponent } from "../group-inventory-list/group-inventory-list.component";
import { ViewGroupTechnicianComponent } from "../view-group-technician/view-group-technician.component";
import { BillingMethodComponent } from "../billing-method/billing-method.component";
import { CompanyEquipmentComponent } from "../company-equipment/company-equipment.component";
import { InventoryMoreComponent } from "../inventory-more/inventory-more.component";
import { SubscriptionComponent } from "../subscription/subscription.component";
import { MatIconModule, MatRippleModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { SharedCpnModule } from "../../components/shared-cpn.module";

const routes: Routes = [
  { path: "", redirectTo: "billing", pathMatch: "full" },
  {
    path: "billing",
    component: BillingComponent,
    children: [
      { path: "billingmethod", component: BillingMethodComponent },
      { path: "billinghistory", component: BillingHistoryComponent },
      { path: "subscribeuser", component: SubscriptionComponent },
    ],
  },
  {
    path: "brands",
    loadChildren: () =>
      import("./../brand/brand.module").then((m) => m.BrandModule),
  },
  {
    path: "company-profile",
    loadChildren: () =>
      import("./../company-profile/company-profile.module").then(
        (m) => m.CompanyProfileModule
      ),
  },
  {
    path: "employees",
    loadChildren: () =>
      import("./../employees/employees.module").then((m) => m.EmployeesModule),
  },
  {
    path: "equipment-type",
    loadChildren: () =>
      import("./../type/type.module").then((m) => m.TypeModule),
  },
  {
    path: "group",
    loadChildren: () =>
      import("./../group/group.module").then((m) => m.GroupModule),
  },
  {
    path: "invoice",
    loadChildren: () =>
      import("./../admin-invoicing/invoicing.module").then(
        (m) => m.InvoicingModule
      ),
  },
  {
    path: "job-types",
    loadChildren: () =>
      import("./../jobs/jobs.module").then((m) => m.JobsModule),
  },
  {
    path: "report-number",
    loadChildren: () =>
      import("./../admin/admin.module").then((m) => m.AdminModule),
    data: {
      openModal: true,
    },
  },
  {
    path: "roles-permissions",
    loadChildren: () =>
      import("./../roles/roles.module").then((m) => m.RolesModule),
  },
  {
    path: "vendors",
    loadChildren: () =>
      import("./../vendor-list/vendor-list.module").then(
        (m) => m.VendorListModule
      ),
  },

  { path: "location", component: GymComponent },
  { path: "group-equipment", component: GroupEquipmentComponent },
  { path: "group-manager", component: GroupManagerComponent },
  { path: "taginvoice", component: TaginvoiceComponent },
  { path: "billinginvoice", component: BillingInvoiceComponent },
  { path: "viewreport", component: InvoiceComponent },
  { path: "equipment-exercise", component: EquipmentExerciseComponent },
  { path: "techstuff", component: TechstuffComponent },
  { path: "action-stuff", component: ActionStuffComponent },
  { path: "data-entry", component: DataEntryComponent },
  { path: "grouptechnicianlist", component: GroupTechnicianListComponent },
  { path: "groupinventorylist", component: GroupInventoryListComponent },
  { path: "viewgrouptechnician", component: ViewGroupTechnicianComponent },
  { path: "inventorydetails", component: InventoryMoreComponent },
  // { path: "billinghistory", component: BillingHistoryComponent },
  // { path: "billingmethod", component: BillingMethodComponent },
  // { path: "subscribeuser", component: SubscriptionComponent }
  // { path: "rolemanagerlist", component: RolemanagerlistComponent },
  // { path: "roletechinicianlist", component: RoleTechinicianListComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
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
  ],
  declarations: [
    GymComponent,
    GroupEquipmentComponent,
    GroupManagerComponent,
    GroupTechnicianListComponent,
    InvoiceComponent,
    TaginvoiceComponent,
    BillingComponent,
    BillingHistoryComponent,
    BillingInvoiceComponent,
    BillingMethodComponent,
    EquipmentExerciseComponent,
    TechstuffComponent,
    ActionStuffComponent,
    DataEntryComponent,
    // RoleTechinicianListComponent,
    // RolemanagerlistComponent,
    GroupInventoryListComponent,
    ViewGroupTechnicianComponent,
    InventoryMoreComponent,
    SubscriptionComponent,
  ],
  providers: [UserService, StorageService],
  exports: [RouterModule],
})
export class HomeModule {
  constructor(private userInfo: UserService, private router: Router) {
    let type = this.userInfo.getUserInfo("type");
    if (type == 1) {
      router.navigate(["/dashboard"]);
      return;
    } else if (type == 2) {
      router.navigate(["/gym"]);
      return;
    }
  }
}
