import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { AccessComponent } from "./views/access/access.component";
import { RecoverComponent } from "./views/recover/recover.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  //  {
  //    path: "login",
  //    component: LoginComponent,
  //    data: {
  //      title: "Login Page"
  //    }
  //  },
  {
    path: "login",
    loadChildren: () =>
      import("./views/login/login.module").then((m) => m.LoginModule),
    // canActivate: [AuthGuard]
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./views/auth-page/auth-page.module").then(
        (m) => m.AuthPageModule
      ),
    // canActivate: [AuthGuard]
  },
  {
    path: "login/:from",
    loadChildren: () =>
      import("./views/auth-page/auth-page.module").then(
        (m) => m.AuthPageModule
      ),
    data: {
      title: "Login Page",
    },
  },
  { path: "access", pathMatch: "full", component: AccessComponent },
  { path: "recover", pathMatch: "full", component: RecoverComponent },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "dashboard",
        loadChildren: "./views/dashboard/dashboard.module#DashboardModule",
      },
      {
        path: "admin",
        loadChildren: "./views/home/home.module#HomeModule",
      },
      {
        path: "people",
        children: [
          {
            path: "",
            redirectTo: "group",
            pathMatch: "full",
          },
          {
            path: "group",
            loadChildren: "./views/group/group.module#GroupModule",
          },
          {
            path: "technicians",
            loadChildren: "./views/tech/tech.module#TechModule",
          },
          {
            path: "manager",
            loadChildren: "./views/manager/manager.module#ManagerModule",
          },
          {
            path: "officeadmin",
            loadChildren:
              "./views/office-admin/office-admin.module#OfficeAdminModule",
          },
        ],
      },
      {
        path: "tags",
        children: [
          {
            path: "",
            redirectTo: "purchasedtag",
            pathMatch: "full",
          },
          {
            path: "purchasedtag",
            loadChildren:
              "./views/purchased-tag/purchased-tag.module#PurchasedTagModule",
          },
          {
            path: "buytag",
            loadChildren: "./views/buytag/buytag.module#BuytagModule",
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "",
            redirectTo: "company-inventory",
            pathMatch: "full",
          },
          {
            path: "company-inventory",
            loadChildren: "./views/inventory/inventory.module#InventoryModule",
          },
        ],
      },
      {
        path: "invoicing",
        loadChildren:
          "./views/invoicing-page/invoicing-page.module#InvoicingPageModule",
      },
      {
        path: "integrations",
        loadChildren:
          "./views/integrations/integrations.module#IntegrationsModule",
      },
      {
        path: "customers",
        children: [
          {
            path: "",
            redirectTo: "customer-list",
            pathMatch: "full",
          },
          {
            path: "customer-list",
            loadChildren: "./views/customer/customer.module#CustomerModule",
          },
          {
            path: "newcustomer",
            loadChildren:
              "./views/new-customer/new-customer.module#NewCustomerModule",
          },
          {
            path: "schedule",
            loadChildren:
              "./views/visit-list/visit-list.module#VisitListModule",
          },
          {
            path: "reports/:id",
            loadChildren:
              "./views/customer-reports/customer-reports.module#CustomerReportsModule",
          },
          {
            path: "jobs/:id",
            loadChildren:
              "./views/visit-list/visit-list.module#VisitListModule",
            data: { value: "jobs" },
          },
          {
            path: "tickets/:id",
            loadChildren:
              "./views/visit-list/visit-list.module#VisitListModule",
            data: { value: "tickets" },
          },
          {
            path: "view/:id",
            loadChildren:
              "./views/customer-view/customer-view.module#CustomerViewModule",
          },
          {
            path: ":id",
            loadChildren: "./views/customer/customer.module#CustomerModule",
          },
        ],
      },
      // {
      //   path: "customers/:id",
      //   loadChildren: "./views/customer/customer.module#CustomerModule",
      // },
      // {
      //   path: "customer/reports/:id",
      //   loadChildren:
      //     "./views/customer-reports/customer-reports.module#CustomerReportsModule",
      // },
      // {
      //   path: "customer/jobs/:id",
      //   loadChildren: "./views/visit-list/visit-list.module#VisitListModule",
      //   data: { value: "jobs" },
      // },
      // {
      //   path: "customer/tickets/:id",
      //   loadChildren: "./views/visit-list/visit-list.module#VisitListModule",
      //   data: { value: "tickets" },
      // },
      // {
      //   path: "customer/view/:id",
      //   loadChildren:
      //     "./views/customer-view/customer-view.module#CustomerViewModule",
      // },
      {
        path: "reports",
        loadChildren: "./views/report/report.module#ReportModule",
      },
      {
        path: "report/:id",
        loadChildren: "./views/report/report.module#ReportModule",
      },
      // {
      //   path: "admin",
      //   loadChildren: "./views/admin/admin.module#AdminModule"
      // },
      {
        path: "location",
        loadChildren: "./views/gym_owner/gym.module#GymModule",
      },
      {
        path: "manufacture",
        loadChildren:
          "./views/manufacture/manufacture.module#ManufactureModule",
      },
      {
        path: "user",
        loadChildren: "./views/user/user.module#UserJSModule",
      },
      // {
      //   path: "home",
      //   loadChildren: "./views/home/home.module#HomeModule",
      // },
      {
        path: "tech_manager",
        loadChildren:
          "./views/tech-manager/tech-manager.module#TechManagerModule",
      },
      // {
      //   path: "group",
      //   loadChildren: "./views/group/group.module#GroupModule",
      // },
      {
        path: "manager-group",
        loadChildren:
          "./views/manager-group/manager-group.module#ManagerGroupModule",
      },
      // {
      //   path: "technicians",
      //   loadChildren: "./views/tech/tech.module#TechModule",
      // },
      // {
      //   path: "manager",
      //   loadChildren: "./views/manager/manager.module#ManagerModule",
      // },
      // {
      //   path: "officeadmin",
      //   loadChildren:
      //     "./views/office-admin/office-admin.module#OfficeAdminModule",
      // },
      {
        path: "pastinvoice",
        loadChildren:
          "./views/past-invoice/past-invoice.module#PastInvoiceModule",
      },
      // {
      //   path: "buytag",
      //   loadChildren: "./views/buytag/buytag.module#BuytagModule",
      // },
      // {
      //   path: "purchasedtag",
      //   loadChildren:
      //     "./views/purchased-tag/purchased-tag.module#PurchasedTagModule",
      // },
      {
        path: "equipment",
        loadChildren: "./views/equipment/equipment.module#EquipmentModule",
      },
      {
        path: "customerlist",
        loadChildren:
          "./views/customer-list/customer-list.module#CustomerListModule",
      },
      {
        path: "generate-invoice",
        loadChildren:
          "./views/generate-invoice/generate-invoice.module#GenerateInvoiceModule",
      },

      // {
      //   path: "type",
      //   loadChildren: "./views/type/type.module#TypeModule"
      // },
      // {
      //   path: "brand",
      //   loadChildren: "./views/brand/brand.module#BrandModule"
      // },
      {
        path: "assignbrand",
        loadChildren:
          "./views/assignbrand/assignbrand.module#AssignBrandModule",
      },
      {
        path: "profile",
        loadChildren: "./views/profile/profile.module#ProfileModule",
      },
      // {
      //   path: 'group',
      //   loadChildren: './views/group/group.module#GroupModule'
      // },
      // {
      //   path: 'group',
      //   loadChildren: './views/group/group.module#GroupModule'
      // },
      // {
      //   path: 'email-schedule',
      //   loadChildren: './views/email-schedule/email-schedule.module#EmailScheduleModule'
      // },

      // {
      //   path: "roles",
      //   loadChildren: "./views/roles/roles.module#RolesModule"
      // },
      // {
      //   path: "company-profile",
      //   loadChildren:
      //     "./views/company-profile/company-profile.module#CompanyProfileModule"
      // },
      {
        path: "setting",
        loadChildren: "./views/setting/setting.module#SettingModule",
      },
      // {
      //   path: "viewuser",
      //   loadChildren: "./views/viewuser/viewuser.module#ViewuserModule"
      // },
      // {
      //   path: "report-number",
      //   loadChildren: "./views/admin/admin.module#AdminModule",
      //   data: {
      //     openModal: true
      //   }
      // },
      // {
      //   path: 'vendors',
      //   loadChildren: './views/vendor-list/vendor-list.module#VendorListModule'
      // },
      // {
      //   path: 'invoice',
      //   loadChildren: './views/admin-invoicing/invoicing.module#InvoicingModule'
      // },
      {
        path: "individual-profile",
        loadChildren: "./views/individual/individual.module#IndividualModule",
      },
      // {
      //   path: "newuser",
      //   loadChildren: "./views/new-user/new-user.module#NewUserModule"
      // },
      {
        path: "newemployee",
        loadChildren:
          "./views/new-employee/new-employee.module#NewEmployeeModule",
      },
      {
        path: "companyEquipmentList",
        loadChildren:
          "./views/company-equipment/company-equipment.module#CompanyEquipmentModule",
      },
      // {
      //   path: "employees",
      //   loadChildren:
      //     "./views/employees/employees.module#EmployeesModule"
      // },
      // {
      //   path: "jobs",
      //   loadChildren:
      //     "./views/jobs/jobs.module#JobsModule"
      // }
    ],
  },
  { path: "**", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
