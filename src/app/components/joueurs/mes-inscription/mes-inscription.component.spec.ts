import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInscriptionComponent } from './mes-inscription.component';

describe('MesInscriptionComponent', () => {
  let component: MesInscriptionComponent;
  let fixture: ComponentFixture<MesInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesInscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
