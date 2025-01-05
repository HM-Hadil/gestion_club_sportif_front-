import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbEntreneurComponent } from './dashb-entreneur.component';

describe('DashbEntreneurComponent', () => {
  let component: DashbEntreneurComponent;
  let fixture: ComponentFixture<DashbEntreneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbEntreneurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashbEntreneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
