import { Component, OnInit } from '@angular/core';
import { ApiProvider } from '../../../service/api';
import { MatDialog } from '@angular/material';
import { DefaultModelComponent } from '../../../shared/components/default-model/default-model.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss']
})
export class InvoicingComponent implements OnInit {

  constructor(
    private apiProvider: ApiProvider,
    private dialog: MatDialog,
    private router: Router
  ) { }
  completedJobs: any[] = [];
  listTableHeads = ['Job ID', 'Technician', 'Customer', 'Type', 'Schedule', 'Options'];
  secondListTableHeads = ['Invoice ID', 'Job ID', 'Customer', 'Type', 'Amount', 'Tax', 'Total', 'Option'];
  invoices: any[] = [];
  secondListTitle = 'Invoices';
  listTitle = 'Complete Jobs';
  // saleTax: any[];

  ngOnInit() {
    this.getJobs();
  }

  editTheJob(event) {
    console.log(event);
  }

  getJobs() {
    this.apiProvider.getInvoices().subscribe((invoices: any) => {
      console.log(invoices);
      this.invoices = this.removeCancelFromInvoiceList(invoices.invoices);
      if (this.invoices.length > 0) {
        this.secondListTitle = `${this.secondListTitle} (${this.invoices.length})`;
      }
    });
  }

  openPopUp(event) {
    console.log(event);
  }

  removeCancelFromInvoiceList(allInvoices) {

    let list = [];
    list = allInvoices.filter((item) => {
        // return (item.status != 2);
        if (item.invoiceId) {
            item.invoiceId = item.invoiceId.replace('Invoice', '');
        }
        return item;
    });

    return list;

  }
  updateSearch(event) {}

  newCustomInvoice() {

    this.apiProvider.updateInvoiceGenerateJob({detail: new CustomInvoice(), editInvoice: false, customInvoice: true});
    this.router.navigate(['invoicing/invoice-draft']);
  }
}

export class CustomInvoice {
  name = '';
  timeSpent = 0;
  isFixed = true;
  hourlyRate = 0;
  charges = 0;
  taxPercentage = 0;
  tax = 0;
  total = 0;
  customer = '';
  note = '';
  type = 0;
}
