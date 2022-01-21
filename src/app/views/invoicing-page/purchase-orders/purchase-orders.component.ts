import { Component, OnInit } from "@angular/core";
import { ApiProvider } from "../../../service/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-purchase-orders",
  templateUrl: "./purchase-orders.component.html",
  styleUrls: ["./purchase-orders.component.scss"],
})
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrderList = [];
  listTitle = "Purchase Orders";
  listTableHeads = ["No", "Items", "Customer", "Total", 'Edit', "Option"];
  constructor(private apiProvider: ApiProvider, private router: Router) {}

  ngOnInit() {
    this.apiProvider.getPurchaseOrders().subscribe((orders: any) => {
      console.log(orders);
      const purchaseOrders = orders.purchaseOrders;
      this.purchaseOrderList = purchaseOrders;
      if (this.purchaseOrderList.length > 0) {
        this.listTitle = `Purchase Orders (${this.purchaseOrderList.length})`;
      }

      console.log(this.purchaseOrderList);
    });
  }

  editTheJob(event) {
    const body = {
      event: event,
      type: 'editPurchaseOrder',
      title: 'Edit Purchase Order'
    };
    this.apiProvider.updatePurchaseOrderDetail(body);
    this.router.navigate(['/invoicing/invoice-draft']);
  }

  newPurchaseOrder() {
    const newPurchase = new SinglePurchaseOrder();
    const body = {
      title: 'New Purchase Order',
      event: newPurchase,
      createPurchase: true,
      type: 'createPurchaseOrder'
    };
    this.apiProvider.updateCreatePurchaseEstimates(body);
    this.router.navigate(['/invoicing/invoice-draft']);
  }

  createInvoice(event) {
    console.log(event);
    const body = {
      purchaseOrderId: event._id,
    };

    this.apiProvider.generateInvoice(body).subscribe((response: any) => {
      console.log(response);
      if (response.status === 1) {
        this.router.navigate(['/invoicing/invoices']);
      }
    });
  }

  updateSearch(event) {
    // missing implementation, just adding this method because I was getting an error
  }

  createEstimates(event) {
    console.log(event);
    const body = {
      purchaseOrderId: event._id,
    };

    this.apiProvider.createEstimate(body).subscribe((response: any) => {
      if (response.status === 1) {
        this.router.navigate(['/invoicing/estimates']);
      }
    });
  }
}

export class SinglePurchaseOrderItem {

  name = '';
  itemCode = '';
  cost = 0;
  price = 0;
  quantity = 0;
  taxPercentage = '';
}

export class SinglePurchaseOrder {
  items = [new SinglePurchaseOrderItem()];
  note = '';
  customer = '';
  total = 0;
}

