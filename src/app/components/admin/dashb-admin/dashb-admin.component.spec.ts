import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbAdminComponent } from './dashb-admin.component';

describe('DashbAdminComponent', () => {
  let component: DashbAdminComponent;
  let fixture: ComponentFixture<DashbAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashbAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
