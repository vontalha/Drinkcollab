import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTabComponent } from './login-tab.component';

describe('LoginTabComponent', () => {
  let component: LoginTabComponent;
  let fixture: ComponentFixture<LoginTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
