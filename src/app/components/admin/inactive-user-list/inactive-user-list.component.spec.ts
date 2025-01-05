import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveUserListComponent } from './inactive-user-list.component';

describe('InactiveUserListComponent', () => {
  let component: InactiveUserListComponent;
  let fixture: ComponentFixture<InactiveUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveUserListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InactiveUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
