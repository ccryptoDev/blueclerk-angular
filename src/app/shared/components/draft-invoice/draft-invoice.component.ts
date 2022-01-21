import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiProvider } from '../../../service/api';

@Component({
  selector: 'app-draft-invoice',
  templateUrl: './draft-invoice.component.html',
  styleUrls: ['./draft-invoice.component.scss']
})
export class DraftInvoiceComponent implements OnInit {

  constructor(private router: Router, private apiProvider: ApiProvider, private cdRef: ChangeDetectorRef) { }
  @Input() invoiceJob;
  @Input() title;
  @Input() invoiceNumber;
  @Input() salesTaxes;
  @Input() invoiceView = true;
  @Input() editInvoice = false;
  @Input() editPurchaseOrder = false;
  @Input() purchaseOrderType = '';
  @Input() createNewPurchase = false;
  @Input() customInvoice = false;
  @Output() generate = new EventEmitter();
  @Output() updateRate = new EventEmitter();

  customerList;
  jobFixedOptions = [
    {
      title: 'Fixed',
      value: 0
    },
    {
      title: 'Hours',
      value: 1
    }
  ];
  ngOnInit() {
    console.log(this.invoiceView);
    const body = {
      includeActive: true,
      includeNonActive: false
    };

    this.apiProvider.getCustomer(body).subscribe((customers: any) => {
      this.customerList = this.formateCustomers(customers.customers);
      console.log(this.customerList);
    });
  }

  formateCustomers(customerList) {
    const newList = [];
    customerList.map(customer => {
      const a = {
        id: customer._id,
        name: customer.profile.displayName
      };
      newList.push(a);
    });
    return newList;
  }

  // updateJobRate() {
  //   console.log(this.invoiceJob.isFixed);
  //   this.updateRate.emit();
  // }

  getJobTotal(taxAmount: number) {
    this.invoiceJob.jobTotal = this.invoiceJob.charges + taxAmount;
    this.invoiceJob.total = this.invoiceJob.itemsTotal + this.invoiceJob.jobTotal;
  }

  getJobTaxAmount(taxPercentage) {
      const taxAmount = this.invoiceJob.charges * this.invoiceJob.taxPercentage / 100;
      this.invoiceJob['tax'] = taxAmount;
      this.getJobTotal(taxAmount);
  }

  updateJobRate() {
    if (!this.invoiceJob.isFixed) {
      this.invoiceJob.charges = this.invoiceJob.timeSpent * this.invoiceJob.hourlyRate;
      this.getJobTaxAmount(this.invoiceJob.taxPercentage);
    } else {
      this.getJobTaxAmount(this.invoiceJob.taxPercentage);
    }
  }

  generateInvoice() {
    this.generate.emit(this.invoiceJob);
  }

  updatePurchaseItem(item, index) {
    this.getTaxAmount(item, index);
  }

  getTaxAmount(item, index) {
    const itemCost = item.cost * item.quantity;
    const taxAmount = itemCost * item.taxPercentage / 100;
    const itemTotal = itemCost + taxAmount;
    this.invoiceJob.items[index]['tax'] = taxAmount;
    this.invoiceJob.items[index].price = itemTotal;
    let ItemsTotal = 0;

    if (this.invoiceJob.items.length === 1) {
      ItemsTotal = itemTotal;
    } else {
      this.invoiceJob.items.map((eachItem) => {
        ItemsTotal = ItemsTotal + eachItem.price;
      });
    }
    if (!this.invoiceView) {
      this.invoiceJob.total = ItemsTotal;
    } else {
      this.invoiceJob.itemsTotal = ItemsTotal;
      this.invoiceJob.total = ItemsTotal + this.invoiceJob.jobTotal;
    }
    console.log(ItemsTotal);

    console.log(this.invoiceJob);
  }

  addItem() {
    this.invoiceJob.items.push(new SinglePurchaseOrderItem());
  }

  goToBack() {
    console.log(this.editPurchaseOrder);
    console.log(this.purchaseOrderType);
    if (!this.editPurchaseOrder) {
      this.router.navigate(['/invoicing/invoices']);
    } else {
      if (this.purchaseOrderType === 'editPurchaseOrder') {
        this.router.navigate(['/invoicing/purchase-order']);
      } else {
        this.router.navigate(['/invoicing/estimates']);
      }
    }
  }
  updateJobType() {
    if (this.invoiceJob.type === 0) {
      this.invoiceJob.isFixed = true;
    } else {
      this.invoiceJob.isFixed = false;
    }
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
