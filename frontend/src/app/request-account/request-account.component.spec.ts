import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccountComponent } from './request-account.component';

describe('RequestAccountComponent', () => {
  let component: RequestAccountComponent;
  let fixture: ComponentFixture<RequestAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
