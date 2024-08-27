import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVerwaltungComponent } from './product-verwaltung.component';

describe('ProductVerwaltungComponent', () => {
  let component: ProductVerwaltungComponent;
  let fixture: ComponentFixture<ProductVerwaltungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVerwaltungComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductVerwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
