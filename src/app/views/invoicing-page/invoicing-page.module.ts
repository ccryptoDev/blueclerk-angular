import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicingComponent } from "./invoicing/invoicing.component";
import { SharedModule } from "../../shared/shared.module";
import { InvoicingPageRoutingModule } from "./invoicing-page-routing.module";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { InvoiceDraftComponent } from "./invoice-draft/invoice-draft.component";
import { MatCardModule } from "@angular/material";
import { ToDoComponent } from "./to-do/to-do.component";
import { PurchaseOrdersComponent } from "./purchase-orders/purchase-orders.component";
import { EstimatesComponent } from "./estimates/estimates.component";
import { NewPurchaseOrderComponent } from "./new-purchase-order/new-purchase-order.component";

@NgModule({
  declarations: [
    InvoicingComponent,
    InvoiceDetailComponent,
    InvoiceDraftComponent,
    ToDoComponent,
    PurchaseOrdersComponent,
    EstimatesComponent,
    NewPurchaseOrderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvoicingPageRoutingModule,
    MatCardModule,
  ],
})
export class InvoicingPageModule {}
