import { Component, OnInit } from '@angular/core';
import { ApiProvider } from '../../../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.scss']
})
export class EstimatesComponent implements OnInit {
  estimatesList = [];
  listTitle = 'Estimates';
  listTableHeads = ['No', 'Items', 'Customer', 'Total', 'Edit', 'Option'];
  constructor(
    private apiProvider: ApiProvider,
    private router: Router
  ) {
   }

  ngOnInit() {
    this.apiProvider.getEstimates().subscribe((orders: any) => {
      console.log(orders);
      const estimates = orders.estimates;
      this.estimatesList = estimates;
      if (this.estimatesList.length > 0) {
        this.listTitle = `Estimates (${this.estimatesList.length})`;
      }

      console.log(this.estimatesList);
    });

  }

  editTheJob(event) {
    const body = {
      event: event,
      type: 'editEstimates',
      title: 'Edit Estimates'
    };

    this.apiProvider.updatePurchaseOrderDetail(body);
    this.router.navigate(['/invoicing/invoice-draft']);
  }

  newEstimate() {
    const newPurchase = new SingleEstimateOrder();
    const body = {
      title: 'New Estimate',
      event: newPurchase,
      createPurchase: true,
      type: 'createEstimate'
    };
    this.apiProvider.updateCreatePurchaseEstimates(body);
    this.router.navigate(['/invoicing/invoice-draft']);
  }

  createInvoice(event) {
    // this.createPOEstimate(event._id);
    const body = {
      estimateId: event._id
    };
    this.apiProvider.generateInvoice(body).subscribe((response: any) => {
      if (response.status === 1) {
        this.router.navigate(['/invoicing/invoices']);
      }
    });
  }

  updateSearch(event) {
  }

  createPurchaseOrder(event) {
    console.log(event);
    const body = {
      estimateId: event._id,
    };
    this.apiProvider.createPOEstimate(body).subscribe((response: any) => {
      if (response.status === 1) {
        console.log(response);
        this.router.navigate(['/invoicing/purchase-order']);
      }
    });
  }

  // createPOEstimate(id) {
  //   const body = {
  //     estimateId: id,
  //   };

  //   this.apiProvider.createPOEstimate(body).subscribe((response: any) => {
  //     console.log(response);
  //     if (response.status === 1) {
  //       console.log(response);
  //       this.apiProvider.getPurchaseOrders().subscribe((purchase: any) => {
  //         const purchaseOrder = purchase.purchaseOrders;
  //         console.log(purchaseOrder);
  //         purchaseOrder.map((purch: any) => {
  //           if (purch.estimate) {
  //             if (purch.estimate._id === id) {
  //               console.log(purch);
  //               this.updatePurchaseOrderStatus(1, purch._id);
  //             }
  //           }
  //         });
  //       });
  //     }
  //   });
  // }

  // updatePurchaseOrderStatus(stat, id) {
  //   const body = {
  //     purchaseOrderId: id,
  //     status: stat
  //   };
  //   this.apiProvider.updatePOstatus(body).subscribe((response: any) => {
  //     if (response.status === 1) {
  //       console.log(response);
  //       this.createPurchaseOrderInvoice(id);
  //     }
  //   });
  // }

  // createPurchaseOrderInvoice(id?) {
  //   const body = {
  //     purchaseOrderId: id,
  //   };

  //   this.apiProvider.createPOinvoice(body).subscribe((response: any) => {
  //     console.log(response);
  //     if (response.status === 1) {
  //       this.router.navigate(['/invoicing/invoices']);
  //     }
  //   });
  // }

}

export class SingleEstimateItem {

  name = '';
  itemCode = '';
  cost = 0;
  price = 0;
  quantity = 0;
  taxPercentage = '';
}

export class SingleEstimateOrder {
  items = [new SingleEstimateItem()];
  note = '';
  customer = '';
  total = 0;
}
