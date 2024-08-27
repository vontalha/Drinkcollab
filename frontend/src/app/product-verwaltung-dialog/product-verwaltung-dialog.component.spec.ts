import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVerwaltungDialogComponent } from './product-verwaltung-dialog.component';

describe('ProductVerwaltungDialogComponent', () => {
  let component: ProductVerwaltungDialogComponent;
  let fixture: ComponentFixture<ProductVerwaltungDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVerwaltungDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductVerwaltungDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
