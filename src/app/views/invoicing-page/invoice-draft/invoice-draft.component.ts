import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiProvider } from '../../../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-draft',
  templateUrl: './invoice-draft.component.html',
  styleUrls: ['./invoice-draft.component.scss']
})
export class InvoiceDraftComponent implements OnInit, OnDestroy {
  invoiceJob: any;
  invoiceNumber: any;
  displayInvoice = false;
  salesTaxes: any[];
  editInvoice = false;
  invoiceView = true;
  title;
  editPurchaseOrder;
  purchaseOrderType;
  createNewPurchase = false;
  customInvoice = false;
  constructor(
    private apiProvider: ApiProvider,
    private router: Router
  ) { }

  ngOnInit() {
    this.apiProvider.invoiceGenerateJob.subscribe((job: any) => {
      if (job) {
        if (job.customInvoice) {
          this.customInvoice = job.customInvoice;
        } else {
          this.customInvoice = false;
        }
        console.log(job);
        this.title = 'Invoice';
        this.invoiceJob = job.detail;
        this.invoiceView = true;
        this.editInvoice = job.editInvoice;
        this.apiProvider.getCurrentInvoiceNumber().subscribe((number: any) => {
          this.invoiceNumber = number.currentInvoiceNumber + 1;
          // console.log(number);
          this.invoiceJob['jobTotal'] = 0;
          this.invoiceJob['total'] = 0;
          this.invoiceJob['itemsTotal'] = 0;
          this.generateSaleTax(job);
        });
      } else {
        this.apiProvider.editPurchaseOrder.subscribe((purchaseOrder) => {
          if (purchaseOrder) {
            this.title = purchaseOrder.title;
            this.invoiceView = false;
            this.invoiceJob = purchaseOrder.event;
            this.purchaseOrderType = purchaseOrder.type;
            this.editPurchaseOrder = true;
            console.log(this.invoiceJob);
            this.generateSaleTax();
          } else {
            this.apiProvider.createPurchaseEstimate.subscribe((newPurchase) => {
              if (newPurchase) {
                this.title = newPurchase.title;
                this.invoiceView = false;
                this.invoiceJob = newPurchase.event;
                this.editPurchaseOrder = false;
                this.purchaseOrderType = newPurchase.type;
                this.createNewPurchase = true;
                this.generateSaleTax();
              }
              // } else {
              //   this.router.navigate(['/invoicing/invoices']);
              // }
            });
          }
        });
      }
    });

  }

  generateSaleTax(job?) {
    this.apiProvider.getSaleTax().subscribe((saleTax: any) => {
      // console.log(saleTax);
      if (this.invoiceView) {
        if (job && !job.editInvoice) {
          this.formatJobData(saleTax);
        } else {
          this.invoiceJob.taxPercentage = Math.ceil(this.invoiceJob.taxPercentage);
        }
      }
      const zeroTax = {
        _id: '0',
        tax: 0
      };
      saleTax.taxes.push(zeroTax);
      this.salesTaxes = saleTax.taxes;
      this.displayInvoice = true;
    });
  }

  formatJobData(saleTax) {
    if (this.invoiceJob.salesTax) {
      saleTax.taxes.map((tax: any) => {
        if (tax._id === this.invoiceJob.salesTax) {
          this.invoiceJob['taxPercentage'] = Math.ceil(tax.tax);
          this.getTaxAmount(Math.ceil(tax.tax));
        }
      });
    } else {
      this.invoiceJob['taxPercentage'] = 0;
      this.getTaxAmount(0);
    }
  }

  getJobTotal(taxAmount: number) {
    this.invoiceJob.jobTotal = this.invoiceJob.charges + taxAmount;
    this.invoiceJob.total = this.invoiceJob.total + this.invoiceJob.jobTotal;
  }

  getTaxAmount(taxPercentage) {
      const taxAmount = this.invoiceJob.charges * this.invoiceJob.taxPercentage / 100;
      this.invoiceJob['tax'] = taxAmount;
      this.getJobTotal(taxAmount);
  }

  updateJobRate() {
    if (!this.invoiceJob.isFixed) {
      this.invoiceJob.charges = this.invoiceJob.timeSpent * this.invoiceJob.hourlyRate;
      this.getTaxAmount(this.invoiceJob.taxPercentage);
    } else {
      this.getTaxAmount(this.invoiceJob.taxPercentage);
    }
  }

  generateNew(event) {
    this.invoiceJob = event;
    if (this.invoiceView) {
      if (this.customInvoice) {
        this.generateCustomInvoice();
      } else {
        this.generateInvoice();
      }
    } else {
      if (this.createNewPurchase) {
        if (this.purchaseOrderType === 'createPurchaseOrder') {
          this.generateNewPurchaseOrder();
        } else {
          this.generateNewEstimate();
        }
      } else {
        if (this.purchaseOrderType === 'editPurchaseOrder') {
          this.generatePurchaseOrder();
        } else {
          this.editEstimates();
        }
      }
    }
  }

  generateCustomInvoice() {
    const appliedTax = Math.ceil(this.invoiceJob.taxPercentage);
    const body = {
      customerId: this.invoiceJob.customer,
      tax: appliedTax,
      charges: this.invoiceJob.charges,
      timeSpent: this.invoiceJob.timeSpent,
      hourlyRate: this.invoiceJob.hourlyRate,
      note: this.invoiceJob.note
    };
    this.apiProvider.generateInvoice(body).subscribe((invoice: any) => {
      if (invoice.status ===  1) {
        this.router.navigate(['/invoicing']);
      }
    });
  }

  generateInvoice() {
    const appliedTax = Math.ceil(this.invoiceJob.taxPercentage);
    const body = {
      jobId: this.invoiceJob._id,
      tax: appliedTax,
      charges: this.invoiceJob.charges,
      timeSpent: this.invoiceJob.timeSpent,
      hourlyRate: this.invoiceJob.hourlyRate,
      items: JSON.stringify(this.invoiceJob.items)
    };
    if (this.invoiceJob.items.length > 0) {
      body['includePO'] = true;
    }
    if (this.editInvoice) {
      delete body['jobId'];
      body['invoiceId'] = this.invoiceJob._id;
      this.apiProvider.updateInvoice(body).subscribe((invoice: any) => {
        console.log(invoice);
        if (invoice.status === 1) {
          this.apiProvider.updateInvoiceDetail(this.invoiceJob);
          this.router.navigate(['invoicing/invoice-detail']);
        }
      });
    } else {
      this.apiProvider.generateInvoice(body).subscribe((invoice: any) => {
        if (invoice.status ===  1) {
          this.router.navigate(['/invoicing']);
        }
      });
    }
  }

  generatePurchaseOrder(createInvoice?: boolean) {
    let body = {
      items: JSON.stringify(this.invoiceJob.items),
      purchaseOrderId: this.invoiceJob._id,
      customer: this.invoiceJob.customer._id,
      total: this.invoiceJob.total,
      note: this.invoiceJob.note
    };
    if (this.invoiceJob.job) {
      body['job'] = this.invoiceJob.job._id;
    }
    console.log(body);
    this.apiProvider.updatePurchaseOrder(body).subscribe((purchaseOrder: any) => {
      if (purchaseOrder.status === 1) {
        if (createInvoice) {
          this.createPurchaseOrderInvoice();
        } else {
          this.router.navigate(['/invoicing/purchase-order']);
        }
      }
    });
  }

  generateNewPurchaseOrder(createInvoice?: boolean) {
    const body = {
      items: JSON.stringify(this.invoiceJob.items),
      customer: this.invoiceJob.customer,
      total: this.invoiceJob.total,
      note: this.invoiceJob.note
    };
    console.log(body);
    this.apiProvider.createPurchaseOrder(body).subscribe((purchaseOrder: any) => {
      if (purchaseOrder.status === 1) {
        if (createInvoice) {
          this.createPurchaseOrderInvoice();
        } else {
          this.router.navigate(['/invoicing/purchase-order']);
        }
      }
    });
  }

  generateNewEstimate(createInvoice?: boolean) {
    const body = {
      items: JSON.stringify(this.invoiceJob.items),
      customer: this.invoiceJob.customer,
      total: this.invoiceJob.total,
      note: this.invoiceJob.note
    };
    console.log(body);
    this.apiProvider.createEstimate(body).subscribe((purchaseOrder: any) => {
      if (purchaseOrder.status === 1) {
        if (createInvoice) {
          this.createPOEstimate();
        } else {
          this.router.navigate(['/invoicing/estimates']);
        }
      }
    });
  }

  editEstimates(createInvoice?: boolean) {
    const body = {
      items: JSON.stringify(this.invoiceJob.items),
      estimateId: this.invoiceJob._id,
      note: this.invoiceJob.note,
      customer: this.invoiceJob.customer._id,
      total: this.invoiceJob.total
    };
    console.log(body);
    this.apiProvider.updateEstimates(body).subscribe((purchaseOrder: any) => {
      if (purchaseOrder.status === 1) {
        if (createInvoice) {
          this.createPOEstimate();
        } else {
          this.router.navigate(['/invoicing/estimates']);
        }
      }
    });
  }

  createPurchaseInvoice(event) {
    console.log(event);
    if (event.type === 'editEstimate') {
      this.editEstimates(true);
    } else if (event.type === 'editPurchaseOrder') {
      this.generatePurchaseOrder(true);
    }
  }

  createPOEstimate() {
    const body = {
      estimateId: this.invoiceJob._id,
    };

    this.apiProvider.createPOinvoice(body).subscribe((response: any) => {
      console.log(response);
      if (response.status === 1) {
        console.log(response);
        this.apiProvider.getPurchaseOrders().subscribe((purchase: any) => {
          const purchaseOrder = purchase.purchaseOrders;
          purchaseOrder.map((purch: any) => {
            if (purch.estimate._id === this.invoiceJob._id) {
              this.updatePurchaseOrderStatus(1, purch._id);
            }
          });
        });
      }
    });
  }

  createPurchaseOrderInvoice(id?) {
    const body = {
      purchaseOrderId: this.invoiceJob._id,
    };

    if (id) {
      body.purchaseOrderId = id;
    }

    this.apiProvider.createPOinvoice(body).subscribe((response: any) => {
      console.log(response);
    });
  }

  updatePurchaseOrderStatus(stat, id) {
    const body = {
      purchaseOrderId: id,
      status: stat
    };
    this.apiProvider.updatePOstatus(body).subscribe((response: any) => {
      if (response.status === 1) {
        console.log(response);
        this.createPurchaseOrderInvoice(id);
      }
    });
  }

  ngOnDestroy() {
    this.apiProvider.updateInvoiceGenerateJob(null);
    this.apiProvider.updatePurchaseOrderDetail(null);
  }

}
