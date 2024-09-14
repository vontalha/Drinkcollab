import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalButton2Component } from './paypal-button2.component';

describe('PaypalButton2Component', () => {
  let component: PaypalButton2Component;
  let fixture: ComponentFixture<PaypalButton2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaypalButton2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaypalButton2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
