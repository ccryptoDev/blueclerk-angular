import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvoicingComponent } from "./invoicing/invoicing.component";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { InvoiceDraftComponent } from "./invoice-draft/invoice-draft.component";
import { ToDoComponent } from "./to-do/to-do.component";
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { EstimatesComponent } from './estimates/estimates.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "invoices",
    pathMatch: "full",
  },
  {
    path: "invoices",
    component: InvoicingComponent,
  },
  {
    path: "toDo",
    component: ToDoComponent,
  },
  {
    path: "invoice-draft",
    component: InvoiceDraftComponent,
  },
  {
    path: "invoice-detail",
    component: InvoiceDetailComponent,
  },
  {
    path: 'purchase-order',
    component: PurchaseOrdersComponent,
  },
  {
    path: 'estimates',
    component: EstimatesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicingPageRoutingModule {}
