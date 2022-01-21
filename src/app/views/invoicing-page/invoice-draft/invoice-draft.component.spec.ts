import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDraftComponent } from './invoice-draft.component';

describe('InvoiceDraftComponent', () => {
  let component: InvoiceDraftComponent;
  let fixture: ComponentFixture<InvoiceDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
